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
    
    var items = new[]
    {
        new { Id = 1, Product = "Laptop", Price = 999.99m, InStock = true },
        new { Id = 2, Product = "Mouse", Price = 25.50m, InStock = true },
        new { Id = 3, Product = "Monitor", Price = 299.99m, InStock = false }
    };
    
    items.Dump();
}
