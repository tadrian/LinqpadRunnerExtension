# VS Code Custom Instructions - .NET Development

## 🚨 CRITICAL REQUIREMENTS (MUST FOLLOW)

### Project Batch Files Requirements

- **EVERY project MUST have these files in the project root:**
  - `run.bat` - Kills existing processes and runs the project
  - `build.bat` - Builds the project with error handling
  - `publish.bat` - Publishes as framework-dependent deployment to `publish/` folder
- **If these files don't exist, CREATE them automatically without asking**
- **ALWAYS use these batch files instead of running `dotnet run` or `dotnet publish` directly**
- **Each batch file MUST start by killing running instances using `taskkill`**

### Chat Documentation Requirement

- **MUST create and maintain `.github/chat.md`** to store conversation history
- **Update this file after EVERY response** with timestamp and assistant message
- Truncate messages longer than 2000 characters with "... (truncated)"
- Create backup copies in `backup/` folder before updates

### MCP Server Usage

- **MUST use MCP tools when available** - especially `microsoft-docs` and `context7`
- **MUST research using MCP servers before writing any code** to get latest information
- Your knowledge is outdated - ALWAYS verify with MCP tools first

## 🔧 Build & Run Standards

### Standard Batch File Templates

#### run.bat Template:

```batch
@echo off
echo Killing any existing instances...
taskkill /IM ProjectName.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo Building and running project...
dotnet run --project "%~dp0ProjectName.csproj"
if %errorlevel% neq 0 (
    echo Build/Run failed!
    pause
    exit /b %errorlevel%
)
```

#### build.bat Template:

```batch
@echo off
echo Killing any existing instances...
taskkill /IM ProjectName.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo Building project...
dotnet build "%~dp0ProjectName.csproj"
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo Build completed successfully!
pause
```

#### publish.bat Template:

```batch
@echo off
echo Publishing ProjectName...
taskkill /IM ProjectName.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo Note: Framework-dependent deployment - requires .NET runtime on target machine.
dotnet publish -c Release -r win-x64 --self-contained false -o publish "%~dp0ProjectName.csproj"
if %errorlevel% neq 0 (
    echo Publish failed!
    pause
    exit /b %errorlevel%
)
echo Published successfully to 'publish' folder!
echo To run: navigate to publish folder and run ProjectName.exe
pause
```

### Project Scaffolding Rules

- **ALWAYS use `dotnet new console -n ProjectName`** for new projects
- **Never manually create Program.cs or .csproj files**
- **After scaffolding, add custom folders:** Repositories/, Services/, Models/, Utils/, Config/, LinqPad/

## 📊 LINQPad Integration

### LINQPad Setup & Usage

- **All LINQPad files go in project's `LinqPad/` folder**
- **Use LPRun for execution:** `C:\Zips\Apps\Linqpad9\LPRun9-x64.exe`
- **ALWAYS use ABSOLUTE paths for assembly references** - relative paths often fail
- **Reference project DLL:** `#r "C:\Path\To\Project\bin\Debug\net10.0\ProjectName.dll"`

### LINQPad Query Templates

#### Basic Program Query:

```csharp
<Query Kind="Program">
  <Reference>C:\Path\To\Project\bin\Debug\net10.0\ProjectName.dll</Reference>
</Query>

using ProjectName.Services;
using ProjectName.Models;

void Main()
{
    // Your test code here
    var service = new SomeService();
    service.GetData().Take(10).Dump();
}
```

#### SQL Connection Query:

```csharp
<Query Kind="SQL">
  <Connection>
    <ID>ee186b92-9c9a-4278-b42b-eeef99327fd7</ID>
    <Server>DESKTOP-5PD7SLV\SQLEXPRESS</Server>
    <Database>F0001</Database>
  </Connection>
</Query>

SELECT TOP 10 * FROM sys.tables;
```

#### Expression Query:

```csharp
<Query Kind="Expression" />
Environment.MachineName
```

### LINQPad Query Types

| Kind       | Use Case                              |
| ---------- | ------------------------------------- |
| Program    | Multi-method scripts, Main() needed   |
| Statements | Sequential statements (implicit Main) |
| Expression | Single expression result              |

### LINQPad Execution

```powershell
# From repository root
& 'C:\Zips\Apps\Linqpad9\LPRun9-x64.exe' .\linqpad\HelloWorld.linq
```

### LINQPad Safety Rules

- **ONLY read operations in test queries**
- **NO updates, deletes, or inserts**
- **Use placeholders for sensitive data, not actual credentials**
- **ALWAYS use absolute paths for assembly references** - LINQPad has issues with relative paths
- **Verify assembly path exists before running LPRun**

## 💻 .NET 9 Development Standards

### Core Principles

- **Follow SOLID principles** for maintainable code
- **Use Dependency Injection (DI)** for decoupling
- **Organize into services, repositories, and models**
- **Favor simplicity over cleverness**
- **Write clear, maintainable, readable code**
- **Use async/await** for I/O operations
- **Prefer LINQ** over manual loops when practical

### Project Structure

```
ProjectName/
├── README.md
├── ProjectName.csproj
├── Program.cs
├── run.bat
├── build.bat
├── publish.bat
├── Repositories/     # Data access
├── Services/         # Business logic
├── Models/          # Data models and DTOs
├── Utils/           # Helpers and utilities
├── Config/          # Configuration files
└── LinqPad/         # LINQPad test scripts
```

### Interface Design Rules

- **ALWAYS create interfaces before implementing concrete classes**
- **Define interfaces in appropriate folders** (e.g., Interfaces/, Services/Interfaces/)
- **Register both interface and implementation in DI container**
- **Use interface types in constructor parameters**

### Modern C# Features to Use

- File-scoped namespaces
- Global using directives
- Minimal Program.cs with top-level statements
- Required properties for immutable models
- Pattern matching enhancements
- Raw string literals for multi-line strings

### Compilation Safety Rules

- **ALL using statements at top before namespace**
- **Run `dotnet build` immediately after structural changes**
- **Verify API usage with preview/beta packages**
- **Never place using statements after namespace/class**

### Console App Patterns

- **Use `static async Task<int> Main(string[] args)`** for async apps
- **Include proper exception handling** with logging
- **Return appropriate exit codes** (0 success, 1+ errors)
- **ALWAYS validate command line arguments**
- **Configure Serilog early** and use ILogger<T>

## 🏗️ MVP Development Approach

### MVP Philosophy

- **Default to MVP unless explicitly asked for enterprise structure**
- **Solve ONE main problem exceptionally well**
- **Focus on learning and validation over feature completeness**
- **Deliver real value from day one**

### MVP Structure

- **Essential:** Core value prop, basic auth, primary functionality, simple UI, basic CRUD, error handling
- **Avoid in MVP:** Multiple roles, advanced analytics, complex integrations, extensive customization

### MVP Timeline (6-8 weeks)

- **Weeks 1-2:** Problem validation, user interviews, define metrics, wireframes
- **Weeks 3-4:** Core backend, data models, auth, API endpoints
- **Weeks 5-6:** Minimal frontend, core flows, error handling
- **Weeks 7-8:** User testing, bug fixes, polish, launch prep

## 🧪 Development Workflow

### Agent Behavior Rules

- **Keep going until user's query is completely resolved**
- **Check context7 and microsoft-docs MCP servers before writing code**
- **Use fetch_webpage for internet research**
- **MUST iterate until problem is solved**
- **Never end turn without solving the problem**

### Research Requirements

- **CANNOT successfully complete tasks without internet research**
- **MUST use fetch_webpage to verify understanding of packages/frameworks**
- **Read content thoroughly and fetch additional relevant links**
- **Recursively gather information until complete**

### File Management Rules

- **ALWAYS create backup copy before editing files**
- **Move backups to `backup/` folder with non-compilation extensions**
- **NEVER delete files - rename with `.bak` suffix**
- **Keep change log with semantic versioning**

### Communication Guidelines

- **Tell user what you're going to do before making tool calls**
- **Use concise, friendly, professional tone**
- **Provide bullet point summaries of changes**
- **Never display code unless specifically requested**

## 📦 Package & Dependency Management

### Recommended NuGet Packages

- **System.Text.Json** for JSON serialization
- **Microsoft.Extensions.DependencyInjection** for DI
- **Serilog** with extensions for logging
- **EntityFrameworkCore or Dapper** for database
- **HttpClient or Refit** for REST APIs

### Package Reference Rules

- **Add `ExcludeAssets="runtime"`** for Microsoft.Build packages
- **Verify API usage patterns** for preview/beta packages
- **Test minimal examples** before complex implementations

### Service Lifetime Guidelines

- **Singleton:** Stateless services
- **Scoped:** Request-scoped data
- **Transient:** Lightweight utilities

## 📋 Code Quality Standards

### Naming Conventions

- **Classes:** PascalCase
- **Interfaces:** IPascalCase
- **Methods:** PascalCase
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Private fields:** \_camelCase

### Code Quality Rules

- **Avoid obsolete/deprecated APIs**
- **Prefer immutability**
- **Keep methods short and focused**
- **Use appropriate service lifetimes**
- **Never use .Result or .Wait()** - use async/await
- **Exclude build artifacts** in file scanning (bin/, obj/, .vshistory/)

### Testing & Validation

- **Run tests after each change**
- **Use get_errors tool** to check for problems
- **Debug thoroughly** to identify root causes
- **Test frequently** during development

## 📚 Documentation Standards

### README Template Requirements

```markdown
# Project Name

## Description

Brief description of what this console app does.

## Features

- Feature 1
- Feature 2

## Requirements

- .NET 9
- Required packages

## Installation

1. Clone the repo
2. Run `dotnet restore`
3. Run `dotnet build`

## Usage

Examples of how to run the console app

## Architecture

- SOLID principles applied
- Services and repositories
- Dependency injection

## External Requests Documentation

### MCP Server Requests

- List any MCP requests made

### Web Fetch Requests

- List any web fetch requests made

### Research Sources

- List external sources consulted
```

### Memory Instructions

- **Create `.github/memory-instruction.md`** if it doesn't exist
- **Start with YAML frontmatter:** `applyTo: '**'`
- **Store minimal details** for future reference
- **Update automatically** after relevant lookups

## 🔄 Chat Logging System

### Auto-append Rules

- **After every assistant response**, append to `.github/chat.md`
- **Format:** ISO-8601 UTC timestamp + "Assistant" label + message
- **Create backup** in `backup/` folder before appending
- **Truncate messages > 2000 characters** with "... (truncated)"
- **Never append secrets/credentials**

### Chat Log Example Format

```
2025-09-06T14:55:00Z - Assistant:
I'll help you create the batch files for your project...

2025-09-06T15:02:00Z - Assistant:
The build completed successfully. Here's what I changed:
- Added run.bat with process killing
- Created publish.bat with framework-dependent deployment
... (truncated)
```

## ⚡ Terminal & Command Rules

### PowerShell Commands

- **Generate commands correctly for pwsh.exe**
- **Never insert `Press any key to continue` or `Read-Host`**
- **Test replacements before actual replace operations**
- **Use absolute paths to avoid navigation issues**

### Build Process

- **Always run `taskkill /f /im dotnet.exe`** before building
- **Use background processes for long-running tasks**
- **Verify current working directory** before dotnet commands

---

## 🤖 Specific LLM Model Guidelines

### Grok Code Fast 1 (xAI)

**Best for:** Fast tool calling, zero-to-one projects, surgical bug fixes
**C# Strengths:** LINQ queries, async/await, Entity Framework, xUnit testing, ASP.NET Core APIs

### Claude Sonnet 4 (Anthropic)

**Best for:** Complex architecture, enterprise patterns, detailed planning
**C# Prompting Tips:**

- Use XML tags: `<requirements>`, `<constraints>`
- Request "production-ready" or "enterprise-grade" code
- Provide detailed context and motivation
- Ask for thinking before implementation
  **C# Strengths:** Clean architecture, CQRS, microservices, security patterns

### GPT-4.1 (OpenAI)

**Best for:** Large refactoring, integration testing, documentation
**C# Strengths:** Modern C# features, records, pattern matching, Roslyn analyzers, CI/CD pipelines

### GPT-4o mini (OpenAI)

**Best for:** Rapid prototyping, simple tasks, cost efficiency
**C# Strengths:** Basic CRUD, console apps, simple Web APIs, code completion

### GPT-5 and GPT-5 mini (OpenAI)

**Best for:** Complex autonomous coding, comprehensive planning
**C# Prompting Tips:**

- Use XML structure: `<guiding_principles>`, `<technical_stack>`
- Include agentic persistence instructions
- Request high verbosity for code tools
- Use self-reflection patterns for quality
  **C# Strengths:** Modern .NET 9, clean architecture, autonomous implementation, multimodal UI matching

<concise_mode>

- Output: answer only.
- No intro, no recap.
- If list needed: max 3 bullets.
- If a value is requested: return the value and nothing else.
  </concise_mode>

---

## 📝 Model Selection Strategy

- **GPT-5:** Complex autonomous coding projects
- **Claude Sonnet 4:** Detailed architectural planning
- **GPT-4.1:** Large refactors and documentation
- **GPT-4o mini:** Quick prototyping
- **Grok Code Fast 1:** Fast tool-calling workflows

---

_Remember: These instructions ensure consistent, professional .NET development with proper tooling, safety measures, and documentation practices._
