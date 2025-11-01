import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ResultViewer } from './resultViewer';

export function activate(context: vscode.ExtensionContext) {
    console.log('LinqPad Runner extension is now active!');

    // Function to detect if content contains Dump() calls or Dumpify methods
    function containsDumpCalls(content: string): boolean {
        return /\.(Dump|DumpText|DumpConsole|DumpDebug|DumpTrace)\(\)|^[^\/]*\b(Dump|DumpText|DumpConsole|DumpDebug|DumpTrace)\(|ColorConfig|DumpColor/gm.test(content);
    }

    // Function to analyze query header and suggest missing elements
    function analyzeQueryHeader(content: string): { suggestions: string[], needsPrompt: boolean } {
        const suggestions: string[] = [];
        let needsPrompt = false;

        // Check for Query tag
        if (!content.includes('<Query')) {
            suggestions.push('Add <Query Kind="Program"> header');
            needsPrompt = true;
        } else {
            // Validate Query Kind consistency
            const hasMainMethod = /(?:void|Task|async\s+Task)\s+Main\s*\(/g.test(content);
            const hasTopLevelStatements = /^(?!.*void\s+Main|.*Task\s+Main|.*class\s+|.*interface\s+|.*struct\s+).*[a-zA-Z].*[\.\(;]/gm.test(content.replace(/<Query[\s\S]*?<\/Query>/g, ''));

            if (content.includes('Kind="Program"')) {
                if (!hasMainMethod && hasTopLevelStatements) {
                    suggestions.push('⚠️ Query Kind="Program" requires a Main() method. Consider:\n  • Change to Kind="Statements" for top-level code, OR\n  • Wrap code in: void Main() { ... }');
                    needsPrompt = true;
                }
            } else if (content.includes('Kind="Statements"')) {
                if (hasMainMethod) {
                    suggestions.push('💡 Found Main() method - consider changing to Kind="Program" for better structure');
                    needsPrompt = true;
                }
            } else if (!content.includes('Kind=')) {
                if (hasMainMethod) {
                    suggestions.push('Add Kind="Program" (Main method detected)');
                } else {
                    suggestions.push('Add Kind="Statements" (top-level statements detected)');
                }
                needsPrompt = true;
            }
        }

        // Check for RuntimeVersion if .NET references are detected or if no Query tag
        if ((content.includes('.dll') || !content.includes('<Query')) && !content.includes('<RuntimeVersion>')) {
            suggestions.push('Add <RuntimeVersion>8.0</RuntimeVersion> for .NET 8 compatibility');
            needsPrompt = true;
        }

        // Check for common missing namespaces based on actual usage
        const namespaceChecks = [
            { pattern: /JsonSerializer|JsonPropertyName|JsonExtensionData/g, namespace: 'System.Text.Json', description: 'for JSON operations' },
            { pattern: /JsonSerializer/g, namespace: 'System.Text.Json.Serialization', description: 'for JSON serialization' },
            { pattern: /Task\.|async|await/g, namespace: 'System.Threading.Tasks', description: 'for async operations' },
            { pattern: /GetCustomAttribute|BindingFlags|GetProperties|GetMethods|typeof/g, namespace: 'System.Reflection', description: 'for reflection operations' },
            { pattern: /HttpClient|HttpResponseMessage/g, namespace: 'System.Net.Http', description: 'for HTTP operations' },
            { pattern: /File\.|Directory\.|Path\./g, namespace: 'System.IO', description: 'for file operations' },
            { pattern: /Regex\./g, namespace: 'System.Text.RegularExpressions', description: 'for regex operations' }
        ];

        for (const { pattern, namespace, description } of namespaceChecks) {
            if (pattern.test(content) && !content.includes(`<Namespace>${namespace}</Namespace>`)) {
                suggestions.push(`Add <Namespace>${namespace}</Namespace> ${description}`);
                needsPrompt = true;
            }
        }

        return { suggestions, needsPrompt };
    }

    // Function to analyze LPRun version requirements
    function analyzeLPRunRequirements(content: string): { requiredVersion: string | null, reasons: string[] } {
        const reasons: string[] = [];
        let requiredVersion: string | null = null;

        // Check for .NET 8.0 runtime requirement
        if (content.includes('<RuntimeVersion>8.0</RuntimeVersion>')) {
            requiredVersion = 'LPRun9';
            reasons.push('.NET 8.0 runtime specified (requires LINQPad 9)');
        }

        // Check for .NET 8.0 assemblies in references
        const net8References = content.match(/<Reference[^>]*>.*\\net8\.0\\.*\.dll<\/Reference>/g);
        if (net8References && net8References.length > 0) {
            requiredVersion = 'LPRun9';
            reasons.push(`.NET 8.0 assemblies referenced: ${net8References.length} found`);
        }

        // Check for .NET 7.0 assemblies
        const net7References = content.match(/<Reference[^>]*>.*\\net7\.0\\.*\.dll<\/Reference>/g);
        if (net7References && net7References.length > 0 && !requiredVersion) {
            requiredVersion = 'LPRun8';
            reasons.push(`.NET 7.0 assemblies referenced: ${net7References.length} found`);
        }

        // Check for modern C# features that require newer versions
        if (content.includes('record ') || content.includes('record{')) {
            if (!requiredVersion || requiredVersion === 'LPRun8') {
                requiredVersion = 'LPRun8';
                reasons.push('C# record types detected (requires LINQPad 8+)');
            }
        }

        // Check for top-level programs with global using
        if (content.includes('global using ') && content.includes('<Query Kind="Program">')) {
            if (!requiredVersion || requiredVersion === 'LPRun8') {
                requiredVersion = 'LPRun8';
                reasons.push('Global using statements detected (requires LINQPad 8+)');
            }
        }

        // Check for minimal APIs or modern ASP.NET Core patterns
        if (content.includes('WebApplication.') || content.includes('builder.Services.')) {
            requiredVersion = 'LPRun9';
            reasons.push('Modern ASP.NET Core patterns detected (requires LINQPad 9)');
        }

        return { requiredVersion, reasons };
    }

    // Function to validate LPRun executable against requirements
    function validateLPRunCompatibility(lprunPath: string, requirements: { requiredVersion: string | null, reasons: string[] }): { isCompatible: boolean, message?: string } {
        if (!requirements.requiredVersion) {
            return { isCompatible: true };
        }

        const executableName = path.basename(lprunPath).toLowerCase();

        // Map executable names to versions
        const versionMap: { [key: string]: number } = {
            'lprun9.exe': 9,
            'lprun9-x64.exe': 9,
            'lprun8.exe': 8,
            'lprun8-x64.exe': 8,
            'lprun7.exe': 7,
            'lprun7-x64.exe': 7,
            'lprun6.exe': 6,
            'lprun.exe': 5 // Legacy LPRun
        };

        const detectedVersion = versionMap[executableName] || 5;
        const requiredVersionNumber = parseInt(requirements.requiredVersion.replace('LPRun', ''));

        if (detectedVersion < requiredVersionNumber) {
            const message = `LINQPad Version Compatibility Issue\n\nYour script requires LPRun${requiredVersionNumber} but you're using LINQPad ${detectedVersion}.\n\nReasons:\n${requirements.reasons.map(r => `• ${r}`).join('\n')}\n\nOptions:\n1. Install LINQPad 9 from https://www.linqpad.net\n2. Update extension's LPRun path in settings\n3. Or remove <RuntimeVersion>8.0</RuntimeVersion> for LINQPad 7 compatibility`;

            return { isCompatible: false, message };
        }

        return { isCompatible: true };
    }

    // Function to inject Dumpify package reference and using statement automatically
    function injectDumpSupport(content: string): string {
        const lines = content.split('\n');
        const queryLineIndex = lines.findIndex(line => line.trim().startsWith('<Query'));

        if (queryLineIndex === -1) {
            // No Query tag found, add at the beginning
            const usingStatement = 'using Dumpify;';
            return usingStatement + '\n\n' + content;
        }

        // Check if already has NuGet reference for Dumpify
        const hasDumpifyRef = content.includes('<NuGetReference>Dumpify</NuGetReference>') ||
            content.includes('<Namespace>Dumpify</Namespace>') ||
            content.includes('using Dumpify;');

        if (hasDumpifyRef) {
            return content;
        }

        // Find the end of the Query tag
        const queryLine = lines[queryLineIndex];
        const isQueryTagClosed = queryLine.includes('</Query>') || queryLine.includes('/>');

        let nugetRef: string;
        let usingStatement: string;

        if (isQueryTagClosed) {
            // Self-closing or single-line Query tag
            if (queryLine.includes('/>')) {
                // Self-closing tag - replace with multi-line
                lines[queryLineIndex] = queryLine.replace('/>', '>');
                nugetRef = '  <NuGetReference>Dumpify</NuGetReference>';
                lines.splice(queryLineIndex + 1, 0, nugetRef, '</Query>');
            } else {
                // Has </Query> on same line
                lines[queryLineIndex] = queryLine.replace('</Query>', '');
                nugetRef = '  <NuGetReference>Dumpify</NuGetReference>';
                lines.splice(queryLineIndex + 1, 0, nugetRef, '</Query>');
            }
        } else {
            // Multi-line Query tag - find the closing tag
            const queryEndIndex = lines.findIndex((line, index) =>
                index > queryLineIndex && line.trim() === '</Query>'
            );

            if (queryEndIndex !== -1) {
                nugetRef = '  <NuGetReference>Dumpify</NuGetReference>';
                lines.splice(queryEndIndex, 0, nugetRef);
            } else {
                // No closing tag found, add it
                nugetRef = '  <NuGetReference>Dumpify</NuGetReference>';
                lines.splice(queryLineIndex + 1, 0, nugetRef, '</Query>');
            }
        }

        // Add using statement after Query block
        const finalQueryEndIndex = lines.findIndex((line, index) =>
            index > queryLineIndex && line.trim() === '</Query>'
        );

        if (finalQueryEndIndex !== -1) {
            // Check if using Dumpify already exists
            const hasUsingStatement = lines.some(line =>
                line.trim() === 'using Dumpify;' || line.includes('using Dumpify')
            );

            if (!hasUsingStatement) {
                usingStatement = 'using Dumpify;';
                lines.splice(finalQueryEndIndex + 1, 0, '', usingStatement);
            }
        }

        return lines.join('\n');
    }

    // Function to add missing query elements to content
    function addMissingQueryElements(content: string, suggestions: string[]): string {
        let lines = content.split('\n');
        let queryLineIndex = lines.findIndex(line => line.trim().startsWith('<Query'));

        // Check for Query Kind structure issues
        const needsMainMethodWrapper = suggestions.some(s => s.includes('Query Kind="Program" requires a Main()'));
        const needsKindChange = suggestions.some(s => s.includes('Change to Kind="Statements"'));

        if (queryLineIndex === -1) {
            // No Query tag found, add complete header at the beginning
            const hasMainMethod = /(?:void|Task|async\s+Task)\s+Main\s*\(/g.test(content);
            const kind = hasMainMethod ? 'Program' : 'Statements';

            const headerLines = [
                `<Query Kind="${kind}">`,
                '  <RuntimeVersion>8.0</RuntimeVersion>',
                '</Query>',
                '',
                'using System;',
                'using System.Threading.Tasks;',
                ''
            ];
            lines = headerLines.concat(lines);
            return lines.join('\n');
        }

        // Handle Query Kind fixes
        if (needsKindChange) {
            const queryLine = lines[queryLineIndex];
            lines[queryLineIndex] = queryLine.replace(/Kind="Program"/, 'Kind="Statements"');
        } else if (needsMainMethodWrapper) {
            // Wrap the code in a Main method
            const queryEndIndex = lines.findIndex((line, index) =>
                index > queryLineIndex && line.trim() === '</Query>'
            );

            if (queryEndIndex !== -1) {
                // Find the actual code start (after Query block and any using statements)
                let codeStartIndex = queryEndIndex + 1;
                while (codeStartIndex < lines.length &&
                    (lines[codeStartIndex].trim() === '' ||
                        lines[codeStartIndex].trim().startsWith('using ') ||
                        lines[codeStartIndex].trim().startsWith('//'))) {
                    codeStartIndex++;
                }

                if (codeStartIndex < lines.length) {
                    // Wrap remaining code in Main method
                    const codeLines = lines.slice(codeStartIndex);
                    const wrappedCode = [
                        'void Main()',
                        '{',
                        ...codeLines.map(line => '    ' + line),
                        '}'
                    ];
                    lines = lines.slice(0, codeStartIndex).concat(wrappedCode);
                }
            }
        }

        // Find the Query tag structure
        const queryLine = lines[queryLineIndex];
        const isQueryTagClosed = queryLine.includes('</Query>') || queryLine.includes('/>');

        // Convert self-closing tag to multi-line if needed
        if (queryLine.includes('/>')) {
            lines[queryLineIndex] = queryLine.replace('/>', '>');
        }

        // Find where to insert new elements
        let insertIndex = queryLineIndex + 1;
        if (isQueryTagClosed && queryLine.includes('</Query>')) {
            // Single line Query tag, need to expand it
            lines[queryLineIndex] = queryLine.replace('</Query>', '');
            insertIndex = queryLineIndex + 1;
        }

        // Add missing elements based on suggestions
        const newElements: string[] = [];

        for (const suggestion of suggestions) {
            if (suggestion.includes('RuntimeVersion')) {
                newElements.push('  <RuntimeVersion>8.0</RuntimeVersion>');
            } else if (suggestion.includes('Namespace>')) {
                const namespace = suggestion.match(/<Namespace>(.*)<\/Namespace>/)?.[1];
                if (namespace) {
                    newElements.push(`  <Namespace>${namespace}</Namespace>`);
                }
            }
        }

        // Insert new elements
        if (newElements.length > 0) {
            lines.splice(insertIndex, 0, ...newElements);
            insertIndex += newElements.length;
        }

        // Ensure Query tag is properly closed
        const queryEndIndex = lines.findIndex((line, index) =>
            index >= insertIndex && line.trim() === '</Query>'
        );

        if (queryEndIndex === -1) {
            lines.splice(insertIndex, 0, '</Query>');
        }

        return lines.join('\n');
    }

    // Register command for running LinqPad files
    const disposable = vscode.commands.registerCommand('linq-runner.run', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document = editor.document;
        if (path.extname(document.fileName) !== '.linq') {
            vscode.window.showErrorMessage('Please select a .linq file');
            return;
        }

        // Check if the content needs Dumpify support injection
        const originalContent = document.getText();

        // Analyze query header for missing elements FIRST
        const analysis = analyzeQueryHeader(originalContent);

        if (analysis.needsPrompt) {
            const suggestions = analysis.suggestions.join('\\n• ');
            const message = `Your .linq file is missing important query elements that may cause errors:
            
• ${suggestions}

Without these, you'll get confusing errors like "You must specify a language (-lang=...)".

Would you like me to add these automatically?`;

            const choice = await vscode.window.showWarningMessage(
                'Missing LINQPad Query Elements',
                { modal: true },
                'Yes, fix automatically',
                'No, run anyway',
                'Cancel'
            );

            if (choice === 'Yes, fix automatically') {
                let enhancedContent = addMissingQueryElements(originalContent, analysis.suggestions);

                // Save the enhanced content back to the file
                const edit = new vscode.WorkspaceEdit();
                edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), enhancedContent);
                await vscode.workspace.applyEdit(edit);
                await document.save();

                vscode.window.showInformationMessage('✅ Query header enhanced successfully! You can now run the script.');
                return; // Let user run again with the fixed file
            } else if (choice === 'Cancel') {
                return;
            }
            // If "No, run anyway" - continue with execution
        }

        const conversionNeeded = containsDumpCalls(originalContent);

        let contentToRun = originalContent;
        if (conversionNeeded) {
            contentToRun = injectDumpSupport(originalContent);
        }

        // Save the processed content to a temporary file
        const tempDir = path.join(path.dirname(document.fileName), '.vscode-linq-temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFileName = path.join(tempDir, `temp_${Date.now()}.linq`);

        try {
            fs.writeFileSync(tempFileName, contentToRun, 'utf8');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create temporary file: ${error}`);
            return;
        }

        // Get configuration for LPRun path - RESPECT USER SETTINGS ONLY
        const config = vscode.workspace.getConfiguration('linqpadRunner');
        let lprunPath = config.get<string>('lprunPath');

        if (!lprunPath) {
            // NO FALLBACK - User must configure the path
            const choice = await vscode.window.showErrorMessage(
                'LPRun.exe path not configured',
                {
                    modal: true,
                    detail: `Please configure your LINQPad executable path:

1. Go to File > Preferences > Settings
2. Search for "LinqPad Runner"
3. Set "Lprun Path" to your LINQPad executable

Examples:
• C:\\Program Files\\LINQPad9\\LPRun9.exe
• C:\\Program Files\\LINQPad8\\LPRun8.exe
• C:\\Zips\\Apps\\Linqpad9\\LPRun9-x64.exe`
                },
                'Open Settings',
                'Cancel'
            );

            if (choice === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'linqpadRunner.lprunPath');
            }
            return;
        }

        // Verify the configured path exists
        if (!fs.existsSync(lprunPath)) {
            vscode.window.showErrorMessage(
                `Configured LPRun path does not exist: ${lprunPath}
                
Please update your settings with the correct path.`
            );
            return;
        }

        // Validate LPRun version compatibility
        const lprunRequirements = analyzeLPRunRequirements(contentToRun);
        const compatibility = validateLPRunCompatibility(lprunPath, lprunRequirements);

        if (!compatibility.isCompatible && compatibility.message) {
            const executableName = path.basename(lprunPath);
            const enhancedMessage = `${compatibility.message}

Current setting: ${lprunPath}
Detected executable: ${executableName}

To fix this:
1. Install LINQPad 9 from https://www.linqpad.net
2. Update your settings to point to LPRun9.exe
3. Or remove <RuntimeVersion>8.0</RuntimeVersion> if .NET 7 is acceptable`;

            const choice = await vscode.window.showWarningMessage(
                'LINQPad Version Compatibility Issue',
                { modal: true, detail: enhancedMessage },
                'Open Settings',
                'Continue anyway',
                'Cancel'
            );

            if (choice === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'linqpadRunner.lprunPath');
                return;
            } else if (choice !== 'Continue anyway') {
                return;
            }
        }

        // Create output channel
        const outputChannel = vscode.window.createOutputChannel('LinqPad Runner');
        outputChannel.clear();
        
        // Get output destination settings
        const viewerConfig = vscode.workspace.getConfiguration('linqpadRunner');
        const useInteractiveViewer = viewerConfig.get<boolean>('useInteractiveViewer', true);
        const outputDestination = viewerConfig.get<string>('outputDestination', 'both');
        
        // Show console based on destination setting
        const showConsole = outputDestination === 'both' || outputDestination === 'consoleOnly';
        const showViewer = useInteractiveViewer && (outputDestination === 'both' || outputDestination === 'viewerOnly');
        
        if (showConsole) {
            outputChannel.show();
        }

        if (showViewer) {
            ResultViewer.clear();
        }

        // Always show header
        outputChannel.appendLine('═══════════════════════════════════════════════════════════════');
        outputChannel.appendLine('🚀 LinqPad Runner Extension - Enhanced with Dumpify');
        outputChannel.appendLine('═══════════════════════════════════════════════════════════════');
        outputChannel.appendLine('');

        // Show version information if requirements detected
        if (lprunRequirements.requiredVersion) {
            const executableName = path.basename(lprunPath);
            outputChannel.appendLine(`📋 Script Requirements: ${lprunRequirements.requiredVersion}`);
            outputChannel.appendLine(`🔧 Using: ${executableName}`);
            if (lprunRequirements.reasons.length > 0) {
                outputChannel.appendLine(`📝 Reasons: ${lprunRequirements.reasons.join(', ')}`);
            }
            outputChannel.appendLine('');
        }

        if (conversionNeeded) {
            outputChannel.appendLine('✨ Auto-injected Dumpify support (NuGet package + using statements)');
            outputChannel.appendLine('   Now supports: .Dump(), .DumpText(), .DumpConsole(), .DumpDebug(), and more!');
            outputChannel.appendLine('');
        }

        outputChannel.appendLine(`Running: ${lprunPath} "${tempFileName}"`);
        outputChannel.appendLine('🔄 Loading and executing script...');
        outputChannel.appendLine('');

        let hasOutputStarted = false;
        let capturedOutput = '';
        let outputBuffer = '';
        let inDumpSection = false;
        let dumpLabel = '';

        // Execute LPRun
        const child = cp.spawn(lprunPath, [tempFileName], {
            cwd: path.dirname(document.fileName)
        });

        // Open the interactive viewer immediately with a running placeholder
        // so users see the preview window while the process is still executing.
        if (showViewer) {
            try {
                ResultViewer.show(context, '⏳ Running...', 'Running');
            } catch (e) {
                // Non-fatal: ensure runtime doesn't crash if viewer cannot open
                console.log('Could not open ResultViewer immediately:', e);
            }
        }

        child.stdout?.on('data', (data) => {
            const output = data.toString();
            capturedOutput += output;
            outputBuffer += output;

            if (!hasOutputStarted) {
                if (showConsole) {
                    outputChannel.appendLine('📄 Script Output:');
                    outputChannel.appendLine('─'.repeat(50));
                }
                hasOutputStarted = true;
            }
            
            if (showConsole) {
                outputChannel.append(output);
            }

            // Send to interactive viewer if enabled
            if (showViewer) {
                // Try to extract label from output (Dumpify format: "Label: value" or emoji + text)
                const labelMatch = output.match(/(?:^|\n)([^:\n]+):\s*$/m) ||
                    output.match(/(?:^|\n)((?:🎉|✅|📋|🎯|⚡)[^:\n]+)/);

                if (labelMatch) {
                    dumpLabel = labelMatch[1].trim();
                }

                // Check if we have complete JSON object/array
                const hasCompleteJson = (str: string) => {
                    const trimmed = str.trim();
                    if (trimmed.startsWith('{') && trimmed.endsWith('}')) return true;
                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) return true;
                    if (trimmed.startsWith('<') && trimmed.includes('</')) return true; // HTML
                    return false;
                };

                // Send buffered output when we detect:
                // - Double newline (Dumpify sections)
                // - Horizontal rules
                // - Complete JSON objects
                // - Single newline with complete JSON
                const shouldSend = output.includes('\n\n') || 
                                 output.includes('──') ||
                                 (output.includes('\n') && hasCompleteJson(outputBuffer));

                if (shouldSend && outputBuffer.trim()) {
                    ResultViewer.show(context, outputBuffer.trim(), dumpLabel || 'Output');
                    outputBuffer = '';
                    dumpLabel = '';
                }
            }
        });

        child.stderr?.on('data', (data) => {
            if (!hasOutputStarted) {
                if (showConsole) {
                    outputChannel.appendLine('⚠️ Script Errors/Warnings:');
                    outputChannel.appendLine('─'.repeat(50));
                }
                hasOutputStarted = true;
            }
            if (showConsole) {
                outputChannel.append(data.toString());
            }
        });

        child.on('close', (code) => {
            // Send any remaining buffered output
            if (showViewer && outputBuffer.trim()) {
                ResultViewer.show(context, outputBuffer.trim(), dumpLabel || 'Output');
            }

            if (showConsole) {
                outputChannel.appendLine('');
                outputChannel.appendLine(`Process exited with code ${code}`);
            }

            // Clean up temporary file
            try {
                fs.unlinkSync(tempFileName);
            } catch (error) {
                console.log(`Could not delete temporary file: ${error}`);
            }
        });

        child.on('error', (error) => {
            outputChannel.appendLine(`Error: ${error.message}`);
            vscode.window.showErrorMessage(`Failed to run LPRun: ${error.message}`);

            // Clean up temporary file
            try {
                fs.unlinkSync(tempFileName);
            } catch (cleanupError) {
                console.log(`Could not delete temporary file: ${cleanupError}`);
            }
        });
    });

    // Register command for opening examples
    const openExamplesDisposable = vscode.commands.registerCommand('linq-runner.openExamples', () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const exampleFiles = [
            { name: 'Comprehensive Dump Demo', file: 'comprehensive_dump_demo.linq' },
            { name: 'Dumpify Showcase', file: 'linq-extension/examples/DumpifyShowcase.linq' }
        ];

        vscode.window.showQuickPick(
            exampleFiles.map(example => ({
                label: example.name,
                description: example.file
            })),
            { placeHolder: 'Select an example to open' }
        ).then(async (selection) => {
            if (selection) {
                const examplePath = path.join(workspaceFolder.uri.fsPath, selection.description);
                try {
                    const document = await vscode.workspace.openTextDocument(examplePath);
                    await vscode.window.showTextDocument(document);
                } catch (error) {
                    vscode.window.showErrorMessage(`Could not open example: ${error}`);
                }
            }
        });
    });

    // Register command for creating new .linq files with default template
    const newLinqFileDisposable = vscode.commands.registerCommand('linq-runner.newFile', async () => {
        const fileName = await vscode.window.showInputBox({
            prompt: 'Enter the name for your new .linq file',
            placeHolder: 'MyScript.linq',
            validateInput: (value) => {
                if (!value) return 'File name is required';
                if (!value.endsWith('.linq')) return 'File name must end with .linq';
                return null;
            }
        });

        if (!fileName) return;

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const filePath = path.join(workspaceFolder.uri.fsPath, fileName);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            vscode.window.showErrorMessage(`File ${fileName} already exists`);
            return;
        }

        const defaultTemplate = `<Query Kind="Program">
  <RuntimeVersion>8.0</RuntimeVersion>
  <Namespace>System</Namespace>
  <Namespace>System.Collections.Generic</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>System.Text.Json</Namespace>
</Query>

// 📝 Basic LinqPad script template
// The extension will automatically inject Dumpify if you use .Dump() methods

async Task Main()
{
    "Hello from LINQPad!".Dump("Welcome Message");
    
    // Sample data structures
    var numbers = new[] { 1, 2, 3, 4, 5 };
    numbers.Dump("Sample Array");
    
    var person = new { Name = "John", Age = 30, City = "New York" };
    person.Dump("Sample Object");
    
    // Your code here...
    
    "Script completed successfully!".Dump("Status");
}

// Add your helper methods below
void HelperMethod()
{
    // Your helper methods here
}

// Add your classes below  
class MyClass
{
    public string Name { get; set; }
    public int Value { get; set; }
}
`;

        try {
            fs.writeFileSync(filePath, defaultTemplate, 'utf8');
            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document);
            vscode.window.showInformationMessage(`✅ Created new .linq file: ${fileName}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create file: ${error}`);
        }
    });

    // Register command for creating new .linq files with Dumpify template
    const newDumpifyFileDisposable = vscode.commands.registerCommand('linq-runner.newDumpifyFile', async () => {
        const fileName = await vscode.window.showInputBox({
            prompt: 'Enter the name for your new .linq file with Dumpify support',
            placeHolder: 'MyDumpifyScript.linq',
            validateInput: (value) => {
                if (!value) return 'File name is required';
                if (!value.endsWith('.linq')) return 'File name must end with .linq';
                return null;
            }
        });

        if (!fileName) return;

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const filePath = path.join(workspaceFolder.uri.fsPath, fileName);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            vscode.window.showErrorMessage(`File ${fileName} already exists`);
            return;
        }

        const dumpifyTemplate = `<Query Kind="Program">
  <RuntimeVersion>8.0</RuntimeVersion>
  <NuGetReference>Dumpify</NuGetReference>
  <Namespace>System</Namespace>
  <Namespace>System.Collections.Generic</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>System.Text.Json</Namespace>
  <Namespace>System.Text.Json.Serialization</Namespace>
  <Namespace>Dumpify</Namespace>
</Query>

// 🎨 LinqPad script with full Dumpify support
// This template includes Dumpify for enhanced formatting and colors

async Task Main()
{
    // Welcome message with enhanced formatting
    "🚀 Welcome to LinqPad with Dumpify!".DumpConsole("Getting Started");
    
    // Sample data to showcase different dump methods
    var sampleData = new
    {
        Name = "Sample Data",
        Timestamp = DateTime.Now,
        Items = new[] { "Item1", "Item2", "Item3" },
        Settings = new { Theme = "Dark", AutoSave = true }
    };
    
    // Different dump methods showcase:
    sampleData.Dump("Standard JSON formatting");
    sampleData.DumpText("ASCII table format");
    sampleData.DumpConsole("Console with borders");
    
    // Your code goes here...
    // Available dump methods:
    // .Dump() - Beautiful JSON output
    // .DumpText() - ASCII table formatting
    // .DumpConsole() - Console-formatted output  
    // .DumpDebug() - Debug output formatting
    // .DumpTrace() - Trace output formatting
}

// Add your helper methods here
`;

        try {
            fs.writeFileSync(filePath, dumpifyTemplate, 'utf8');
            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document);
            vscode.window.showInformationMessage(`✅ Created new .linq file with Dumpify support: ${fileName}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create file: ${error}`);
        }
    });

    // Register F12 Go to Definition provider
    const definitionProvider = vscode.languages.registerDefinitionProvider('linq', {
        provideDefinition(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) return null;

            const word = document.getText(wordRange);
            const line = document.lineAt(position.line).text;
            const text = document.getText();

            // Handle #load directive - navigate to loaded file
            if (line.includes('#load')) {
                const pathMatch = line.match(/#load\s+"([^"]+)"/);
                if (pathMatch) {
                    const loadPath = pathMatch[1];
                    const fullPath = path.isAbsolute(loadPath)
                        ? loadPath
                        : path.join(path.dirname(document.fileName), loadPath);

                    if (fs.existsSync(fullPath)) {
                        return new vscode.Location(
                            vscode.Uri.file(fullPath),
                            new vscode.Position(0, 0)
                        );
                    }
                }
                return null;
            }

            // Handle NuGet reference - open package URL
            if (line.includes('<NuGetReference>') && line.includes(word)) {
                const packageMatch = line.match(/<NuGetReference>([^<]+)<\/NuGetReference>/);
                if (packageMatch) {
                    const packageName = packageMatch[1];
                    const nugetUrl = `https://www.nuget.org/packages/${packageName}`;
                    vscode.env.openExternal(vscode.Uri.parse(nugetUrl));
                    return null;
                }
            }

            // Find method definitions
            const methodPatterns = [
                new RegExp(`(?:void|Task|async\\s+Task|int|string|bool|var|public|private|protected)\\s+${word}\\s*\\(`, 'g'),
                new RegExp(`static\\s+(?:void|Task|async\\s+Task|int|string|bool|var)\\s+${word}\\s*\\(`, 'g')
            ];

            const locations: vscode.Location[] = [];

            for (const pattern of methodPatterns) {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    const pos = document.positionAt(match.index);
                    locations.push(new vscode.Location(document.uri, pos));
                }
            }

            // Find class definitions
            const classPattern = new RegExp(`(?:class|interface|struct|record)\\s+${word}\\s*[:{<]`, 'g');
            let classMatch;
            while ((classMatch = classPattern.exec(text)) !== null) {
                const pos = document.positionAt(classMatch.index);
                locations.push(new vscode.Location(document.uri, pos));
            }

            // Find property definitions
            const propertyPattern = new RegExp(`(?:public|private|protected|internal)?\\s*\\w+\\s+${word}\\s*{`, 'g');
            let propMatch;
            while ((propMatch = propertyPattern.exec(text)) !== null) {
                const pos = document.positionAt(propMatch.index);
                locations.push(new vscode.Location(document.uri, pos));
            }

            return locations.length > 0 ? locations : null;
        }
    });

    // Register Hover provider for quick info
    const hoverProvider = vscode.languages.registerHoverProvider('linq', {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) return null;

            const word = document.getText(wordRange);
            const line = document.lineAt(position.line).text;

            // Provide hover info for Dumpify methods
            const dumpifyMethods: { [key: string]: string } = {
                'Dump': 'LinqPad native method - Displays object as formatted JSON',
                'DumpText': 'Dumpify method - Displays object as ASCII table (auto-injected by extension)',
                'DumpConsole': 'Dumpify method - Displays object with console borders (auto-injected by extension)',
                'DumpDebug': 'Dumpify method - Displays object with debug formatting (auto-injected by extension)',
                'DumpTrace': 'Dumpify method - Displays object with trace formatting (auto-injected by extension)'
            };

            if (dumpifyMethods[word]) {
                return new vscode.Hover(dumpifyMethods[word]);
            }

            // Provide hover info for NuGet packages
            if (line.includes('<NuGetReference>')) {
                const packageMatch = line.match(/<NuGetReference>([^<]+)<\/NuGetReference>/);
                if (packageMatch) {
                    const packageName = packageMatch[1];
                    return new vscode.Hover(`**NuGet Package**: ${packageName}\n\nClick to open on nuget.org`);
                }
            }

            // Provide hover info for Query attributes
            const queryAttributes: { [key: string]: string } = {
                'RuntimeVersion': 'Specifies the .NET runtime version (e.g., 8.0 for .NET 8)',
                'Kind': 'Query type: Program (with Main), Statements (top-level), or Expression',
                'Namespace': 'Imports a namespace for use in the query',
                'NuGetReference': 'References a NuGet package'
            };

            if (queryAttributes[word]) {
                return new vscode.Hover(queryAttributes[word]);
            }

            return null;
        }
    });

    // Register Document Symbol provider for Outline view (Ctrl+Shift+O)
    const documentSymbolProvider = vscode.languages.registerDocumentSymbolProvider('linq', {
        provideDocumentSymbols(document, token) {
            const symbols: vscode.DocumentSymbol[] = [];
            const text = document.getText();

            // Find all methods
            const methodRegex = /(?:void|Task|async\s+Task|int|string|bool|var|public|private|protected|static)\s+(\w+)\s*\(/g;
            let methodMatch;
            while ((methodMatch = methodRegex.exec(text)) !== null) {
                const methodName = methodMatch[1];
                const startPos = document.positionAt(methodMatch.index);

                // Find the end of the method (simplified - looks for closing brace)
                let braceCount = 0;
                let endIndex = methodMatch.index;
                let foundStart = false;

                for (let i = methodMatch.index; i < text.length; i++) {
                    if (text[i] === '{') {
                        braceCount++;
                        foundStart = true;
                    } else if (text[i] === '}') {
                        braceCount--;
                        if (foundStart && braceCount === 0) {
                            endIndex = i + 1;
                            break;
                        }
                    }
                }

                const endPos = document.positionAt(endIndex);
                const range = new vscode.Range(startPos, endPos);

                symbols.push(new vscode.DocumentSymbol(
                    methodName,
                    '',
                    vscode.SymbolKind.Method,
                    range,
                    range
                ));
            }

            // Find all classes
            const classRegex = /(?:class|interface|struct|record)\s+(\w+)/g;
            let classMatch;
            while ((classMatch = classRegex.exec(text)) !== null) {
                const className = classMatch[1];
                const startPos = document.positionAt(classMatch.index);

                // Find the end of the class
                let braceCount = 0;
                let endIndex = classMatch.index;
                let foundStart = false;

                for (let i = classMatch.index; i < text.length; i++) {
                    if (text[i] === '{') {
                        braceCount++;
                        foundStart = true;
                    } else if (text[i] === '}') {
                        braceCount--;
                        if (foundStart && braceCount === 0) {
                            endIndex = i + 1;
                            break;
                        }
                    }
                }

                const endPos = document.positionAt(endIndex);
                const range = new vscode.Range(startPos, endPos);

                symbols.push(new vscode.DocumentSymbol(
                    className,
                    '',
                    vscode.SymbolKind.Class,
                    range,
                    range
                ));
            }

            // Find all properties
            const propertyRegex = /(?:public|private|protected|internal)?\s*(\w+)\s+(\w+)\s*{\s*get/g;
            let propMatch;
            while ((propMatch = propertyRegex.exec(text)) !== null) {
                const propertyName = propMatch[2];
                const startPos = document.positionAt(propMatch.index);
                const endPos = document.positionAt(propMatch.index + propMatch[0].length);
                const range = new vscode.Range(startPos, endPos);

                symbols.push(new vscode.DocumentSymbol(
                    propertyName,
                    propMatch[1], // type
                    vscode.SymbolKind.Property,
                    range,
                    range
                ));
            }

            return symbols;
        }
    });

    context.subscriptions.push(
        disposable,
        openExamplesDisposable,
        newLinqFileDisposable,
        newDumpifyFileDisposable,
        definitionProvider,
        hoverProvider,
        documentSymbolProvider
    );
}

export function deactivate() { }
