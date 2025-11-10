import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export class ResultViewer {
    private static currentPanel: vscode.WebviewPanel | undefined;
    private static results: any[] = [];
    private static placement: 'right' | 'below' = 'right';
    private static currentProcess: cp.ChildProcess | undefined;
    private static context: vscode.ExtensionContext | undefined;

    public static show(context: vscode.ExtensionContext, output: string, label?: string) {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;

        if (ResultViewer.currentPanel) {
            ResultViewer.currentPanel.reveal(columnToShowIn);
        } else {
            ResultViewer.currentPanel = vscode.window.createWebviewPanel(
                'linqpadResults',
                'LinqPad Results',
                columnToShowIn,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))
                    ]
                }
            );

            ResultViewer.currentPanel.onDidDispose(() => {
                ResultViewer.currentPanel = undefined;
                ResultViewer.results = [];
            });

            ResultViewer.currentPanel.webview.onDidReceiveMessage(
                message => {
                    switch (message.type) {
                        case 'copy':
                            vscode.env.clipboard.writeText(message.text);
                            vscode.window.showInformationMessage('Copied to clipboard');
                            break;
                        case 'export':
                            ResultViewer.exportToCsv(message.data);
                            break;
                        case 'closeViewer':
                            if (ResultViewer.currentPanel) ResultViewer.currentPanel.dispose();
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );
        }

        // Parse and add result
        const result = ResultViewer.parseOutput(output, label);
        ResultViewer.results.push(result);

        // Update webview content
        ResultViewer.currentPanel.webview.html = ResultViewer.getWebviewContent(
            ResultViewer.currentPanel.webview,
            context.extensionPath
        );

        // Send results to webview
        ResultViewer.currentPanel.webview.postMessage({
            type: 'updateResults',
            results: ResultViewer.results,
            placement: ResultViewer.placement
        });
    }

    private static togglePlacement() {
        if (!ResultViewer.currentPanel) return;
        ResultViewer.placement = ResultViewer.placement === 'right' ? 'below' : 'right';
        const column = ResultViewer.placement === 'right' ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
        try {
            ResultViewer.currentPanel.reveal(column);
        } catch (e) {
            console.log('Failed to reveal panel in requested column:', e);
        }

        // Notify webview so it can update the button icon/state
        try {
            ResultViewer.currentPanel.webview.postMessage({ type: 'placementChanged', placement: ResultViewer.placement });
        } catch (e) {
            // ignore
        }
    }

    public static clear() {
        ResultViewer.results = [];
        if (ResultViewer.currentPanel) {
            ResultViewer.currentPanel.webview.postMessage({
                type: 'updateResults',
                results: []
            });
        }
    }

    public static clearForNewRun() {
        // Clear existing results when starting a new script run
        ResultViewer.results = [];
        if (ResultViewer.currentPanel) {
            ResultViewer.currentPanel.webview.postMessage({
                type: 'clearForNewRun'
            });
        }
    }

    public static ensurePanel(context: vscode.ExtensionContext) {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;

        if (!ResultViewer.currentPanel) {
            ResultViewer.currentPanel = vscode.window.createWebviewPanel(
                'linqpadResults',
                'LinqPad Results',
                columnToShowIn,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))
                    ]
                }
            );

            ResultViewer.currentPanel.onDidDispose(() => {
                ResultViewer.currentPanel = undefined;
                ResultViewer.results = [];
            });

            ResultViewer.currentPanel.webview.onDidReceiveMessage(
                message => {
                    switch (message.type) {
                        case 'copy':
                            vscode.env.clipboard.writeText(message.text);
                            vscode.window.showInformationMessage('Copied to clipboard');
                            break;
                        case 'export':
                            ResultViewer.exportToCsv(message.data);
                            break;
                        case 'closeViewer':
                            if (ResultViewer.currentPanel) ResultViewer.currentPanel.dispose();
                            break;
                        case 'stopExecution':
                            ResultViewer.stopExecution();
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );

            // Set initial HTML content
            ResultViewer.currentPanel.webview.html = ResultViewer.getWebviewContent(
                ResultViewer.currentPanel.webview,
                context.extensionPath
            );
        } else {
            ResultViewer.currentPanel.reveal(columnToShowIn);
        }
        
        ResultViewer.context = context;
    }

    public static setCurrentProcess(process: cp.ChildProcess) {
        ResultViewer.currentProcess = process;
    }

    public static notifyExecutionStarted() {
        if (ResultViewer.currentPanel) {
            ResultViewer.currentPanel.webview.postMessage({
                type: 'executionStarted'
            });
        }
    }

    public static notifyExecutionEnded() {
        if (ResultViewer.currentPanel) {
            ResultViewer.currentPanel.webview.postMessage({
                type: 'executionEnded'
            });
        }
        ResultViewer.currentProcess = undefined;
    }

    private static stopExecution() {
        if (ResultViewer.currentProcess) {
            ResultViewer.currentProcess.kill();
            vscode.window.showInformationMessage('Script execution stopped');
        }
    }

    private static parseOutput(output: string, label?: string): any {
        const timestamp = new Date().toLocaleTimeString();
        
        // Simple cleanup - trim whitespace
        let cleanOutput = output.trim();

        // Try to parse as JSON
        try {
            let parsed: any;
            try {
                parsed = JSON.parse(cleanOutput);
            } catch {
                // If that fails, try to extract JSON from the output
                const jsonMatch = cleanOutput.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('No JSON found');
                }
            }
            
            // Regular JSON or table
            return {
                type: Array.isArray(parsed) ? 'table' : 'json',
                label: label || 'Output',
                data: parsed,
                timestamp,
                raw: output
            };
        } catch (e) {
            // Not JSON, continue
        }

        // Check if it's a table-like output
        if (output.includes('│') || output.includes('┌') || output.includes('─')) {
            return {
                type: 'text',
                label: label || 'Output',
                data: output,
                timestamp,
                raw: output
            };
        }

        // Plain text
        return {
            type: 'text',
            label: label || 'Output',
            data: output,
            timestamp,
            raw: output
        };
    }

    private static getWebviewContent(webview: vscode.Webview, extensionPath: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LinqPad Results</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
            flex-wrap: wrap;
            gap: 10px;
        }

        .header h1 {
            font-size: 20px;
            font-weight: 600;
            flex: 1;
        }

        .status-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 12px;
            background: var(--vscode-editor-lineHighlightBackground);
            border-radius: 4px;
            font-size: 12px;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .status-indicator.running::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--vscode-charts-green);
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
        }

        .actions {
            display: flex;
            gap: 10px;
        }

        button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }

        button:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .tabs {
            display: flex;
            gap: 2px;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .tab {
            padding: 8px 16px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 13px;
            color: var(--vscode-foreground);
            opacity: 0.7;
        }

        .tab:hover {
            opacity: 1;
        }

        .tab.active {
            opacity: 1;
            border-bottom-color: var(--vscode-focusBorder);
        }

        .result-section {
            margin-bottom: 15px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            overflow: hidden;
        }

        .section-header {
            background: var(--vscode-editor-lineHighlightBackground);
            padding: 10px 15px;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-header:hover {
            background: var(--vscode-list-hoverBackground);
        }

        .section-toggle {
            font-size: 12px;
            transition: transform 0.2s;
        }

        .section-title {
            font-weight: 600;
            flex: 1;
        }

        .section-content {
            padding: 15px;
            display: none;
        }

        .section-content.visible {
            display: block;
        }

        .result-content {
            display: none;
        }

        .result-content.active {
            display: block;
        }

        .json-tree {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: 1.6;
        }

        .json-key {
            color: var(--vscode-symbolIcon-propertyForeground);
            font-weight: 500;
        }

        .json-string {
            color: var(--vscode-debugTokenExpression-string);
        }

        .json-number {
            color: var(--vscode-debugTokenExpression-number);
        }

        .json-boolean {
            color: var(--vscode-debugTokenExpression-boolean);
        }

        .json-null {
            color: var(--vscode-debugTokenExpression-error);
        }

        .expandable {
            cursor: pointer;
            user-select: none;
        }

        .expandable::before {
            content: '▶ ';
            display: inline-block;
            transition: transform 0.2s;
        }

        .expandable.expanded::before {
            transform: rotate(90deg);
        }

        .json-children {
            margin-left: 20px;
            display: none;
        }

        .json-children.visible {
            display: block;
        }

        .table-container {
            overflow-x: auto;
            margin-top: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        th {
            background: var(--vscode-editor-lineHighlightBackground);
            padding: 8px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid var(--vscode-panel-border);
            cursor: pointer;
            user-select: none;
        }

        th:hover {
            background: var(--vscode-list-hoverBackground);
        }

        td {
            padding: 8px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        tr:hover {
            background: var(--vscode-list-hoverBackground);
        }

        .text-output {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            white-space: pre-wrap;
            background: var(--vscode-textCodeBlock-background);
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }

        .timestamp {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 10px;
        }

        .filter-box {
            margin-bottom: 10px;
        }

        .filter-box input {
            width: 100%;
            padding: 8px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-size: 13px;
        }

        .filter-box input:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }

        .no-results {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }

        .sort-indicator {
            margin-left: 4px;
            font-size: 10px;
        }

        /* Chart styles */
        .chart-container {
            position: relative;
            margin-top: 10px;
            padding: 20px;
            background: var(--vscode-editor-background);
            border-radius: 4px;
        }

        .chart-canvas {
            max-height: 400px;
        }

        /* Image styles */
        .image-container {
            margin-top: 10px;
            text-align: center;
        }

        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* HTML content styles */
        .html-container {
            margin-top: 10px;
            padding: 15px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            overflow: auto;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Interactive Results Viewer</h1>
        <div class="status-bar" id="statusBar" style="display: none;">
            <span class="status-indicator" id="statusIndicator">⏳ Running...</span>
        </div>
        <div class="actions">
            <button id="stopBtn" onclick="stopExecution()" style="display: none;">⏹ Stop</button>
            <a class="action-link" onclick="closeViewer()">Close</a>
            <a class="action-link" onclick="clearResults()">Clear</a>
            <a class="action-link" onclick="copyAll()">Copy</a>
        </div>
    </div>

    <div id="tabs" class="tabs"></div>
    <div id="content"></div>

    <script>
        const vscode = acquireVsCodeApi();
        let results = [];
        let activeTab = 0;

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'updateResults') {
                results = message.results;
                renderResults();
            } else if (message.type === 'clearForNewRun') {
                results = [];
                renderResults();
            } else if (message.type === 'executionStarted') {
                showRunningStatus();
            } else if (message.type === 'executionEnded') {
                hideRunningStatus();
            }
        });

        function showRunningStatus() {
            const statusBar = document.getElementById('statusBar');
            const statusIndicator = document.getElementById('statusIndicator');
            const stopBtn = document.getElementById('stopBtn');
            if (statusBar) {
                statusBar.style.display = 'flex';
                statusIndicator.className = 'status-indicator running';
                statusIndicator.textContent = '⏳ Running...';
            }
            if (stopBtn) stopBtn.style.display = 'inline-block';
        }

        function hideRunningStatus() {
            const statusBar = document.getElementById('statusBar');
            const statusIndicator = document.getElementById('statusIndicator');
            const stopBtn = document.getElementById('stopBtn');
            if (statusBar) {
                statusBar.style.display = 'none';
            }
            if (stopBtn) stopBtn.style.display = 'none';
        }

        function stopExecution() {
            vscode.postMessage({ type: 'stopExecution' });
            const statusIndicator = document.getElementById('statusIndicator');
            if (statusIndicator) {
                statusIndicator.className = 'status-indicator';
                statusIndicator.textContent = '⏹ Stopped';
            }
        }

        function closeViewer() {
            vscode.postMessage({ type: 'closeViewer' });
        }

        function renderResults() {
            if (results.length === 0) {
                document.getElementById('content').innerHTML = '<div class="no-results">Waiting for output...</div>';
                document.getElementById('tabs').innerHTML = '';
                return;
            }

            // Always use single page with collapsible sections for better UX
            // Users can expand/collapse individual sections as needed
            renderSinglePage();
        }

        function renderTabs() {
            // Render tabs
            const tabsHtml = results.map((r, i) => 
                \`<button class="tab \${i === activeTab ? 'active' : ''}" onclick="switchTab(\${i})">
                    \${r.label} <span class="timestamp">(\${r.timestamp})</span>
                </button>\`
            ).join('');
            document.getElementById('tabs').innerHTML = tabsHtml;

            // Render content
            const contentHtml = results.map((r, i) => 
                \`<div class="result-content \${i === activeTab ? 'active' : ''}" id="result-\${i}">
                    \${renderResult(r, i)}
                </div>\`
            ).join('');
            document.getElementById('content').innerHTML = contentHtml;
        }

        function renderSinglePage() {
            // Hide tabs
            document.getElementById('tabs').innerHTML = '';

            // Render all results as collapsible sections in one scrollable page
            const contentHtml = results.map((r, i) => 
                \`<div class="result-section" id="section-\${i}">
                    <div class="section-header" onclick="toggleSection(\${i})">
                        <span class="section-toggle">▼</span>
                        <span class="section-title">\${r.label}</span>
                        <span class="timestamp">(\${r.timestamp})</span>
                    </div>
                    <div class="section-content visible" id="section-content-\${i}">
                        \${renderResult(r, i)}
                    </div>
                </div>\`
            ).join('');
            document.getElementById('content').innerHTML = contentHtml;
        }

        function toggleSection(index) {
            const content = document.getElementById(\`section-content-\${index}\`);
            const section = document.getElementById(\`section-\${index}\`);
            const toggle = section.querySelector('.section-toggle');
            
            if (content.classList.contains('visible')) {
                content.classList.remove('visible');
                toggle.textContent = '▶';
            } else {
                content.classList.add('visible');
                toggle.textContent = '▼';
            }
        }

        function renderResult(result, index) {
            switch (result.type) {
                case 'json':
                    return renderJson(result.data, index);
                case 'table':
                    return renderTable(result.data, index);
                case 'text':
                default:
                    return \`<div class="text-output">\${escapeHtml(result.data)}</div>\`;
            }
        }

        function renderJson(data, index) {
            return \`
                <div class="filter-box">
                    <input type="text" placeholder="Search JSON..." onkeyup="filterJson(\${index}, this.value)">
                </div>
                <div class="json-tree" id="json-\${index}">
                    \${buildJsonTree(data, '', index)}
                </div>
            \`;
        }

        function buildJsonTree(obj, path, index, level = 0) {
            if (obj === null) return '<span class="json-null">null</span>';
            if (obj === undefined) return '<span class="json-null">undefined</span>';
            
            const type = typeof obj;
            if (type === 'string') return \`<span class="json-string">"\${escapeHtml(obj)}"</span>\`;
            if (type === 'number') return \`<span class="json-number">\${obj}</span>\`;
            if (type === 'boolean') return \`<span class="json-boolean">\${obj}</span>\`;
            
            if (Array.isArray(obj)) {
                if (obj.length === 0) return '<span>[]</span>';
                const id = \`json-\${index}-\${path.replace(/\\./g, '-')}\`;
                return \`
                    <span class="expandable" onclick="toggleExpand('\${id}')">Array[\${obj.length}]</span>
                    <div class="json-children" id="\${id}">
                        \${obj.map((item, i) => \`
                            <div>[\${i}]: \${buildJsonTree(item, \`\${path}[\${i}]\`, index, level + 1)}</div>
                        \`).join('')}
                    </div>
                \`;
            }
            
            if (type === 'object') {
                const keys = Object.keys(obj);
                if (keys.length === 0) return '<span>{}</span>';
                const id = \`json-\${index}-\${path.replace(/\\./g, '-')}\`;
                return \`
                    <span class="expandable" onclick="toggleExpand('\${id}')">Object{\${keys.length}}</span>
                    <div class="json-children" id="\${id}">
                        \${keys.map(key => \`
                            <div><span class="json-key">\${key}</span>: \${buildJsonTree(obj[key], \`\${path}.\${key}\`, index, level + 1)}</div>
                        \`).join('')}
                    </div>
                \`;
            }
            
            return String(obj);
        }

        function renderTable(data, index) {
            if (!Array.isArray(data) || data.length === 0) {
                return '<div class="no-results">No data to display</div>';
            }

            const keys = Object.keys(data[0]);
            return \`
                <div class="filter-box">
                    <input type="text" placeholder="Filter table..." onkeyup="filterTable(\${index}, this.value)">
                </div>
                <div class="table-container">
                    <table id="table-\${index}">
                        <thead>
                            <tr>
                                \${keys.map((key, i) => \`<th onclick="sortTable(\${index}, \${i})">\${key} <span class="sort-indicator" id="sort-\${index}-\${i}"></span></th>\`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            \${data.map(row => \`
                                <tr>
                                    \${keys.map(key => \`<td>\${escapeHtml(String(row[key] ?? ''))}</td>\`).join('')}
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                </div>
            \`;
        }

        function toggleExpand(id) {
            const element = document.getElementById(id);
            const parent = element.previousElementSibling;
            if (element.classList.contains('visible')) {
                element.classList.remove('visible');
                parent.classList.remove('expanded');
            } else {
                element.classList.add('visible');
                parent.classList.add('expanded');
            }
        }

        function switchTab(index) {
            activeTab = index;
            renderResults();
        }

        function filterJson(index, query) {
            // Simple implementation - would need more sophisticated filtering
            const jsonDiv = document.getElementById(\`json-\${index}\`);
            if (!query) {
                jsonDiv.style.opacity = '1';
                return;
            }
            // Highlight matches (simplified)
            const text = jsonDiv.innerText.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                jsonDiv.style.opacity = '1';
            } else {
                jsonDiv.style.opacity = '0.3';
            }
        }

        function filterTable(index, query) {
            const table = document.getElementById(\`table-\${index}\`);
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const text = row.innerText.toLowerCase();
                if (text.includes(query.toLowerCase())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }

        let sortDirections = {};

        function sortTable(index, columnIndex) {
            const table = document.getElementById(\`table-\${index}\`);
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            const key = \`\${index}-\${columnIndex}\`;
            const ascending = !sortDirections[key];
            sortDirections[key] = ascending;
            
            rows.sort((a, b) => {
                const aVal = a.cells[columnIndex].innerText;
                const bVal = b.cells[columnIndex].innerText;
                
                const aNum = parseFloat(aVal);
                const bNum = parseFloat(bVal);
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return ascending ? aNum - bNum : bNum - aNum;
                }
                
                return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });
            
            rows.forEach(row => tbody.appendChild(row));
            
            // Update sort indicators
            document.querySelectorAll(\`#table-\${index} .sort-indicator\`).forEach(el => el.textContent = '');
            document.getElementById(\`sort-\${index}-\${columnIndex}\`).textContent = ascending ? '▲' : '▼';
        }

        function clearResults() {
            results = [];
            renderResults();
        }

        function copyAll() {
            const text = results.map(r => \`\${r.label}:\\n\${r.raw}\`).join('\\n\\n');
            vscode.postMessage({ type: 'copy', text });
        }
        function togglePlacement() {
            vscode.postMessage({ type: 'togglePlacement' });
        }
        function updatePlacementButton(placement) {
            const btn = document.getElementById('placementBtn');
            if (!btn) return;
            if (placement === 'right') {
                btn.textContent = '↔️ Right';
                btn.title = 'Show viewer to the right of the editor';
            } else {
                btn.textContent = '↕️ Below';
                btn.title = 'Show viewer below the editor';
            }
        }
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Initial render
        renderResults();
    </script>
</body>
</html>`;
    }

    private static async exportToCsv(data: any[]) {
        if (!Array.isArray(data) || data.length === 0) {
            vscode.window.showWarningMessage('No data to export');
            return;
        }

        const keys = Object.keys(data[0]);
        const csv = [
            keys.join(','),
            ...data.map(row => keys.map(key => JSON.stringify(row[key] ?? '')).join(','))
        ].join('\n');

        const uri = await vscode.window.showSaveDialog({
            filters: { 'CSV Files': ['csv'] },
            defaultUri: vscode.Uri.file('export.csv')
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(csv, 'utf8'));
            vscode.window.showInformationMessage(`Exported to ${uri.fsPath}`);
        }
    }
}
