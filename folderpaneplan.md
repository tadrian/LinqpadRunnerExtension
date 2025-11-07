# LINQPad Folder Tree Pane - Implementation Plan

## Executive Summary

Add a VS Code tree view panel that displays LINQPad scripts organized in a folder structure, similar to the LINQPad client's "My Queries" panel. This will allow users to browse, open, and manage their .linq files directly from VS Code.

## Research Findings

### LINQPad Configuration Storage

Based on investigation of your system, LINQPad stores its configuration in:

**Primary Configuration Location:**

- `%APPDATA%\LINQPad\` (e.g., `C:\Users\{username}\AppData\Roaming\LINQPad\`)

**Key Configuration Files:**

1. **`QueryLocations.txt`** - Contains paths to query folders (one per line)

   - Example from your system:
     ```
     C:\Zips\iCloud\iCloudDrive\linkpad
     C:\Zips\iCloud\iCloudDrive
     C:\Users\thoma\iCloudDrive\linkpad
     ```

2. **`MyScriptLocations.txt`** - Additional script folder paths

   - Example: `C:\Zips\iCloud\iCloudDrive\linkpad`

3. **`RoamingUserOptions.xml`** - Main user preferences including:

   - `<CustomSnippetsFolder>` - Custom snippets location
   - Other UI and behavior settings

4. **`RecentFiles.txt`** - Recently opened files
5. **`RecentQueries.txt`** - Recently accessed queries

### Default Locations

- **Queries:** `%USERPROFILE%\Documents\LINQPad Queries`
- **Snippets:** `%USERPROFILE%\Documents\LINQPad Snippets`
- **Plugins:** `%USERPROFILE%\Documents\LINQPad Plugins`
- **Samples:** `%APPDATA%\LINQPad\Samples`

### Folder Structure Observed

Your system shows a well-organized hierarchy with:

- Root-level .linq files
- Multiple nested folders (e.g., "1 NxtExamples", "SQL", "Visma", etc.)
- Subfolder organization by project/technology/domain

## Architecture Design

### 1. VS Code Extension Components

#### A. Tree Data Provider (`linqpadExplorer.ts`)

**Purpose:** Implements `vscode.TreeDataProvider` interface to provide folder/file structure

**Key Responsibilities:**

- Read LINQPad configuration files
- Parse `QueryLocations.txt` and `MyScriptLocations.txt`
- Build hierarchical tree structure
- Watch for file system changes
- Handle refresh/reload

**Tree Item Types:**

```typescript
enum LinqTreeItemType {
  ROOT_FOLDER, // Top-level query location
  FOLDER, // Subdirectory
  LINQ_FILE, // .linq script file
  RECENT_FILES, // Special node for recent files
  FAVORITE, // Optional: favorited scripts
}
```

**Tree Item Class:**

```typescript
class LinqTreeItem extends vscode.TreeItem {
  type: LinqTreeItemType;
  fsPath: string;
  parentPath?: string;
  fileStats?: FileStats;
}
```

#### B. Configuration Manager (`linqpadConfig.ts`)

**Purpose:** Read and parse LINQPad configuration files

**Key Functions:**

- `getQueryLocations(): string[]` - Read QueryLocations.txt
- `getScriptLocations(): string[]` - Read MyScriptLocations.txt
- `getRoamingOptions(): UserOptions` - Parse RoamingUserOptions.xml
- `getRecentFiles(): string[]` - Read RecentFiles.txt
- `watchConfigChanges()` - Monitor config file changes

**Configuration Paths:**

```typescript
const CONFIG_PATHS = {
  APPDATA: path.join(process.env.APPDATA || "", "LINQPad"),
  QUERY_LOCATIONS: "QueryLocations.txt",
  SCRIPT_LOCATIONS: "MyScriptLocations.txt",
  RECENT_FILES: "RecentFiles.txt",
  ROAMING_OPTIONS: "RoamingUserOptions.xml",
};
```

#### C. File System Watcher (`fileWatcher.ts`)

**Purpose:** Monitor .linq files and folders for changes

**Features:**

- Watch all configured query locations
- Detect file creation/deletion/modification
- Trigger tree refresh on changes
- Debounce rapid changes

#### D. Context Menu Actions

**Right-click menu options:**

- **Files:**
  - Open in Editor
  - Run Script (existing functionality)
  - Copy Path
  - Reveal in File Explorer
  - Rename
  - Delete
  - Add to Favorites
- **Folders:**
  - New LINQPad Query...
  - New Folder
  - Refresh
  - Reveal in File Explorer
  - Add/Remove from Query Locations

#### E. View Container (`package.json` contribution)

**New Activity Bar Icon:**

```json
"viewsContainers": {
  "activitybar": [
    {
      "id": "linqpad-explorer",
      "title": "LINQPad",
      "icon": "resources/linqpad-icon.svg"
    }
  ]
}
```

**Views:**

```json
"views": {
  "linqpad-explorer": [
    {
      "id": "linqpadQueries",
      "name": "My Queries",
      "icon": "resources/linqpad-icon.svg"
    },
    {
      "id": "linqpadRecent",
      "name": "Recent Files"
    }
  ]
}
```

### 2. User Configuration (VS Code Settings)

**New Settings in `package.json`:**

```json
"configuration": {
  "properties": {
    "linqpadRunner.queryLocations": {
      "type": "array",
      "items": { "type": "string" },
      "default": [],
      "description": "Custom LINQPad query folder locations (in addition to auto-detected locations)"
    },
    "linqpadRunner.autoDetectQueryLocations": {
      "type": "boolean",
      "default": true,
      "description": "Automatically detect query locations from LINQPad configuration"
    },
    "linqpadRunner.showRecentFiles": {
      "type": "boolean",
      "default": true,
      "description": "Show recent files in the LINQPad explorer"
    },
    "linqpadRunner.sortOrder": {
      "type": "string",
      "enum": ["name", "modified", "type"],
      "default": "name",
      "description": "Sort order for files and folders"
    },
    "linqpadRunner.excludePatterns": {
      "type": "array",
      "items": { "type": "string" },
      "default": ["**/bin/**", "**/obj/**", "**/.vs/**"],
      "description": "Glob patterns to exclude from the tree view"
    }
  }
}
```

### 3. File Organization & Display

#### Tree Structure Display

```
📁 LINQPad Explorer
├─ 📁 C:\Zips\iCloud\iCloudDrive\linkpad
│  ├─ 📄 Abstract.linq
│  ├─ 📄 AppsettingsLoader.linq
│  ├─ 📁 1 NxtExamples
│  │  ├─ 📄 query1.linq
│  │  └─ 📄 query2.linq
│  ├─ 📁 SQL
│  │  ├─ 📄 customerQuery.linq
│  │  └─ 📄 reportQuery.linq
│  └─ 📁 Visma
├─ 📁 C:\Users\thoma\Documents\LINQPad Queries
└─ 📁 Recent Files
   ├─ 📄 query1.linq (from location 1)
   └─ 📄 query2.linq (from location 2)
```

#### File Icons

- **Folders:** Standard VS Code folder icons (collapsed/expanded)
- **.linq files:** Custom icon or default file icon with .linq badge
- **Recently modified:** Optional indicator/color
- **Currently open:** Highlighted/bold

### 4. Implementation Phases

#### Phase 1: Core Tree View (MVP)

**Goal:** Basic folder tree with file browsing

**Tasks:**

1. Create `LinqpadExplorer` TreeDataProvider
2. Implement configuration file reading
3. Build basic tree structure (folders + files)
4. Add "Open File" on click
5. Register view in Activity Bar

**Estimated Effort:** 8-12 hours

**Deliverables:**

- Users can see their LINQPad query folders
- Users can browse and open .linq files
- Basic refresh functionality

#### Phase 2: Configuration & Auto-Detection

**Goal:** Smart configuration detection and user overrides

**Tasks:**

1. Implement `LinqpadConfigManager`
2. Auto-detect query locations from LINQPad config
3. Add VS Code settings for custom paths
4. Merge auto-detected + custom paths
5. Handle missing/invalid paths gracefully

**Estimated Effort:** 6-8 hours

**Deliverables:**

- Automatic detection of LINQPad query folders
- User can add custom locations via VS Code settings
- Warning messages for invalid paths

#### Phase 3: File System Watching & Refresh

**Goal:** Real-time updates when files change

**Tasks:**

1. Implement `FileWatcher` class
2. Watch all configured query locations
3. Debounce rapid changes
4. Auto-refresh tree on changes
5. Add manual refresh button

**Estimated Effort:** 4-6 hours

**Deliverables:**

- Tree updates automatically when files are added/removed/modified
- Manual refresh command
- Performance optimization for large folder structures

#### Phase 4: Context Menu Actions

**Goal:** File/folder management from tree view

**Tasks:**

1. Implement context menu commands
2. Add "New Query" (create new .linq file with template)
3. Add "New Folder"
4. Add "Rename" and "Delete"
5. Add "Copy Path" and "Reveal in Explorer"
6. Add "Run Script" integration with existing runner

**Estimated Effort:** 8-10 hours

**Deliverables:**

- Right-click file/folder management
- Create new queries with templates
- Quick script execution from tree

#### Phase 5: Recent Files & Favorites

**Goal:** Quick access to frequently used scripts

**Tasks:**

1. Implement Recent Files tree section
2. Read from LINQPad's RecentFiles.txt
3. Add "Add to Favorites" functionality
4. Persist favorites in VS Code workspace/global settings
5. Drag-and-drop to reorder favorites

**Estimated Effort:** 6-8 hours

**Deliverables:**

- Recent files section (synced with LINQPad)
- Favorites management
- Quick access to commonly used scripts

#### Phase 6: Advanced Features (Optional)

**Goal:** Enhanced productivity features

**Tasks:**

1. Search/filter in tree view
2. Multi-root workspace support
3. Sort options (name, date, type)
4. File statistics (lines, size, last modified)
5. Inline preview on hover
6. Duplicate/Copy file
7. Move to folder (drag-and-drop)

**Estimated Effort:** 10-15 hours

**Deliverables:**

- Enhanced navigation and organization
- Power user features

### 5. Technical Considerations

#### Performance

- **Large Folder Structures:** Use lazy loading for deep hierarchies
- **File System Watchers:** Limit number of watchers, use debouncing
- **Tree Rendering:** Virtual scrolling for large file lists
- **Caching:** Cache file stats and update incrementally

#### Cross-Platform Support

- **Windows:** Primary target (LINQPad is Windows-only)
- **macOS/Linux:** Gracefully handle missing LINQPad config
  - Allow manual configuration via VS Code settings
  - Warning message: "LINQPad configuration not detected"

#### Error Handling

- **Missing Config Files:** Provide helpful setup instructions
- **Invalid Paths:** Show warning, skip invalid entries
- **Permission Issues:** Catch and display file system errors
- **Empty Folders:** Show "No queries found" message

#### Compatibility

- **LINQPad Versions:** Support LINQPad 6, 7, 8, 9+
- **Configuration Changes:** Monitor for LINQPad config format changes
- **Multi-instance:** Handle multiple LINQPad versions installed

### 6. User Experience

#### First-Time Setup

1. Extension activates
2. Auto-detects LINQPad configuration
3. If found: Populate tree automatically
4. If not found: Show welcome message with instructions:

   ```
   LINQPad Explorer
   ────────────────
   No query locations detected.

   [Add Folder...] [Learn More]
   ```

#### Empty State

```
📁 LINQPad Explorer
   No queries found

   • Add a folder via settings
   • Configure LINQPad query locations

   [Add Folder] [Open Settings]
```

#### Loading State

```
📁 LINQPad Explorer
   🔄 Loading queries...
```

#### Error State

```
📁 LINQPad Explorer
   ⚠️ Error loading queries
   Path not found: C:\invalid\path

   [Refresh] [Open Settings]
```

### 7. Testing Strategy

#### Unit Tests

- Configuration file parsing
- Path resolution and validation
- Tree item construction
- Sort/filter logic

#### Integration Tests

- TreeDataProvider with mock file system
- Configuration detection flow
- File watcher functionality
- Command execution

#### Manual Testing Scenarios

1. Fresh install (no LINQPad config)
2. Standard install (with LINQPad config)
3. Multiple query locations
4. Very large folder structure (1000+ files)
5. File/folder operations (create, rename, delete)
6. Config file changes while VS Code is running
7. Invalid/missing paths

### 8. Documentation

#### README Updates

- Screenshot of folder tree pane
- Configuration instructions
- Feature descriptions
- FAQ section

#### IntelliSense/Hover Documentation

- Setting descriptions
- Command descriptions

#### Tutorial/Walkthrough

- First-time setup guide
- Configuration best practices
- Tips & tricks

### 9. Implementation Files

**New Files:**

```
linq-extension/
├── src/
│   ├── linqpadExplorer.ts        # Main tree view provider
│   ├── linqpadConfig.ts          # Configuration manager
│   ├── fileWatcher.ts            # File system watcher
│   ├── treeItems.ts              # Tree item classes
│   └── commands/
│       ├── newQuery.ts           # Create new .linq file
│       ├── newFolder.ts          # Create new folder
│       ├── deleteItem.ts         # Delete file/folder
│       ├── renameItem.ts         # Rename file/folder
│       └── revealInExplorer.ts   # OS file explorer reveal
├── resources/
│   └── linqpad-icon.svg          # Activity bar icon
└── templates/
    ├── program.linq              # Default program template
    ├── statements.linq           # Statements template
    └── expression.linq           # Expression template
```

**Modified Files:**

```
linq-extension/
├── src/
│   └── extension.ts              # Register tree view & commands
└── package.json                  # Add views, commands, settings
```

### 10. Potential Challenges & Solutions

#### Challenge 1: LINQPad Config Format Changes

**Risk:** LINQPad updates may change config file format
**Solution:**

- Version detection logic
- Graceful fallback to manual configuration
- Community feedback for new versions

#### Challenge 2: Performance with Large Folders

**Risk:** Thousands of .linq files slow down tree
**Solution:**

- Lazy loading (load children on expand)
- Virtual scrolling
- Pagination for large folders
- Exclude patterns (bin, obj, etc.)

#### Challenge 3: Multi-root Workspaces

**Risk:** Complex workspace configurations
**Solution:**

- Support one tree per workspace folder
- Merge all locations into single tree
- Clear labeling of root paths

#### Challenge 4: File System Watchers Limit

**Risk:** OS limits on number of file watchers
**Solution:**

- Watch only top-level folders
- Manual refresh option
- User setting to disable auto-watch

### 11. Success Metrics

**User Adoption:**

- % of users who enable/use the tree view
- Number of files opened via tree vs. command palette

**Performance:**

- Tree load time < 1 second for typical folders
- Tree refresh time < 500ms
- Memory usage < 50MB for large folder structures

**Reliability:**

- Zero crashes related to tree view
- Graceful handling of all error conditions
- Automatic recovery from transient errors

### 12. Future Enhancements (Post-MVP)

1. **Query Templates:** More starter templates (SQL, API, etc.)
2. **Inline Execution:** Run query directly from tree (show spinner)
3. **Query Properties:** Show query kind, framework version, etc.
4. **Search Integration:** Search across all queries
5. **Tags/Labels:** Custom organization beyond folders
6. **Sync with LINQPad:** Two-way sync of recent files/favorites
7. **Snippets Browser:** Separate tree for LINQPad snippets
8. **Connection Browser:** Show LINQPad database connections
9. **NuGet Packages:** Show referenced packages per query
10. **Query Dependencies:** Visualize `#load` directives

## Questions for Clarification

Before implementation begins, please confirm:

1. **Primary Use Case:** Do you primarily want to:

   - Browse existing LINQPad scripts from VS Code?
   - Create/manage new scripts from VS Code?
   - Both equally?

2. **Multi-Location Support:** You have multiple query locations configured:

   - Should all locations appear in one tree?
   - Or separate trees/sections per location?

3. **Recent Files:** Should the recent files section:

   - Sync from LINQPad's RecentFiles.txt (read-only)?
   - Or maintain its own list based on VS Code usage?

4. **File Operations:** Which operations are most important (priority order):

   - Open file ✓ (must-have)
   - Run script ✓ (must-have)
   - Create new file
   - Rename/delete
   - Copy/move
   - Reveal in Explorer

5. **Folder Depth:** Do you have deeply nested folders?

   - Should we limit visible depth?
   - Or show full hierarchy?

6. **Performance Priority:** What's more important:

   - Instant tree load (even if not 100% complete)
   - Complete accuracy (even if takes a few seconds)

7. **Icon Preferences:** Would you like:

   - Custom LINQPad-style icons (requires design)
   - Standard VS Code file/folder icons
   - A mix (custom for .linq, standard for folders)

8. **Integration Level:** Should the tree view:
   - Be a separate activity bar icon (dedicated panel)
   - Be part of the Explorer view (alongside workspace files)
   - User configurable

## Recommended Starting Point

**Suggestion:** Start with Phase 1 (Core Tree View) to validate the approach:

1. Implement basic tree provider
2. Read from your existing `QueryLocations.txt`
3. Display folders and files
4. Open on click
5. Manual refresh button

**Why this approach:**

- Quick validation (2-3 days development)
- Get user feedback early
- Verify performance with your actual folder structure
- Iterate based on real usage

**Prototype Deliverable:** A working tree view showing your LINQPad scripts that you can browse and open.

---

## Appendix: VS Code API References

**Key APIs:**

- `vscode.TreeDataProvider<T>` - Tree view interface
- `vscode.TreeItem` - Individual tree items
- `vscode.FileSystemWatcher` - File watching
- `vscode.workspace.getConfiguration()` - Settings access
- `vscode.window.createTreeView()` - Create tree view
- `vscode.commands.registerCommand()` - Command registration

**Documentation:**

- [Tree View API](https://code.visualstudio.com/api/extension-guides/tree-view)
- [File System Watcher](https://code.visualstudio.com/api/references/vscode-api#FileSystemWatcher)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview) (if needed for previews)

---

**Plan Version:** 1.0  
**Created:** November 7, 2025  
**Status:** Awaiting User Feedback & Approval
