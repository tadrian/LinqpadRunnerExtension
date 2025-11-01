# Change Log# Change Log

All notable changes to the LinqPad Runner extension will be documented in this file.All notable changes to the LinqPad Runner extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]## [Unreleased]

## [1.7.0] - 2025-01-08## [1.9.0] - 2025-01-08

### ✨ Complete Release - Interactive Results Viewer + Navigation### 🎨 Major Feature - Rich Visualizations

#### Interactive Results Viewer- **📊 Interactive Charts**: Render charts using Chart.js (line, bar, pie, doughnut, multi-dataset)

- **WebView-based Side-by-Side Panel** - View results without leaving VS Code- **🖼️ Image Support**: Display images from URLs or Base64 data with captions

- **JSON Tree Visualization** - Expandable/collapsible objects and arrays with syntax highlighting- **🎨 HTML Rendering**: Render rich HTML content directly in viewer

- **Sortable Tables** - Click column headers to sort, search box to filter rows- **Smart Detection**: Automatically detects chart data, images, and HTML in output

- **CSV Export** - Export table data as CSV files with one click- **VS Code Theming**: Charts adapt to VS Code's color theme

- **Collapsible Sections** - Organize multiple outputs in expandable sections

- **Live Output Updates** - Results update as script executes#### Chart Data Format

- **Multi-Tab Support** - Switch between different outputs

````json

#### Output Destination Control{

- `linqpadRunner.outputDestination` setting:  "type": "line",

  - `"both"` - Display in console and viewer (default)  "title": "My Chart",

  - `"viewerOnly"` - Show only in Interactive Viewer  "labels": ["Jan", "Feb", "Mar"],

  - `"consoleOnly"` - Show only in output console  "data": [10, 20, 15]

}

#### F12 Navigation Features```

- **Go to Definition** - Jump to method, class, property definitions

- **#load File Support** - Navigate to referenced .linq files#### Image Data Format

- **NuGet Package Links** - Browse package documentation

- **IntelliSense Features** - Hover for quick info, Ctrl+Shift+O for outline```json

{

#### Other Features  "imageUrl": "https://...",

- **C# Syntax Highlighting** for .linq files  "caption": "Optional caption"

- **One-Click Execution** with play button}

- **Command Palette Integration** - Create files, run scripts```

- **Smart Analysis** - Detects missing headers, namespaces

#### HTML Data Format

## [1.6.1] - 2024-12-15

```json

### 🐛 Bug Fixes{

- Fixed auto-injection bug with comments containing "Dumpify"  "html": "<div>Your HTML here</div>"

- Improved stability with edge case handling}

````

## [1.6.0] - 2024-12-01

## [1.8.2] - 2025-01-08

### 🎉 Initial Release

- Execute .linq files from VS Code### ✨ New Feature - Output Destination Control

- LPRun integration

- Basic output console- **Output Destination Setting**: Choose where to send output with new `linqpadRunner.outputDestination` setting

- C# syntax highlighting - **both** (default): Show in console + interactive viewer

  - **viewerOnly**: Only show in interactive viewer (cleaner, no console clutter)
  - **consoleOnly**: Traditional output channel only

- **Flexible Workflow**: Switch between modes based on your preference
- **Clean UI**: Use viewerOnly for presentations or when you prefer the modern viewer

## [1.8.1] - 2025-01-08

### 🔧 Improvements

- **Collapsible Sections Layout**: All outputs now display as expandable/collapsible sections (no more tabs)
- **Better Output Buffering**: Properly buffers and groups output chunks before displaying
- **Label Detection**: Extracts labels from Dumpify output format for better organization
- **Scrollable View**: Single-page mode provides smooth scrolling through all results
- **Smart Boundaries**: Detects dump section boundaries to prevent fragmentation

## [1.8.0] - 2025-01-08

### 🎨 Major Feature - Interactive Results Viewer

- **WebView Panel**: Side-by-side interactive results viewer with rich data visualization
- **JSON Tree Viewer**: Expandable/collapsible JSON structures with syntax highlighting
- **Interactive Tables**: Sortable columns (click headers), filterable rows (search box)
- **Multi-Tab Support**: Multiple outputs displayed in separate tabs with timestamps
- **Export Functionality**: Export table data to CSV with one click
- **Copy Actions**: Copy individual values or entire result sets
- **Live Updates**: Results stream to viewer as script executes
- **Toggle Option**: Enable/disable interactive viewer via settings

### Technical Details

- Implemented WebView API with HTML/CSS/JavaScript
- Real-time communication between extension and webview via postMessage
- Intelligent output parsing (JSON, tables, plain text)
- Responsive layout with VS Code theme integration
- Syntax highlighting for JSON with color-coded types
- Table sorting with numeric and string comparison
- CSV export with proper escaping and formatting

### Configuration

- New setting: `linqpadRunner.useInteractiveViewer` (default: true)
- Disable to use traditional output channel only

## [1.7.0] - 2025-01-08

### 🎯 Major Feature - IntelliSense & Navigation

- **F12 Go to Definition**: Navigate to method, class, and property definitions instantly
- **#load File Navigation**: Press F12 on `#load "file.linq"` to open referenced files
- **NuGet Package Navigation**: Press F12 on NuGet references to open package documentation
- **Hover Information**: Get quick descriptions for Dumpify methods and Query attributes
- **Document Outline (Ctrl+Shift+O)**: See all symbols in file with hierarchical view
- **Enhanced Developer Experience**: Full IntelliSense-like navigation for .linq files

### Technical Details

- Implemented `DefinitionProvider` for F12 functionality
- Added `HoverProvider` for quick info tooltips
- Implemented `DocumentSymbolProvider` for outline view
- Support for method, class, property, and interface navigation
- Smart detection of #load directives and external references

## [1.6.1] - 2025-01-08

### 🐛 Critical Bug Fix

- **Fixed Dumpify Auto-Injection**: Resolved critical bug where auto-injection failed when "Dumpify" appeared in comments
- **Improved Detection Logic**: Enhanced detection to only look for actual NuGet references and using statements, not comments
- **Better User Experience**: Auto-injection now works reliably regardless of comments in code

### Technical Details

- Changed detection from `content.includes('Dumpify')` to proper regex pattern matching
- Now correctly distinguishes between actual Dumpify configuration and references in comments
- Extension properly injects Dumpify when `.DumpText()`, `.DumpConsole()`, `.DumpDebug()`, `.DumpTrace()` methods are used

## [1.6.0] - 2025-01-08

### 🚀 Major Features Added

- **Smart Analysis Engine**: Intelligent detection of missing Query headers, namespaces, and RuntimeVersion requirements
- **LPRun Version Validation**: Automatic compatibility checking between script requirements and LPRun version
- **Enhanced Command Palette**: Complete integration with 4 new commands for file creation and script execution
- **Auto-Configuration Prompts**: Smart suggestions for missing parameters and configuration

### ✨ New Commands

- `Run LinqPad Script` - Execute current .linq file with enhanced analysis
- `New LinqPad File (Basic)` - Create minimal .linq template
- `New LinqPad File (with Dumpify)` - Create .linq with Dumpify pre-configured
- `Open LinqPad Examples` - Browse example files and demos

### 🔧 Configuration Updates

- **Fixed setting name**: Changed from `linqRunner.lprunPath` to `linqpadRunner.lprunPath` for consistency
- **Enhanced descriptions**: Updated configuration descriptions to be more helpful
- **Auto-detection**: Improved LPRun path detection and validation

### 📚 Documentation Overhaul

- **Comprehensive README**: Complete rewrite with clear usage instructions and examples
- **Command Reference**: Detailed table of all Command Palette commands
- **Q&A Section**: Extensive FAQ covering common use cases and troubleshooting
- **Version Comparison**: Clear explanation of differences between extension vs direct LPRun usage

### 🐛 Bug Fixes

- **Configuration Validation**: Proper validation of LPRun path configuration
- **Error Messaging**: Improved error messages with actionable guidance
- **Smart Prompts**: Better detection of when to suggest Query headers and RuntimeVersion

### ⚠️ Important Notes

- **Breaking Change**: Setting name changed from `linqRunner.lprunPath` to `linqpadRunner.lprunPath`
- **Dumpify Clarification**: Auto-injection only works when running through VS Code extension, not direct LPRun
- **RuntimeVersion Behavior**: Extension now intelligently suggests .NET 8.0 runtime when needed for compatibility

## [1.5.x] - Previous Releases

## [1.4.7] - 2025-09-07

### Changed

- Removed "ColorConfig" reference from auto-injection message to avoid confusion about color support in VS Code Output Panel
- Updated auto-injection message to mention ".DumpDebug()" instead of color-related methods

## [1.4.6] - 2025-09-07

### Fixed

- Fixed command registration mismatch - commands now properly register as `linq-runner.run` and `linq-runner.openExamples`
- Resolved "command not found" error when using play button or Command Palette

## [1.4.5] - 2025-09-07

### Changed

- Removed color-related method references from README documentation (`ColorConfig`, `DumpColor`)
- Updated documentation to accurately reflect VS Code Output Panel limitations

## [1.4.4] - 2025-09-07

### Changed

- Simplified header output - removed version number and color information for cleaner display
- Removed promotional footer - cleaner output focuses on query results only

## [1.4.3] - 2025-09-07

### Added

- Enhanced Q&A section in README with comprehensive FAQ covering installation, query types, and features
- Clear explanation about when auto-injection features apply (VS Code extension vs direct LPRun execution)
- Installation step clarification about configuring LPRun path in settings.json

### Changed

- Updated README to accurately describe ASCII table output (removed misleading "colored tables" reference)
- Improved documentation clarity for marketplace Q&A section

## [1.4.2] - 2025-09-07

### 📚 Documentation & User Experience

- **Enhanced README**: Updated documentation to reflect accurate capabilities
  - Clarified that ASCII tables appear without colors in VS Code (colors work in proper terminals)
  - Emphasized zero-configuration auto-injection features
  - Added comprehensive feature comparison table
- **Added Q & A Section**: Comprehensive FAQ covering:
  - Installation instructions
  - Supported query types (Program, Statements, Expression, SQL)
  - Auto-injection explanation (no manual NuGet setup needed)
  - VS Code vs LinqPad comparison
  - Configuration guidance
  - Database connection support
  - Complete working examples
- **Accurate Headers**: Extension output now correctly describes "Beautiful ASCII tables" instead of "Colored tables"
- **Professional Presentation**: Consistent branding and clear capability communication

### 🔧 Technical Improvements

- **Version Consistency**: Updated all version references to 1.4.2
- **Marketplace Ready**: Prepared for publishing with enhanced documentation

## [1.3.1] - 2025-09-07

### 🧹 Cleanup & Organization

- **Streamlined Examples**: Removed testing/experimental files and kept only relevant examples
- **Organized Structure**: Cleaned up project directory from 25+ test files to essential examples only
- **Focused Examples**: Kept only the most valuable demonstrations:
  - `DumpifyShowcase.linq` - Comprehensive Dumpify feature demonstration
  - `AdvancedExample1_LINQ.linq` - LINQ queries with complex objects
  - `AdvancedExample2_Collections.linq` - Collections and data structures
- **Reduced Package Size**: Extension package reduced from 38KB to 27KB
- **Updated Extension**: Removed references to deleted examples in extension code

### Benefits

- ✅ **Cleaner Project**: No more clutter from testing files
- ✅ **Smaller Package**: Faster download and install
- ✅ **Better User Experience**: Only relevant, high-quality examples
- ✅ **Easier Maintenance**: Focused set of examples to maintain

## [1.3.0] - 2025-09-07

### 🎨 Major Enhancement: Colorized Console Output

- **Upgraded to Dumpify**: Replaced obj.Dump with Dumpify NuGet package for rich, colorized console output
- **Enhanced Formatting**: Dump() methods now display objects with beautiful colors, structure, and hierarchy
- **LinqPad-like Experience**: Console output now closely resembles LinqPad GUI's rich object visualization
- **Better Readability**: Color-coded types, properties, and values for improved debugging experience

### Technical Improvements

- **Package Migration**: Seamlessly switched from `obj.Dump` to `Dumpify` package injection
- **Automatic Detection**: Extension automatically injects Dumpify when Dump() calls are detected
- **Backward Compatibility**: All existing .linq files continue to work with enhanced output

### Benefits

- ✅ **Structured Output**: Hierarchical display of complex objects
- ✅ **Color Coding**: Different colors for types, properties, nulls, strings, etc.
- ✅ **Circular References**: Handles complex object relationships safely
- ✅ **Customizable**: Support for various formatting options and depth control

## [1.2.1] - 2025-09-07

### Added

- 📚 **Built-in Example Files**: Added comprehensive .linq examples showcasing Dump() functionality
- 🎯 **Open Examples Command**: New command "Open LinqPad Examples" to quickly access example files
- 💡 **Enhanced Error Messages**: Better error handling with helpful tips for common issues

### Improved

- **Error Detection**: Extension now provides helpful hints for Marshal.SizeOf() and NuGet package errors
- **User Experience**: Quick access to examples via Command Palette
- **Documentation**: Fixed reflection examples to handle unmarshalable types safely

### Examples Included

- **TestDump.linq**: Basic Dump() functionality demonstration
- **AdvancedExample1_LINQ.linq**: Complex LINQ queries with statistics
- **AdvancedExample2_Collections.linq**: Collections and hierarchical data
- **AdvancedExample3_DateTime.linq**: DateTime and temporal analysis
- **AdvancedExample4_Reflection.linq**: Type reflection and exception handling
- **AdvancedExample5_StringProcessing.linq**: Text analysis and regex patterns
- **AdvancedExample6_FileSystem.linq**: File operations and serialization

## [1.2.0] - 2025-09-07

### Added

- 🎉 **Native Dump() Support**: Automatically injects `obj.Dump` NuGet package for true LinqPad-style object dumping
- **Rich Object Formatting**: Objects are now dumped with proper formatting, nested structure, and collections support
- **Seamless LinqPad Compatibility**: Uses actual Dump() methods instead of Console.WriteLine() conversion

### Changed

- **Improved Dump() Handling**: Replaced simple text conversion with NuGet package injection
- **Better Object Output**: Complex objects, arrays, and nested structures now display properly
- **Enhanced User Experience**: Native LinqPad behavior in VS Code environment

### Technical Details

- **Automatic NuGet Reference**: Adds `<NuGetReference>obj.Dump</NuGetReference>` to .linq files
- **Using Statement Injection**: Adds `using static obj.Dump.Extensions;` for extension methods
- **Smart Detection**: Only processes files that actually contain Dump() calls
- **Temporary File Management**: Preserves original files while adding package support

## [1.1.0] - 2025-09-07

### Added

- 🎉 **Dump() Method Support**: Automatically converts `.Dump()` calls to `Console.WriteLine()` for LPRun compatibility
- New configuration option `linqRunner.convertDumpCalls` to enable/disable Dump() conversion
- Intelligent temporary file handling for converted scripts
- Visual feedback when Dump() conversion occurs

### Features

- **Smart Conversion**: Handles various Dump() patterns:
  - `variable.Dump()` → `Console.WriteLine(variable)`
  - `variable.Dump("label")` → `Console.WriteLine("label: " + variable)`
  - `Dump(expression)` → `Console.WriteLine(expression)`
- **Seamless Experience**: Scripts with Dump() now work without modification
- **Configurable**: Can be disabled if not needed
- **Clean Temporary Files**: Automatic cleanup of converted script files

### Changed

- Enhanced script execution to support LinqPad-specific methods
- Improved output channel with conversion notifications

## [1.0.1] - 2025-09-07

### Security

- Fixed personal directory path exposure in default LPRun configuration
- Changed default LPRun path from personal directory to standard installation path
- Improved security by removing sensitive local file paths from extension

### Changed

- Updated default LPRun path to use standard Program Files location instead of personal directory

## [1.0.0] - 2025-09-07

### Added

- LinqPad logo now displays properly in VS Code extension marketplace
- Comprehensive NuGet package documentation explaining how to use NuGet packages with LinqPad's package manager
- Production-ready version 1.0.0 release

### Changed

- Bumped version to 1.0.0 for stable release
- Improved README documentation with clear NuGet usage instructions
- Removed obsolete command-line installation instruction

### Documentation

- Added detailed section on working with NuGet packages
- Clarified that NuGet packages must be installed through LinqPad's NuGet Package Manager first
- Enhanced user guidance for package management workflow

## [0.0.1] - 2025-09-07

### Added

- Initial release of LinqPad Runner extension
- C# syntax highlighting for `.linq` files
- Execute .linq files using LPRun command-line tool (not LinqPad itself)
- One-click script execution with toolbar play button
- Configurable LPRun executable path in VS Code settings
- Dedicated output panel for script execution results
- Command palette integration for running scripts
- Error handling and user feedback
- Support for LinqPad 8 and LinqPad 9 LPRun tools

### Features

- Automatic file association for `.linq` files
- Real-time output streaming from LPRun execution
- Working directory context preservation
- File auto-save before execution
