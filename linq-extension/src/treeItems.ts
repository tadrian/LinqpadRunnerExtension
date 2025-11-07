import * as vscode from 'vscode';

export enum LinqTreeItemType {
    ROOT_FOLDER,
    FOLDER,
    LINQ_FILE,
    RECENT_SECTION,
    RECENT_FILE
}

export class LinqTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly type: LinqTreeItemType,
        public readonly fsPath: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parentPath?: string
    ) {
        super(label, collapsibleState);

        this.tooltip = fsPath;
        this.contextValue = this.getContextValue();

        // Set appropriate icon based on type
        if (type === LinqTreeItemType.LINQ_FILE || type === LinqTreeItemType.RECENT_FILE) {
            this.command = {
                command: 'linqpadExplorer.openFile',
                title: 'Open File',
                arguments: [this]
            };
            this.iconPath = new vscode.ThemeIcon('file-code');
        } else if (type === LinqTreeItemType.RECENT_SECTION) {
            this.iconPath = new vscode.ThemeIcon('history');
        } else if (type === LinqTreeItemType.ROOT_FOLDER) {
            this.iconPath = new vscode.ThemeIcon('folder-library');
            this.description = fsPath;
        } else {
            this.iconPath = vscode.ThemeIcon.Folder;
        }

        // Resource URI for file operations
        if (type === LinqTreeItemType.LINQ_FILE || type === LinqTreeItemType.FOLDER) {
            this.resourceUri = vscode.Uri.file(fsPath);
        }
    }

    private getContextValue(): string {
        switch (this.type) {
            case LinqTreeItemType.ROOT_FOLDER:
                return 'rootFolder';
            case LinqTreeItemType.FOLDER:
                return 'folder';
            case LinqTreeItemType.LINQ_FILE:
                return 'linqFile';
            case LinqTreeItemType.RECENT_SECTION:
                return 'recentSection';
            case LinqTreeItemType.RECENT_FILE:
                return 'recentFile';
            default:
                return 'item';
        }
    }
}
