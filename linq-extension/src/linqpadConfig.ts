import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Manages reading and parsing LINQPad configuration files
 */
export class LinqpadConfigManager {
    private configPath: string;

    constructor() {
        // LINQPad stores config in %APPDATA%\LINQPad
        this.configPath = path.join(
            process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
            'LINQPad'
        );
    }

    /**
     * Get all query folder locations from LINQPad configuration
     */
    public getQueryLocations(): string[] {
        const locations: string[] = [];

        // Read QueryLocations.txt
        const queryLocFile = path.join(this.configPath, 'QueryLocations.txt');
        if (fs.existsSync(queryLocFile)) {
            try {
                const content = fs.readFileSync(queryLocFile, 'utf8');
                const paths = content
                    .split(/\r?\n/)
                    .map(p => p.trim())
                    .filter(p => p.length > 0 && fs.existsSync(p));
                locations.push(...paths);
            } catch (error) {
                console.error('Error reading QueryLocations.txt:', error);
            }
        }

        // Read MyScriptLocations.txt
        const scriptLocFile = path.join(this.configPath, 'MyScriptLocations.txt');
        if (fs.existsSync(scriptLocFile)) {
            try {
                const content = fs.readFileSync(scriptLocFile, 'utf8');
                const paths = content
                    .split(/\r?\n/)
                    .map(p => p.trim())
                    .filter(p => p.length > 0 && fs.existsSync(p));
                locations.push(...paths);
            } catch (error) {
                console.error('Error reading MyScriptLocations.txt:', error);
            }
        }

        // Remove duplicates and return
        return [...new Set(locations)];
    }

    /**
     * Get default query location (Documents\LINQPad Queries)
     */
    public getDefaultQueryLocation(): string {
        return path.join(os.homedir(), 'Documents', 'LINQPad Queries');
    }

    /**
     * Get recent files from LINQPad
     */
    public getRecentFiles(): string[] {
        const recentFile = path.join(this.configPath, 'RecentFiles.txt');
        if (!fs.existsSync(recentFile)) {
            return [];
        }

        try {
            const content = fs.readFileSync(recentFile, 'utf8');
            return content
                .split(/\r?\n/)
                .map(p => p.trim())
                .filter(p => p.length > 0 && fs.existsSync(p));
        } catch (error) {
            console.error('Error reading RecentFiles.txt:', error);
            return [];
        }
    }

    /**
     * Check if LINQPad configuration exists
     */
    public hasLinqpadConfig(): boolean {
        return fs.existsSync(this.configPath);
    }

    /**
     * Get all query locations including default and configured paths
     */
    public getAllQueryLocations(): string[] {
        const locations: string[] = [];

        // Add configured locations
        locations.push(...this.getQueryLocations());

        // Add default location if it exists and not already included
        const defaultLoc = this.getDefaultQueryLocation();
        if (fs.existsSync(defaultLoc) && !locations.includes(defaultLoc)) {
            locations.push(defaultLoc);
        }

        return locations;
    }
}
