<Query Kind="Program">
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
