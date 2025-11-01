# LinqPad Runner for VS Code# LinqPad Runner for VS Code# LinqPad Runner for VS Code

Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun) with enhanced Dumpify support for beautiful JSON and ASCII table formatting.Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun).Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun) with enhanced Dumpify support for beautiful JSON and ASCII table formatting.

## 📦 Installation & Setup## 📦 Installation & Setup## 📦 Installation & Setup

1. Install from VS Code marketplace: Search "LinqPad Runner"1. Install from VS Code marketplace: Search "LinqPad Runner"1. Install from VS Code marketplace: Search "LinqPad Runner"

2. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path

3. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path2. Configure LPRun path: `Ctrl+,` → Search "LinqPad Runner" → Set path

**Common LPRun Paths:**

**Common LPRun Paths:\*\***Common LPRun Paths:\*\*

- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)

- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)- **LPRun9**: `C:\Program Files\LINQPad9\LPRun9-x64.exe` (recommended)

## ✨ Features- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`- **LPRun8**: `C:\Program Files\LINQPad8\LPRun8-x64.exe`

- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, collapsible sections, and CSV export## ✨ Features## ✨ Features

- **C# Syntax Highlighting** for `.linq` files

- **One-Click Execution** with play button or `Ctrl+Shift+P` → "Run LinqPad Script"- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, collapsible sections, and CSV export- **Interactive Results Viewer** - Side-by-side webview with JSON trees, sortable tables, and export

- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, and NuGet packages

- **Output Destination Control** - Route output to console, viewer, or both- **C# Syntax Highlighting** for `.linq` files- **C# Syntax Highlighting** for `.linq` files

- **Command Palette Integration** - Create files, run scripts, browse examples

- **One-Click Execution** with play button or `Ctrl+Shift+P` → "Run LinqPad Script"- **One-Click Execution** with ▶️ button or `Ctrl+Shift+P` → "Run LinqPad Script"

## 🎯 Interactive Results Viewer

- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, and NuGet packages- **F12 Go to Definition** - Navigate to methods, classes, properties, #load files, and NuGet packages

View your output in a collapsible side-by-side panel with:

- **Output Destination Control** - Route output to console, viewer, or both- **IntelliSense Support** - Hover for quick info, Ctrl+Shift+O for outline view

- **JSON Tree View** - Expandable/collapsible JSON objects and arrays with syntax highlighting

- **Table View** - Sortable, filterable tables with search functionality- **Command Palette Integration** - Create files, run scripts, browse examples- **Auto Dumpify Injection** - Enhanced methods work automatically in VS Code

- **Collapsible Sections** - Organize multiple results in expandable sections

- **CSV Export** - Export table data as CSV files- **Smart Analysis** - Missing headers, namespaces, RuntimeVersion detection

- **Text Output** - Display plain text and structured output

## 🎯 Interactive Results Viewer- **Command Palette Integration** - Create files, run scripts, browse examples

## 🎯 Enhanced Dumpify Support

View your output in a collapsible side-by-side panel with:## 🎯 Enhanced Dumpify Support

**Auto-Injection**: Extension automatically detects Dumpify methods and adds required NuGet packages.

- **JSON Tree View** - Expandable/collapsible JSON objects and arrays**Auto-Injection**: Extension automatically detects Dumpify methods and adds required NuGet packages.

### Dump Methods

- **Table View** - Sortable, filterable tables with search

| Method | Description | VS Code Extension | Direct LPRun |

| --- | --- | --- | --- |- **Collapsible Sections** - Organize multiple results in expandable sections### Dump Methods

| `.Dump()` | LinqPad native JSON formatting | ✅ Works | ✅ Works |

| `.DumpText()` | ASCII table formatting | ✅ Auto-injected | ❌ Manual setup |- **CSV Export** - Export table data as CSV files

| `.DumpConsole()` | Console borders | ✅ Auto-injected | ❌ Manual setup |

| `.DumpDebug()` | Debug formatting | ✅ Auto-injected | ❌ Manual setup |- **Text Output** - Display plain text and structured output| Method | Description | VS Code Extension | Direct LPRun |

| `.DumpTrace()` | Trace formatting | ✅ Auto-injected | ❌ Manual setup |

| ---------------- | ------------------------------ | ----------------- | --------------- |

**Manual Setup** (only for direct LPRun/LinqPad usage):

## ⚙️ Configuration| `.Dump()` | LinqPad native JSON formatting | ✅ Works | ✅ Works |

````````xml

<Query Kind="Program">| `.DumpText()` | ASCII table formatting | ✅ Auto-injected | ❌ Manual setup |

  <NuGetReference>Dumpify</NuGetReference>

  <Namespace>Dumpify</Namespace>### Output Destination| `.DumpConsole()` | Console borders | ✅ Auto-injected | ❌ Manual setup |

</Query>

| `.DumpDebug()` | Debug formatting | ✅ Auto-injected | ❌ Manual setup |

using Dumpify;

```Control where output is displayed via settings:| `.DumpTrace()` | Trace formatting | ✅ Auto-injected | ❌ Manual setup |



## ⚙️ Configuration```````json**Manual Setup** (only for direct LPRun/LinqPad usage):



### Output Destination"linqpadRunner.outputDestination": "both"



Control where output is displayed:``````xml



```json<Query Kind="Program">

"linqpadRunner.outputDestination": "both"

```Options:  <NuGetReference>Dumpify</NuGetReference>



Options:- `"both"` - Display in both console and Interactive Viewer (default)  <Namespace>Dumpify</Namespace>



- `"both"` - Display in both console and Interactive Viewer (default)- `"viewerOnly"` - Show only in Interactive Viewer panel</Query>

- `"viewerOnly"` - Show only in Interactive Viewer panel

- `"consoleOnly"` - Show only in VS Code output console- `"consoleOnly"` - Show only in VS Code output consoleusing Dumpify;



### LPRun Path```````



```json### LPRun Path

"linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe"

```## ⚙️ Configuration



## 🚀 Usage````json



### Running Scripts"linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe"```json



1. Open a `.linq` file```{

2. Press play button in editor or `Ctrl+Shift+P` → "Run LinqPad Script"

3. View results in console or Interactive Viewer panel  "linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe",



### Navigating with F12## 🚀 Usage  "linqpadRunner.convertDumpCalls": true



- Position cursor on a method, class, or property}

- Press F12 to jump to definition

- Supports: #load files, NuGet packages, built-in types### Running Scripts```



### Creating New Files



`Ctrl+Shift+P` → "Create LinqPad Script" to scaffold a new .linq file1. Open a `.linq` file## 📝 Example



## 📝 Example Output Formats2. Press play button in editor or `Ctrl+Shift+P` → "Run LinqPad Script"



### JSON Output3. View results in console or Interactive Viewer```csharp



Output valid JSON objects:<Query Kind="Program" />



```csharp### Navigating with F12

var data = new { Name = "Test", Values = new[] { 1, 2, 3 } };

var json = JsonSerializer.Serialize(data);void Main()

Console.WriteLine(json);

```- Position cursor on a method, class, or property{



Displayed as expandable JSON tree in Interactive Viewer.- Press F12 to jump to definition    var data = new { Name = "John", Age = 30, City = "NYC" };



### Table Output- Supports: #load files, NuGet packages, built-in types



Output arrays of objects:    data.Dump("JSON formatting");     // Always works



```csharp### Creating New Files    data.DumpText("Table format");    // Auto-injected in VS Code

var items = new[] {

    new { Id = 1, Name = "Item 1", Value = 100 },    data.DumpConsole("With borders"); // Auto-injected in VS Code

    new { Id = 2, Name = "Item 2", Value = 200 }

};`Ctrl+Shift+P` → "Create LinqPad Script" to scaffold a new .linq file

var json = JsonSerializer.Serialize(items);

Console.WriteLine(json);    // Use F12 on method names to jump to definitions

````````

## 📝 Example Output Formats HelperMethod();

Displayed as sortable, filterable table in Interactive Viewer.

}

### Text Output

### JSON Output

Output plain text:

// Press F12 on HelperMethod() above to jump here

```csharp

Console.WriteLine("This is plain text output");Output valid JSON objects:void HelperMethod()

```

{

## 📋 Requirements

`````csharp "Helper executed".Dump();

- VS Code 1.60+

- LINQPad 8 or 9 with LPRun installedvar data = new { Name = "Test", Values = new[] { 1, 2, 3 } };}

- .NET SDK matching your script's RuntimeVersion

var json = JsonSerializer.Serialize(data);```

## 🐛 Troubleshooting

Console.WriteLine(json);

### LPRun Not Found

```## 🚀 Navigation Features

- Verify LPRun path in settings (`Ctrl+,`)

- Use absolute path: `C:\Program Files\LINQPad9\LPRun9-x64.exe`



### Interactive Viewer Not ShowingDisplayed as expandable JSON tree in Interactive Viewer.### F12 - Go to Definition



- Check `linqpadRunner.outputDestination` setting

- Ensure output is valid JSON for structured display

- Check output console for errors### Table Output- **Methods** - Jump to method definitions instantly



### Scripts Not Running- **Classes** - Navigate to class/interface/struct/record definitions



- Verify LPRun is installed and path is correctOutput arrays of objects:- **Properties** - Jump to property declarations

- Check RuntimeVersion in your .linq file matches your .NET version

- Ensure all namespaces and references are correct- **#load Files** - Open referenced .linq files: `#load "Utils.linq"`



## 📄 License```csharp- **NuGet Packages** - Open package documentation on nuget.org



MIT - See LICENSE filevar items = new[] {



## 🤝 Support    new { Id = 1, Name = "Item 1", Value = 100 },### Hover Information



- GitHub: https://github.com/tadrian/LinqpadRunnerExtension    new { Id = 2, Name = "Item 2", Value = 200 }

- Issues: https://github.com/tadrian/LinqpadRunnerExtension/issues

};- Hover over **Dumpify methods** (.Dump, .DumpText, etc.) for descriptions

## 📝 Version History

var json = JsonSerializer.Serialize(items);- Hover over **Query attributes** (RuntimeVersion, Kind, Namespace) for quick help

- **v1.7.4** - Fixed marketplace README display (moved to extension folder)

- **v1.7.3** - Fixed README formattingConsole.WriteLine(json);- Hover over **NuGet packages** to see package info

- **v1.7.2** - Fixed GitHub repository links

- **v1.7.1** - Interactive Results Viewer with JSON trees, sortable tables, collapsible sections, output destination control, and F12 navigation````

- **v1.6.1** - Bug fixes

- **v1.6.0** - Initial release### Ctrl+Shift+O - Quick Navigation


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
`````
