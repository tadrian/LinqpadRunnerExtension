# LinqPad Runner for VS Code

Execute `.linq` files directly in VS Code using LinqPad's command-line tool (LPRun) with enhanced Dumpify support.

## Installation

1. Install from VS Code marketplace: Search "LinqPad Runner"
2. Configure LPRun path in settings

**Common Paths:**
- LPRun9: `C:\Program Files\LINQPad9\LPRun9-x64.exe`
- LPRun8: `C:\Program Files\LINQPad8\LPRun8-x64.exe`

## Features

- Interactive Results Viewer with JSON trees and sortable tables
- C# Syntax Highlighting for `.linq` files  
- One-Click Execution with play button
- F12 Go to Definition navigation
- Output Destination Control

## Enhanced Dumpify Support

Auto-injection of Dumpify methods:

| Method | VS Code Extension | Direct LPRun |
| ------ | ----------------- | ------------ |
| `.Dump()` | ✅ Works | ✅ Works |
| `.DumpText()` | ✅ Auto-injected | ❌ Manual |
| `.DumpConsole()` | ✅ Auto-injected | ❌ Manual |
| `.DumpDebug()` | ✅ Auto-injected | ❌ Manual |

## Configuration

```json
"linqpadRunner.lprunPath": "C:\\Program Files\\LINQPad9\\LPRun9-x64.exe"
"linqpadRunner.outputDestination": "both"
```

## Usage

1. Open a `.linq` file
2. Press play button or `Ctrl+Shift+P` → "Run LinqPad Script"
3. View results in Interactive Viewer

## Support

- GitHub: https://github.com/tadrian/LinqpadRunnerExtension
- Issues: https://github.com/tadrian/LinqpadRunnerExtension/issues