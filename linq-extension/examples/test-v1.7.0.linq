<Query Kind="Program" >
  <Namespace>System.Text.Json</Namespace>
  <Namespace>System.Text.Json.Serialization</Namespace>
</Query>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

void Main()
{
    Console.WriteLine("LinqPad Runner v1.7.0 - Test Script");
    Console.WriteLine("====================================");
    Console.WriteLine();
    
    // Test 1: JSON Object
    Console.WriteLine("Test 1: JSON Object Output");
    var person = new { Name = "John Doe", Age = 30, City = "New York" };
    Console.WriteLine(JsonSerializer.Serialize(person));
    Console.WriteLine();
    
    // Test 2: JSON Array (Table)
    Console.WriteLine("Test 2: JSON Array (Table Output)");
    var items = new[]
    {
        new { Id = 1, Product = "Laptop", Price = 999.99m, InStock = true },
        new { Id = 2, Product = "Mouse", Price = 25.50m, InStock = true },
        new { Id = 3, Product = "Monitor", Price = 299.99m, InStock = false }
    };
    Console.WriteLine(JsonSerializer.Serialize(items));
    Console.WriteLine();
    items.Dump();
    
    // Test 3: Plain Text
    Console.WriteLine("Test 3: Plain Text Output");
    Console.WriteLine("This is a plain text message that should appear in the viewer.");
}
