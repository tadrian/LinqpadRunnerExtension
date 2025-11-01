# LinqPad Runner for VS Code# LinqPad Runner for VS Code# LinqPad Runner for VS Code# LinqPad Runner for VS Code

Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun) with enhanced Dumpify support for beautiful JSON and ASCII table formatting.Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun).Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun).Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun) with enhanced Dumpify support for beautiful JSON and ASCII table formatting.

## 📦 Installation & Setup## 📦 Installation & Setup## 📦 Installation & Setup## 📦 Installation & Setup

1. Install from VS Code marketplace: Search "LinqPad Runner"1. Install from VS Code marketplace: Search "LinqPad Runner"1. Install from VS Code marketplace: Search "LinqPad Runner"1. Install from VS Code marketplace: Search "LinqPad Runner"

2. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path

3. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path

**Common LPRun Paths:**

3. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path2. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path

- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)

- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`**Common LPRun Paths:**

## ✨ Features**Common LPRun Paths:\*\***Common LPRun Paths:\*\*

- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, collapsible sections, and CSV export- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)

- **C# Syntax Highlighting** for `.linq` files

- **One-Click Execution** with play button or `Ctrl+Shift+P` → "Run LinqPad Script"- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)

- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, and NuGet packages

- **Output Destination Control** - Route output to console, viewer, or both## ✨ Features- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`

- **Command Palette Integration** - Create files, run scripts, browse examples

- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, collapsible sections## ✨ Features## ✨ Features

## 🎯 Interactive Results Viewer

- **C# Syntax Highlighting** for `.linq` files

View your output in a collapsible side-by-side panel with:

- **One-Click Execution** with play button or `Ctrl+Shift+P` → "Run LinqPad Script"- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, collapsible sections, and CSV export- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, and export

- **JSON Tree View** - Expandable/collapsible JSON objects and arrays with syntax highlighting

- **Table View** - Sortable, filterable tables with search functionality- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, NuGet packages

- **Collapsible Sections** - Organize multiple results in expandable sections

- **CSV Export** - Export table data as CSV files- **Output Destination Control** - Route output to console, viewer, or both- **C# Syntax Highlighting** for `.linq` files- **C# Syntax Highlighting** for `.linq` files

- **Text Output** - Display plain text and structured output

- **Command Palette Integration** - Create files, run scripts, browse examples

## 🎯 Enhanced Dumpify Support

- **One-Click Execution** with play button or `Ctrl+Shift+P` → "Run LinqPad Script"- **One-Click Execution** with ▶️ button or `Ctrl+Shift+P` → "Run LinqPad Script"

**Auto-Injection**: Extension automatically detects Dumpify methods and adds required NuGet packages.

## 🎯 Interactive Results Viewer

### Dump Methods

- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, and NuGet packages- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, and NuGet packages

| Method | Description | VS Code Extension | Direct LPRun |

| --- | --- | --- | --- |View your output in a collapsible side-by-side panel with:

| `.Dump()` | LinqPad native JSON formatting | ✅ Works | ✅ Works |

| `.DumpText()` | ASCII table formatting | ✅ Auto-injected | ❌ Manual setup |- **Output Destination Control** - Route output to console, viewer, or both- **IntelliSense Support** - Hover for quick info, Ctrl+Shift+O for outline view

| `.DumpConsole()` | Console borders | ✅ Auto-injected | ❌ Manual setup |

| `.DumpDebug()` | Debug formatting | ✅ Auto-injected | ❌ Manual setup |- **JSON Tree View** - Expandable/collapsible JSON objects and arrays with syntax highlighting

| `.DumpTrace()` | Trace formatting | ✅ Auto-injected | ❌ Manual setup |

- **Table View** - Sortable, filterable tables with search functionality- **Command Palette Integration** - Create files, run scripts, browse examples- **Auto Dumpify Injection** - Enhanced methods work automatically in VS Code

**Manual Setup** (only for direct LPRun/LinqPad usage):

- **Collapsible Sections** - Organize multiple results in expandable sections

````````xml

<Query Kind="Program">- **CSV Export** - Export table data as CSV files- **Smart Analysis** - Missing headers, namespaces, RuntimeVersion detection

  <NuGetReference>Dumpify</NuGetReference>

  <Namespace>Dumpify</Namespace>- **Text Output** - Display plain text and structured output

</Query>

## 🎯 Interactive Results Viewer- **Command Palette Integration** - Create files, run scripts, browse examples

using Dumpify;

```## ⚙️ Configuration



## ⚙️ ConfigurationView your output in a collapsible side-by-side panel with:## 🎯 Enhanced Dumpify Support



### Output Destination### Output Destination



Control where output is displayed:- **JSON Tree View** - Expandable/collapsible JSON objects and arrays**Auto-Injection**: Extension automatically detects Dumpify methods and adds required NuGet packages.



```jsonControl where output is displayed:

"linqpadRunner.outputDestination": "both"

```- **Table View** - Sortable, filterable tables with search



Options:```json



- `"both"` - Display in both console and Interactive Viewer (default)"linqpadRunner.outputDestination": "both"- **Collapsible Sections** - Organize multiple results in expandable sections### Dump Methods

- `"viewerOnly"` - Show only in Interactive Viewer panel

- `"consoleOnly"` - Show only in VS Code output console```



### LPRun Path- **CSV Export** - Export table data as CSV files



```jsonOptions:

"linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe"

```- **Text Output** - Display plain text and structured output| Method | Description | VS Code Extension | Direct LPRun |



## 🚀 Usage- `"both"` - Display in both console and Interactive Viewer (default)



### Running Scripts- `"viewerOnly"` - Show only in Interactive Viewer panel| ---------------- | ------------------------------ | ----------------- | --------------- |



1. Open a `.linq` file- `"consoleOnly"` - Show only in VS Code output console

2. Press play button in editor or `Ctrl+Shift+P` → "Run LinqPad Script"

3. View results in console or Interactive Viewer panel## ⚙️ Configuration| `.Dump()` | LinqPad native JSON formatting | ✅ Works | ✅ Works |



### Navigating with F12### LPRun Path



- Position cursor on a method, class, or property| `.DumpText()` | ASCII table formatting | ✅ Auto-injected | ❌ Manual setup |

- Press F12 to jump to definition

- Supports: #load files, NuGet packages, built-in types```json



### Creating New Files"linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe"### Output Destination| `.DumpConsole()` | Console borders | ✅ Auto-injected | ❌ Manual setup |



`Ctrl+Shift+P` → "Create LinqPad Script" to scaffold a new .linq file```



## 📝 Example Output Formats| `.DumpDebug()` | Debug formatting | ✅ Auto-injected | ❌ Manual setup |



### JSON Output## 🚀 Usage



Output valid JSON objects:Control where output is displayed via settings:| `.DumpTrace()` | Trace formatting | ✅ Auto-injected | ❌ Manual setup |



```csharp### Running Scripts

var data = new { Name = "Test", Values = new[] { 1, 2, 3 } };

var json = JsonSerializer.Serialize(data);```````json**Manual Setup** (only for direct LPRun/LinqPad usage):

Console.WriteLine(json);

```1. Open a `.linq` file



Displayed as expandable JSON tree in Interactive Viewer.2. Press play button in editor or `Ctrl+Shift+P` → "Run LinqPad Script""linqpadRunner.outputDestination": "both"



### Table Output3. View results in console or Interactive Viewer panel



Output arrays of objects:``````xml



```csharp### Navigating with F12

var items = new[] {

    new { Id = 1, Name = "Item 1", Value = 100 },<Query Kind="Program">

    new { Id = 2, Name = "Item 2", Value = 200 }

};- Position cursor on a method, class, or property

var json = JsonSerializer.Serialize(items);

Console.WriteLine(json);- Press F12 to jump to definitionOptions:  <NuGetReference>Dumpify</NuGetReference>

````````

- Supports: #load files, NuGet packages, built-in types

Displayed as sortable, filterable table in Interactive Viewer.

- `"both"` - Display in both console and Interactive Viewer (default) <Namespace>Dumpify</Namespace>

### Text Output

### Creating New Files

Output plain text:

- `"viewerOnly"` - Show only in Interactive Viewer panel</Query>

```csharp

Console.WriteLine("This is plain text output");`Ctrl+Shift+P` → "Create LinqPad Script" to scaffold a new .linq file

```

- `"consoleOnly"` - Show only in VS Code output consoleusing Dumpify;

## 📋 Requirements

## 📝 Example Output Formats

- VS Code 1.60+

- LINQPad 8 or 9 with LPRun installed```````

- .NET SDK matching your script's RuntimeVersion

### JSON Output

## 🐛 Troubleshooting

### LPRun Path

### LPRun Not Found

Output valid JSON objects:

- Verify LPRun path in settings (`Ctrl+,`)

- Use absolute path: `C:\Program Files\LINQPad9\LPRun9-x64.exe`## ⚙️ Configuration

### Interactive Viewer Not Showing`````csharp

- Check `linqpadRunner.outputDestination` settingvar data = new { Name = "Test", Values = new[] { 1, 2, 3 } };````json

- Ensure output is valid JSON for structured display

- Check output console for errorsvar json = JsonSerializer.Serialize(data);

### Scripts Not RunningConsole.WriteLine(json);"linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe"```json

- Verify LPRun is installed and path is correct`````

- Check RuntimeVersion in your .linq file matches your .NET version

- Ensure all namespaces and references are correct````{

## 📄 LicenseDisplayed as expandable JSON tree in Interactive Viewer.

MIT - See LICENSE file "linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe",

## 🤝 Support### Table Output

- GitHub: https://github.com/tadrian/LinqpadRunnerExtension## 🚀 Usage "linqpadRunner.convertDumpCalls": true

- Issues: https://github.com/tadrian/LinqpadRunnerExtension/issues

Output arrays of objects:

## 📝 Version History

}

- **v1.7.4** - Fixed marketplace README display (moved to extension folder)

- **v1.7.3** - Fixed README formatting```csharp

- **v1.7.2** - Fixed GitHub repository links

- **v1.7.1** - Interactive Results Viewer with JSON trees, sortable tables, collapsible sections, output destination control, and F12 navigationvar items = new[] {### Running Scripts```

- **v1.6.1** - Bug fixes

- **v1.6.0** - Initial release new { Id = 1, Name = "Item 1", Value = 100 },

  new { Id = 2, Name = "Item 2", Value = 200 }

};

var json = JsonSerializer.Serialize(items);1. Open a `.linq` file## 📝 Example

Console.WriteLine(json);

```2. Press play button in editor or `Ctrl+Shift+P` → "Run LinqPad Script"

Displayed as sortable, filterable table in Interactive Viewer.3. View results in console or Interactive Viewer```csharp

### Text Output<Query Kind="Program" />

Output plain text:### Navigating with F12

````csharpvoid Main()

Console.WriteLine("This is plain text output");

```- Position cursor on a method, class, or property{



## 📋 Requirements- Press F12 to jump to definition    var data = new { Name = "John", Age = 30, City = "NYC" };



- VS Code 1.60+- Supports: #load files, NuGet packages, built-in types

- LINQPad 8 or 9 with LPRun installed

- .NET SDK matching your script's RuntimeVersion    data.Dump("JSON formatting");     // Always works



## 🐛 Troubleshooting### Creating New Files    data.DumpText("Table format");    // Auto-injected in VS Code



### LPRun Not Found    data.DumpConsole("With borders"); // Auto-injected in VS Code



- Verify LPRun path in settings (`Ctrl+,`)`Ctrl+Shift+P` → "Create LinqPad Script" to scaffold a new .linq file

- Use absolute path: `C:\Program Files\LINQPad9\LPRun9-x64.exe`

    // Use F12 on method names to jump to definitions

### Interactive Viewer Not Showing

## 📝 Example Output Formats    HelperMethod();

- Check `linqpadRunner.outputDestination` setting

- Ensure output is valid JSON for structured display}

- Check output console for errors

### JSON Output

### Scripts Not Running

// Press F12 on HelperMethod() above to jump here

- Verify LPRun is installed and path is correct

- Check RuntimeVersion in your .linq file matches your .NET versionOutput valid JSON objects:void HelperMethod()

- Ensure all namespaces and references are correct

{

## 📄 License

```csharp    "Helper executed".Dump();

MIT - See LICENSE file

var data = new { Name = "Test", Values = new[] { 1, 2, 3 } };}

## 🤝 Support

var json = JsonSerializer.Serialize(data);```

- GitHub: https://github.com/tadrian/LinqpadRunnerExtension

- Issues: https://github.com/tadrian/LinqpadRunnerExtension/issuesConsole.WriteLine(json);



## 📝 Version History```## 🚀 Navigation Features



- **v1.7.2** - Fixed GitHub repository links

- **v1.7.1** - Interactive Results Viewer with JSON trees, sortable tables, collapsible sections, output destination control, and F12 navigation

- **v1.6.1** - Bug fixesDisplayed as expandable JSON tree in Interactive Viewer.### F12 - Go to Definition

- **v1.6.0** - Initial release



### Table Output- **Methods** - Jump to method definitions instantly

- **Classes** - Navigate to class/interface/struct/record definitions

Output arrays of objects:- **Properties** - Jump to property declarations

- **#load Files** - Open referenced .linq files: `#load "Utils.linq"`

```csharp- **NuGet Packages** - Open package documentation on nuget.org

var items = new[] {

    new { Id = 1, Name = "Item 1", Value = 100 },### Hover Information

    new { Id = 2, Name = "Item 2", Value = 200 }

};- Hover over **Dumpify methods** (.Dump, .DumpText, etc.) for descriptions

var json = JsonSerializer.Serialize(items);- Hover over **Query attributes** (RuntimeVersion, Kind, Namespace) for quick help

Console.WriteLine(json);- Hover over **NuGet packages** to see package info

````

### Ctrl+Shift+O - Quick Navigation

Displayed as sortable, filterable table in Interactive Viewer.

- See **all methods** in current file

### Text Output- See **all classes** and types

- See **all properties**

Output plain text:- Type to filter and jump instantly

````csharp## ❓ Common Questions

Console.WriteLine("This is plain text output");

```**Q: Do I need manual Dumpify setup?**



## 📋 Requirements- Basic `.Dump()`: No setup needed anywhere

- Enhanced methods: Auto-injected in VS Code, manual setup for direct LPRun

- VS Code 1.60+

- LINQPad 8 or 9 with LPRun installed**Q: Why "RuntimeVersion 8.0" suggestions?**

- .NET SDK matching your script's RuntimeVersion

- Ensures compatibility when using .NET 8.0 features with LPRun9

## 🐛 Troubleshooting

**Q: Can I use database connections?**

### LPRun Not Found

- Yes, if configured in LinqPad Connection Manager

- Verify LPRun path in settings (`Ctrl+,`)

- Use absolute path: `C:\Program Files\LINQPad9\LPRun9-x64.exe`## 🔄 Recent Updates



### Interactive Viewer Not Showing### v1.8.0



- Check `linqpadRunner.outputDestination` setting- 🎨 **Interactive Results Viewer** - Side-by-side webview panel with rich data visualization

- Ensure output is valid JSON for structured display- 📊 **JSON Tree Viewer** - Expandable/collapsible JSON with syntax highlighting

- Check output console for errors- 📋 **Sortable Tables** - Click column headers to sort, filter rows with search box

- 💾 **Export to CSV** - Export table data with one click

### Scripts Not Running- 🔍 **Multi-Tab Results** - Multiple outputs in separate tabs

- ⚡ **Live Updates** - Results update as script executes

- Verify LPRun is installed and path is correct- 🎯 **Toggle Output** - Switch between interactive viewer and text output

- Check RuntimeVersion in your .linq file matches your .NET version

- Ensure all namespaces and references are correct### v1.7.0



## 📄 License- 🎯 **F12 Go to Definition** - Navigate to method/class definitions instantly

- 🔍 **#load File Support** - Jump to referenced .linq files with F12

MIT - See LICENSE file- 📦 **NuGet Navigation** - Click NuGet references to open package documentation

- 💡 **Hover Information** - Quick info for Dumpify methods and Query attributes

## 🤝 Support- 📋 **Document Outline** - Press Ctrl+Shift+O to see all symbols in file

- ✨ **Enhanced Navigation** - Full IntelliSense-like experience for .linq files

- GitHub: https://github.com/tadrian/linqpad-runner

- Issues: https://github.com/tadrian/linqpad-runner/issues### v1.6.1



## 📝 Version History- 🐛 Fixed critical auto-injection bug with comments containing "Dumpify"



- **v1.7.0** - Interactive Results Viewer with JSON trees, sortable tables, collapsible sections, output destination control, and F12 navigation## 📄 License

- **v1.6.1** - Bug fixes

- **v1.6.0** - Initial releaseMIT License - see [LICENSE](LICENSE) file


---

**Execute LinqPad queries in VS Code with enhanced Dumpify support!** 🎉
````
