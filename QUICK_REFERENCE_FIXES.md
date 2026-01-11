# Quick Reference: xUnit to Plain C# Conversions

This document provides before/after examples for all common xUnit patterns that need to be converted.

## Common Transformations

### 1. Remove Using Statement
```csharp
// BEFORE
using System;
using Xunit;

// AFTER
using System;
```

### 2. Remove [Fact] Attribute
```csharp
// BEFORE
[Fact]
public void TestMethod()

// AFTER  
// In xUnit: [Fact]
public void TestMethod()
```

### 3. Assert.Equal
```csharp
// BEFORE
Assert.Equal(5, result);

// AFTER
if (result == 5)
    Console.WriteLine("✓ PASS: result equals 5");
else
    Console.WriteLine($"✗ FAIL: Expected 5 but got {result}");
```

### 4. Assert.True
```csharp
// BEFORE
Assert.True(condition);

// AFTER
if (condition)
    Console.WriteLine("✓ PASS: condition is true");
else
    Console.WriteLine("✗ FAIL: condition should be true");
```

### 5. Assert.False
```csharp
// BEFORE
Assert.False(condition);

// AFTER
if (!condition)
    Console.WriteLine("✓ PASS: condition is false");
else
    Console.WriteLine("✗ FAIL: condition should be false");
```

### 6. Assert.Null
```csharp
// BEFORE
Assert.Null(obj);

// AFTER
if (obj == null)
    Console.WriteLine("✓ PASS: object is null");
else
    Console.WriteLine("✗ FAIL: object should be null");
```

### 7. Assert.NotNull
```csharp
// BEFORE
Assert.NotNull(obj);

// AFTER
if (obj != null)
    Console.WriteLine("✓ PASS: object is not null");
else
    Console.WriteLine("✗ FAIL: object should not be null");
```

### 8. Assert.Contains (Collections)
```csharp
// BEFORE
Assert.Contains(3, numbers);

// AFTER
if (numbers.Contains(3))
    Console.WriteLine("✓ PASS: collection contains 3");
else
    Console.WriteLine("✗ FAIL: collection should contain 3");
```

### 9. Assert.Contains (Strings)
```csharp
// BEFORE
Assert.Contains("hello", text);

// AFTER
if (text.Contains("hello"))
    Console.WriteLine("✓ PASS: text contains 'hello'");
else
    Console.WriteLine("✗ FAIL: text should contain 'hello'");
```

### 10. Assert.Empty
```csharp
// BEFORE
Assert.Empty(list);

// AFTER
if (list.Count == 0)
    Console.WriteLine("✓ PASS: list is empty");
else
    Console.WriteLine($"✗ FAIL: list should be empty but has {list.Count} items");
```

### 11. Assert.NotEmpty
```csharp
// BEFORE
Assert.NotEmpty(list);

// AFTER
if (list.Count > 0)
    Console.WriteLine("✓ PASS: list is not empty");
else
    Console.WriteLine("✗ FAIL: list should not be empty");
```

### 12. Assert.Single
```csharp
// BEFORE
Assert.Single(list);

// AFTER
if (list.Count == 1)
    Console.WriteLine("✓ PASS: list has exactly one item");
else
    Console.WriteLine($"✗ FAIL: list should have 1 item but has {list.Count}");
```

### 13. Assert.All
```csharp
// BEFORE
Assert.All(numbers, n => Assert.True(n > 0));

// AFTER
using System.Linq;
if (numbers.All(n => n > 0))
    Console.WriteLine("✓ PASS: all numbers are greater than 0");
else
    Console.WriteLine("✗ FAIL: all numbers should be greater than 0");
```

### 14. Assert.Throws
```csharp
// BEFORE
Assert.Throws<DivideByZeroException>(() => calculator.Divide(10, 0));

// AFTER
try
{
    calculator.Divide(10, 0);
    Console.WriteLine("✗ FAIL: Expected DivideByZeroException");
}
catch (DivideByZeroException)
{
    Console.WriteLine("✓ PASS: DivideByZeroException was thrown");
}
catch (Exception ex)
{
    Console.WriteLine($"✗ FAIL: Wrong exception type: {ex.GetType().Name}");
}
```

### 15. Assert.Throws with Message Check
```csharp
// BEFORE
var exception = Assert.Throws<ArgumentException>(() => method(-5));
Assert.Contains("negative", exception.Message.ToLower());

// AFTER
try
{
    method(-5);
    Console.WriteLine("✗ FAIL: Expected ArgumentException");
}
catch (ArgumentException ex)
{
    if (ex.Message.ToLower().Contains("negative"))
        Console.WriteLine("✓ PASS: ArgumentException with correct message");
    else
        Console.WriteLine("✗ FAIL: Exception message incorrect");
}
```

### 16. Record.Exception (No Exception Expected)
```csharp
// BEFORE
var exception = Record.Exception(() => calculator.Divide(10, 2));
Assert.Null(exception);

// AFTER
try
{
    double result = calculator.Divide(10, 2);
    Console.WriteLine($"✓ PASS: No exception, result = {result}");
}
catch (Exception ex)
{
    Console.WriteLine($"✗ FAIL: Unexpected exception: {ex.GetType().Name}");
}
```

### 17. [Theory] with [InlineData]
```csharp
// BEFORE
[Theory]
[InlineData(2, 3, 5)]
[InlineData(0, 0, 0)]
[InlineData(-1, -1, -2)]
public void Add_ReturnsSum(int a, int b, int expected)
{
    var calc = new Calculator();
    Assert.Equal(expected, calc.Add(a, b));
}

// AFTER
// In xUnit: [Theory] with [InlineData(2,3,5), (0,0,0), (-1,-1,-2)]
public void Add_ReturnsSum()
{
    var calc = new Calculator();
    var testCases = new[]
    {
        (a: 2, b: 3, expected: 5),
        (a: 0, b: 0, expected: 0),
        (a: -1, b: -1, expected: -2)
    };

    foreach (var test in testCases)
    {
        int result = calc.Add(test.a, test.b);
        if (result == test.expected)
            Console.WriteLine($"✓ PASS: Add({test.a},{test.b}) = {test.expected}");
        else
            Console.WriteLine($"✗ FAIL: Add({test.a},{test.b}) expected {test.expected} but got {result}");
    }
}
```

### 18. [MemberData]
```csharp
// BEFORE
public static IEnumerable<object[]> TestData =>
    new List<object[]>
    {
        new object[] { 2, true },
        new object[] { 3, true }
    };

[Theory]
[MemberData(nameof(TestData))]
public void IsPrime_ReturnsExpected(int number, bool expected)
{
    Assert.Equal(expected, helper.IsPrime(number));
}

// AFTER
public static (int number, bool expected)[] TestData => new[]
{
    (2, true),
    (3, true)
};

// In xUnit: [Theory] [MemberData(nameof(TestData))]
public void IsPrime_ReturnsExpected()
{
    var helper = new MathHelper();
    foreach (var test in TestData)
    {
        bool result = helper.IsPrime(test.number);
        if (result == test.expected)
            Console.WriteLine($"✓ PASS: IsPrime({test.number}) = {test.expected}");
        else
            Console.WriteLine($"✗ FAIL: IsPrime({test.number}) expected {test.expected} but got {result}");
    }
}
```

### 19. Complete Test Class Structure
```csharp
// BEFORE
using Xunit;

public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        var calc = new Calculator();
        Assert.Equal(5, calc.Add(2, 3));
    }
}

// AFTER
using System;

public class CalculatorTests
{
    // In xUnit: [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        var calc = new Calculator();
        int result = calc.Add(2, 3);
        if (result == 5)
            Console.WriteLine("✓ PASS: Add(2,3) returns 5");
        else
            Console.WriteLine($"✗ FAIL: Expected 5 but got {result}");
    }
}

class Program
{
    static void Main()
    {
        var tests = new CalculatorTests();
        Console.WriteLine("=== Running Tests ===");
        tests.Add_TwoNumbers_ReturnsSum();
        Console.WriteLine("=== Tests Complete ===");
    }
}
```

## File-Specific Notes

### Lesson 03
- Add `using System.Linq;` for collection tests
- Add `using System.Text.RegularExpressions;` for String Validator

### Lesson 04  
- Theory tests need tuple arrays for test data
- MemberData becomes static properties returning tuples
- Setup/Cleanup (IDisposable) can remain mostly unchanged

### Lesson 05
- Integration tests need Main() methods to run workflows
- Multiple test methods should be called sequentially
- LINQ methods (FirstOrDefault, Where, Any, Count) remain unchanged

---

**Use This For**: Quick copy-paste reference when converting code blocks
**See Also**: TESTING_LESSONS_FIX_COMPLETE_REPORT.md for comprehensive guide

