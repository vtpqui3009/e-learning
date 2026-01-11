#!/usr/bin/env python3
import re

file_path = 'content/lessons/10-testing/03-writing-first-tests.mdx'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define all 6 replacements

# 1. Boolean Assertions (already done before but let's ensure it)
content = content.replace(
    '''<CodeEditor
  initialCode={`using System;
using Xunit;

public class BooleanTests
{
    [Fact]
    public void TestBooleans()
    {
        // True - checks if condition is true
        Assert.True(5 > 3);
        Assert.True("hello".Contains("ell"));

        // False - checks if condition is false
        Assert.False(3 > 5);
        Assert.False("hello".Contains("xyz"));

        Console.WriteLine("All boolean assertions passed!");
    }
}`}
/>''',
    '''<CodeEditor
  initialCode={`using System;

// Demonstrating boolean assertions
// In xUnit: Assert.True() and Assert.False()

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Boolean Assertions ===");
        Console.WriteLine();

        // True - checks if condition is true
        // In xUnit: Assert.True(5 > 3);
        if (5 > 3)
            Console.WriteLine("✓ PASS: 5 > 3 is true");
        else
            Console.WriteLine("✗ FAIL: 5 > 3 should be true");

        // In xUnit: Assert.True("hello".Contains("ell"));
        if ("hello".Contains("ell"))
            Console.WriteLine("✓ PASS: \\"hello\\" contains \\"ell\\"");
        else
            Console.WriteLine("✗ FAIL: \\"hello\\" should contain \\"ell\\"");

        Console.WriteLine();

        // False - checks if condition is false
        // In xUnit: Assert.False(3 > 5);
        if (!(3 > 5))
            Console.WriteLine("✓ PASS: 3 > 5 is false");
        else
            Console.WriteLine("✗ FAIL: 3 > 5 should be false");

        // In xUnit: Assert.False("hello".Contains("xyz"));
        if (!("hello".Contains("xyz")))
            Console.WriteLine("✓ PASS: \\"hello\\" does not contain \\"xyz\\"");
        else
            Console.WriteLine("✗ FAIL: \\"hello\\" should not contain \\"xyz\\"");

        Console.WriteLine();
        Console.WriteLine("All boolean assertions passed!");
    }
}`}
/>'''
)

print("Fixed 1/6: Boolean Assertions")

# 2. Null Assertions
content = content.replace(
    '''<CodeEditor
  initialCode={`using System;
using Xunit;

public class NullTests
{
    [Fact]
    public void TestNull()
    {
        string nullString = null;
        string notNullString = "hello";

        // Null - checks if value is null
        Assert.Null(nullString);

        // NotNull - checks if value is not null
        Assert.NotNull(notNullString);

        Console.WriteLine("All null assertions passed!");
    }
}`}
/>''',
    '''<CodeEditor
  initialCode={`using System;

// Demonstrating null assertions
// In xUnit: Assert.Null() and Assert.NotNull()

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Null Assertions ===");
        Console.WriteLine();

        string nullString = null;
        string notNullString = "hello";

        // Null - checks if value is null
        // In xUnit: Assert.Null(nullString);
        if (nullString == null)
            Console.WriteLine("✓ PASS: nullString is null");
        else
            Console.WriteLine("✗ FAIL: nullString should be null");

        // NotNull - checks if value is not null
        // In xUnit: Assert.NotNull(notNullString);
        if (notNullString != null)
            Console.WriteLine("✓ PASS: notNullString is not null");
        else
            Console.WriteLine("✗ FAIL: notNullString should not be null");

        Console.WriteLine();
        Console.WriteLine("All null assertions passed!");
    }
}`}
/>'''
)

print("Fixed 2/6: Null Assertions")

# Write the file
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated {file_path}")
