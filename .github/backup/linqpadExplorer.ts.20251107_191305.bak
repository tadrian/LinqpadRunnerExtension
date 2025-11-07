import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { LinqpadConfigManager } from './linqpadConfig';
import { LinqTreeItem, LinqTreeItemType } from './treeItems';

export class LinqpadExplorer implements vscode.TreeDataProvider<LinqTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<LinqTreeItem | undefined | null | void> = 
        new vscode.EventEmitter<LinqTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<LinqTreeItem | undefined | null | void> = 
        this._onDidChangeTreeData.event;

    private configManager: LinqpadConfigManager;
    private showRecentFiles: boolean = true;

    constructor() {
        this.configManager = new LinqpadConfigManager();
        
        // Load settings
        const config = vscode.workspace.getConfiguration('linqpadRunner');
        this.showRecentFiles = config.get<boolean>('showRecentFiles', true);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: LinqTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: LinqTreeItem): Promise<LinqTreeItem[]> {
        if (!element) {
            // Root level - show query locations and optionally recent files
            return this.getRootItems();
        }

        // Handle recent files section
        if (element.type === LinqTreeItemType.RECENT_SECTION) {
            return this.getRecentFileItems();
        }

        // Handle folders - show children
        if (element.type === LinqTreeItemType.ROOT_FOLDER || element.type === LinqTreeItemType.FOLDER) {
            return this.getFolderChildren(element.fsPath);
        }

        return [];
    }

    private async getRootItems(): Promise<LinqTreeItem[]> {
        const items: LinqTreeItem[] = [];

        // Get query locations from config and VS Code settings
        const configLocations = this.configManager.getAllQueryLocations();
        const config = vscode.workspace.getConfiguration('linqpadRunner');
        const customLocations = config.get<string[]>('queryLocations', []);
        const autoDetect = config.get<boolean>('autoDetectQueryLocations', true);

        let allLocations: string[] = [];
        if (autoDetect) {
            allLocations.push(...configLocations);
        }
        allLocations.push(...customLocations);

        // Remove duplicates
        allLocations = [...new Set(allLocations)];

        // Create root folder items
        for (const location of allLocations) {
            if (fs.existsSync(location)) {
                const folderName = path.basename(location);
                items.push(new LinqTreeItem(
                    folderName,
                    LinqTreeItemType.ROOT_FOLDER,
                    location,
                    vscode.TreeItemCollapsibleState.Expanded
                ));
            }
        }

        // Add recent files section if enabled
        if (this.showRecentFiles && this.configManager.hasLinqpadConfig()) {
            const recentFiles = this.configManager.getRecentFiles();
            if (recentFiles.length > 0) {
                items.push(new LinqTreeItem(
                    'Recent Files',
                    LinqTreeItemType.RECENT_SECTION,
                    '',
                    vscode.TreeItemCollapsibleState.Collapsed
                ));
            }
        }

        // If no locations found, show helpful message
        if (items.length === 0) {
            return [];
        }

        return items;
    }

    private async getRecentFileItems(): Promise<LinqTreeItem[]> {
        const recentFiles = this.configManager.getRecentFiles();
        const items: LinqTreeItem[] = [];

        for (const filePath of recentFiles.slice(0, 10)) { // Show top 10 recent files
            if (fs.existsSync(filePath)) {
                const fileName = path.basename(filePath);
                const dirName = path.dirname(filePath);
                items.push(new LinqTreeItem(
                    fileName,
                    LinqTreeItemType.RECENT_FILE,
                    filePath,
                    vscode.TreeItemCollapsibleState.None,
                    dirName
                ));
            }
        }

        return items;
    }

    private async getFolderChildren(folderPath: string): Promise<LinqTreeItem[]> {
        const items: LinqTreeItem[] = [];

        try {
            const entries = fs.readdirSync(folderPath, { withFileTypes: true });
            
            // Get exclude patterns from config
            const config = vscode.workspace.getConfiguration('linqpadRunner');
            const excludePatterns = config.get<string[]>('excludePatterns', [
                '**/bin/**', '**/obj/**', '**/.vs/**', '**/.vscode/**'
            ]);

            // Separate folders and files for sorting
            const folders: fs.Dirent[] = [];
            const files: fs.Dirent[] = [];

            for (const entry of entries) {
                const fullPath = path.join(folderPath, entry.name);
                
                // Check if should be excluded
                if (this.shouldExclude(fullPath, excludePatterns)) {
                    continue;
                }

                if (entry.isDirectory()) {
                    folders.push(entry);
                } else if (entry.isFile() && entry.name.endsWith('.linq')) {
                    files.push(entry);
                }
            }

            // Sort folders and files alphabetically
            const sortOrder = config.get<string>('sortOrder', 'name');
            if (sortOrder === 'name') {
                folders.sort((a, b) => a.name.localeCompare(b.name));
                files.sort((a, b) => a.name.localeCompare(b.name));
            }

            // Add folders first
            for (const folder of folders) {
                const fullPath = path.join(folderPath, folder.name);
                items.push(new LinqTreeItem(
                    folder.name,
                    LinqTreeItemType.FOLDER,
                    fullPath,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    folderPath
                ));
            }

            // Then add .linq files
            for (const file of files) {
                const fullPath = path.join(folderPath, file.name);
                items.push(new LinqTreeItem(
                    file.name,
                    LinqTreeItemType.LINQ_FILE,
                    fullPath,
                    vscode.TreeItemCollapsibleState.None,
                    folderPath
                ));
            }

        } catch (error) {
            console.error(`Error reading folder ${folderPath}:`, error);
        }

        return items;
    }

    private shouldExclude(fullPath: string, patterns: string[]): boolean {
        // Simple pattern matching for common exclude patterns
        for (const pattern of patterns) {
            const cleanPattern = pattern.replace(/\*\*/g, '').replace(/\*/g, '');
            if (fullPath.includes(cleanPattern)) {
                return true;
            }
        }
        return false;
    }
}
