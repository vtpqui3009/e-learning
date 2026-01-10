# Complete Guide to C# Testing for Manual Testers

**For**: Manual testers with no C# programming experience
**Goal**: Learn how to create and run automated tests with C#
**Prerequisites**: Completed the C# learning platform lessons (Fundamentals → OOP Basics)

---

## Table of Contents

1. [Introduction to Testing](#introduction-to-testing)
2. [Setting Up Your C# Testing Environment](#setting-up-your-c-testing-environment)
3. [Creating Your First Test Project](#creating-your-first-test-project)
4. [Understanding Unit Tests](#understanding-unit-tests)
5. [Writing Your First Test](#writing-your-first-test)
6. [Running Tests](#running-tests)
7. [Common Testing Patterns](#common-testing-patterns)
8. [Integration Testing](#integration-testing)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Introduction to Testing

### What is Automated Testing?

Automated testing means writing code that tests other code. Instead of manually clicking buttons and checking results, you write test scripts that do it automatically.

### Types of Tests

1. **Unit Tests**: Test individual methods or classes in isolation
2. **Integration Tests**: Test how different parts work together
3. **End-to-End (E2E) Tests**: Test the entire application flow
4. **API Tests**: Test web services and APIs

### Why Learn C# for Testing?

- ✅ Used for testing .NET applications
- ✅ Great for API testing
- ✅ Can test desktop and web applications
- ✅ Many testing frameworks available (NUnit, xUnit, MSTest)
- ✅ Strong job market for C# test automation engineers

---

## Setting Up Your C# Testing Environment

### Step 1: Install .NET SDK

1. **Download .NET SDK**:
   - Visit: https://dotnet.microsoft.com/download
   - Download the latest .NET 8 SDK (or .NET 7)
   - Run the installer

2. **Verify Installation**:
   ```bash
   dotnet --version
   ```
   You should see something like: `8.0.100`

### Step 2: Install Visual Studio Code (Recommended for Beginners)

1. **Download VS Code**:
   - Visit: https://code.visualstudio.com/
   - Download and install

2. **Install C# Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "C#"
   - Install "C# Dev Kit" by Microsoft

### Step 3: Create a Testing Folder

```bash
# Create a folder for your tests
mkdir C:\TestAutomation
cd C:\TestAutomation
```

---

## Creating Your First Test Project

### Step 1: Create a Solution

A solution is a container for your projects.

```bash
# Create a new folder
mkdir MyFirstTestProject
cd MyFirstTestProject

# Create a solution
dotnet new sln -n MyFirstTestProject
```

**What happened?**
- Created a file: `MyFirstTestProject.sln`
- This organizes all your test projects

### Step 2: Create the Application Project

First, let's create a simple calculator application that we'll test.

```bash
# Create a class library (the code we'll test)
dotnet new classlib -n Calculator
dotnet sln add Calculator/Calculator.csproj
```

**What happened?**
- Created a folder: `Calculator`
- Contains: `Calculator.csproj` and `Class1.cs`
- Added to the solution

### Step 3: Write the Calculator Code

Open `Calculator/Class1.cs` and replace with:

```csharp
namespace Calculator
{
    public class Calculator
    {
        // Add two numbers
        public int Add(int a, int b)
        {
            return a + b;
        }

        // Subtract two numbers
        public int Subtract(int a, int b)
        {
            return a - b;
        }

        // Multiply two numbers
        public int Multiply(int a, int b)
        {
            return a * b;
        }

        // Divide two numbers
        public double Divide(double a, double b)
        {
            if (b == 0)
            {
                throw new DivideByZeroException("Cannot divide by zero");
            }
            return a / b;
        }

        // Check if a number is even
        public bool IsEven(int number)
        {
            return number % 2 == 0;
        }

        // Get the larger of two numbers
        public int GetMax(int a, int b)
        {
            return a > b ? a : b;
        }
    }
}
```

**Save the file** (Ctrl+S)

### Step 4: Create the Test Project

Now let's create tests for this calculator.

```bash
# Create a test project using xUnit
dotnet new xunit -n Calculator.Tests
dotnet sln add Calculator.Tests/Calculator.Tests.csproj

# Add reference to the Calculator project
cd Calculator.Tests
dotnet add reference ../Calculator/Calculator.csproj
cd ..
```

**What happened?**
- Created a folder: `Calculator.Tests`
- This project will contain all our tests
- Linked it to the Calculator project so tests can access the code

---

## Understanding Unit Tests

### What is a Unit Test?

A unit test checks if a single method works correctly. Think of it like checking one button on a calculator.

### Anatomy of a Test

```csharp
[Fact]                                    // 1. Attribute (marks it as a test)
public void Add_TwoPositiveNumbers_ReturnsSum()  // 2. Method name (describes what we're testing)
{
    // 3. Arrange - Set up
    var calculator = new Calculator();
    int a = 5;
    int b = 3;

    // 4. Act - Do the action
    int result = calculator.Add(a, b);

    // 5. Assert - Check the result
    Assert.Equal(8, result);
}
```

### Test Naming Convention

Format: `MethodName_Scenario_ExpectedBehavior`

Examples:
- `Add_TwoPositiveNumbers_ReturnsSum`
- `Divide_ByZero_ThrowsException`
- `IsEven_WithOddNumber_ReturnsFalse`

---

## Writing Your First Test

### Step 1: Open the Test File

Open `Calculator.Tests/UnitTest1.cs`

### Step 2: Delete the Default Test

Delete everything in the file.

### Step 3: Write Your First Tests

Copy this into `UnitTest1.cs`:

```csharp
using Xunit;

namespace Calculator.Tests
{
    public class CalculatorTests
    {
        // Test 1: Adding two positive numbers
        [Fact]
        public void Add_TwoPositiveNumbers_ReturnsSum()
        {
            // Arrange (Set up)
            var calculator = new Calculator();
            int a = 5;
            int b = 3;

            // Act (Do the action)
            int result = calculator.Add(a, b);

            // Assert (Check result)
            Assert.Equal(8, result);
        }

        // Test 2: Adding negative numbers
        [Fact]
        public void Add_TwoNegativeNumbers_ReturnsNegativeSum()
        {
            // Arrange
            var calculator = new Calculator();
            int a = -5;
            int b = -3;

            // Act
            int result = calculator.Add(a, b);

            // Assert
            Assert.Equal(-8, result);
        }

        // Test 3: Subtracting numbers
        [Fact]
        public void Subtract_FirstNumberLarger_ReturnsPositive()
        {
            // Arrange
            var calculator = new Calculator();
            int a = 10;
            int b = 3;

            // Act
            int result = calculator.Subtract(a, b);

            // Assert
            Assert.Equal(7, result);
        }

        // Test 4: Multiplying numbers
        [Fact]
        public void Multiply_TwoNumbers_ReturnsProduct()
        {
            // Arrange
            var calculator = new Calculator();
            int a = 4;
            int b = 5;

            // Act
            int result = calculator.Multiply(a, b);

            // Assert
            Assert.Equal(20, result);
        }

        // Test 5: Dividing numbers
        [Fact]
        public void Divide_TwoNumbers_ReturnsQuotient()
        {
            // Arrange
            var calculator = new Calculator();
            double a = 10;
            double b = 2;

            // Act
            double result = calculator.Divide(a, b);

            // Assert
            Assert.Equal(5, result);
        }

        // Test 6: Dividing by zero should throw exception
        [Fact]
        public void Divide_ByZero_ThrowsException()
        {
            // Arrange
            var calculator = new Calculator();
            double a = 10;
            double b = 0;

            // Act & Assert
            Assert.Throws<DivideByZeroException>(() => calculator.Divide(a, b));
        }

        // Test 7: Checking even number
        [Fact]
        public void IsEven_EvenNumber_ReturnsTrue()
        {
            // Arrange
            var calculator = new Calculator();
            int number = 4;

            // Act
            bool result = calculator.IsEven(number);

            // Assert
            Assert.True(result);
        }

        // Test 8: Checking odd number
        [Fact]
        public void IsEven_OddNumber_ReturnsFalse()
        {
            // Arrange
            var calculator = new Calculator();
            int number = 5;

            // Act
            bool result = calculator.IsEven(number);

            // Assert
            Assert.False(result);
        }

        // Test 9: Getting maximum value
        [Fact]
        public void GetMax_FirstNumberLarger_ReturnsFirst()
        {
            // Arrange
            var calculator = new Calculator();
            int a = 10;
            int b = 5;

            // Act
            int result = calculator.GetMax(a, b);

            // Assert
            Assert.Equal(10, result);
        }

        // Test 10: Getting maximum value (second larger)
        [Fact]
        public void GetMax_SecondNumberLarger_ReturnsSecond()
        {
            // Arrange
            var calculator = new Calculator();
            int a = 3;
            int b = 8;

            // Act
            int result = calculator.GetMax(a, b);

            // Assert
            Assert.Equal(8, result);
        }
    }
}
```

**Save the file** (Ctrl+S)

---

## Running Tests

### Method 1: Command Line (Recommended)

```bash
# Navigate to test project folder
cd Calculator.Tests

# Run all tests
dotnet test

# You should see output like:
# Passed!  - Failed:     0, Passed:    10, Skipped:     0, Total:    10
```

### Method 2: Visual Studio Code

1. Open the test file (`UnitTest1.cs`)
2. You'll see "Run Test" / "Debug Test" buttons above each test
3. Click "Run Test" above any test method
4. See results in the output panel

### Method 3: Run Specific Tests

```bash
# Run tests that match a filter
dotnet test --filter "Add"

# This will run only tests with "Add" in the name
```

### Understanding Test Results

**✅ PASSED**: Test worked correctly
```
Passed Add_TwoPositiveNumbers_ReturnsSum
```

**❌ FAILED**: Test found a bug
```
Failed Add_TwoPositiveNumbers_ReturnsSum
Expected: 8
Actual: 7
```

---

## Common Testing Patterns

### Pattern 1: Testing Multiple Scenarios (Theory Tests)

Instead of writing many similar tests, use `[Theory]`:

```csharp
// Test adding multiple combinations
[Theory]
[InlineData(2, 3, 5)]      // 2 + 3 = 5
[InlineData(0, 0, 0)]      // 0 + 0 = 0
[InlineData(-1, -1, -2)]   // -1 + -1 = -2
[InlineData(100, 200, 300)] // 100 + 200 = 300
public void Add_VariousNumbers_ReturnsCorrectSum(int a, int b, int expected)
{
    // Arrange
    var calculator = new Calculator();

    // Act
    int result = calculator.Add(a, b);

    // Assert
    Assert.Equal(expected, result);
}
```

**Benefits**:
- One test method covers many scenarios
- Easy to add more test cases
- Clear to see all tested combinations

### Pattern 2: Testing for Null Values

```csharp
[Fact]
public void ProcessUser_NullUser_ThrowsException()
{
    // Arrange
    var service = new UserService();
    User user = null;

    // Act & Assert
    Assert.Throws<ArgumentNullException>(() => service.ProcessUser(user));
}
```

### Pattern 3: Testing String Results

```csharp
[Fact]
public void GetGreeting_ValidName_ReturnsGreeting()
{
    // Arrange
    var greeter = new Greeter();
    string name = "Alice";

    // Act
    string result = greeter.GetGreeting(name);

    // Assert
    Assert.Equal("Hello, Alice!", result);
    Assert.Contains("Alice", result);
    Assert.StartsWith("Hello", result);
}
```

### Pattern 4: Testing Collections

```csharp
[Fact]
public void GetActiveUsers_FiltersList_ReturnsOnlyActive()
{
    // Arrange
    var service = new UserService();

    // Act
    List<User> result = service.GetActiveUsers();

    // Assert
    Assert.NotEmpty(result);           // Has items
    Assert.All(result, u => Assert.True(u.IsActive)); // All active
    Assert.Equal(3, result.Count);     // Exact count
}
```

---

## Integration Testing

### What is Integration Testing?

Integration tests check if different parts of your application work together. For example, testing if your code can save data to a database.

### Example: Testing a User Service

#### Step 1: Create the User Service

Create a new file `UserService.cs` in the Calculator project:

```csharp
namespace Calculator
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserService
    {
        private List<User> users = new List<User>();
        private int nextId = 1;

        // Create a new user
        public User CreateUser(string name, string email)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Name cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email cannot be empty");
            }

            var user = new User
            {
                Id = nextId++,
                Name = name,
                Email = email,
                IsActive = true
            };

            users.Add(user);
            return user;
        }

        // Get user by ID
        public User GetUserById(int id)
        {
            return users.FirstOrDefault(u => u.Id == id);
        }

        // Get all active users
        public List<User> GetActiveUsers()
        {
            return users.Where(u => u.IsActive).ToList();
        }

        // Deactivate a user
        public bool DeactivateUser(int id)
        {
            var user = GetUserById(id);
            if (user == null)
            {
                return false;
            }

            user.IsActive = false;
            return true;
        }

        // Get user count
        public int GetUserCount()
        {
            return users.Count;
        }
    }
}
```

#### Step 2: Write Integration Tests

Create a new file in `Calculator.Tests` called `UserServiceTests.cs`:

```csharp
using Xunit;
using Calculator;
using System.Collections.Generic;

namespace Calculator.Tests
{
    public class UserServiceTests
    {
        // Test 1: Creating a user
        [Fact]
        public void CreateUser_ValidData_ReturnsUser()
        {
            // Arrange
            var service = new UserService();
            string name = "John Doe";
            string email = "john@example.com";

            // Act
            User result = service.CreateUser(name, email);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(name, result.Name);
            Assert.Equal(email, result.Email);
            Assert.True(result.IsActive);
            Assert.Equal(1, result.Id);
        }

        // Test 2: Creating multiple users
        [Fact]
        public void CreateUser_MultipleUsers_AssignsUniqueIds()
        {
            // Arrange
            var service = new UserService();

            // Act
            User user1 = service.CreateUser("Alice", "alice@example.com");
            User user2 = service.CreateUser("Bob", "bob@example.com");
            User user3 = service.CreateUser("Charlie", "charlie@example.com");

            // Assert
            Assert.Equal(1, user1.Id);
            Assert.Equal(2, user2.Id);
            Assert.Equal(3, user3.Id);
            Assert.Equal(3, service.GetUserCount());
        }

        // Test 3: Creating user with empty name
        [Fact]
        public void CreateUser_EmptyName_ThrowsException()
        {
            // Arrange
            var service = new UserService();

            // Act & Assert
            Assert.Throws<ArgumentException>(() =>
                service.CreateUser("", "email@example.com"));
        }

        // Test 4: Getting user by ID
        [Fact]
        public void GetUserById_ExistingUser_ReturnsUser()
        {
            // Arrange
            var service = new UserService();
            User created = service.CreateUser("Alice", "alice@example.com");

            // Act
            User result = service.GetUserById(created.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Alice", result.Name);
        }

        // Test 5: Getting non-existent user
        [Fact]
        public void GetUserById_NonExistentUser_ReturnsNull()
        {
            // Arrange
            var service = new UserService();

            // Act
            User result = service.GetUserById(999);

            // Assert
            Assert.Null(result);
        }

        // Test 6: Getting active users
        [Fact]
        public void GetActiveUsers_MixedUsers_ReturnsOnlyActive()
        {
            // Arrange
            var service = new UserService();
            service.CreateUser("Alice", "alice@example.com");
            User bob = service.CreateUser("Bob", "bob@example.com");
            service.CreateUser("Charlie", "charlie@example.com");
            service.DeactivateUser(bob.Id); // Deactivate Bob

            // Act
            List<User> result = service.GetActiveUsers();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, u => Assert.True(u.IsActive));
            Assert.DoesNotContain(result, u => u.Name == "Bob");
        }

        // Test 7: Deactivating a user
        [Fact]
        public void DeactivateUser_ExistingUser_SetsInactive()
        {
            // Arrange
            var service = new UserService();
            User user = service.CreateUser("Alice", "alice@example.com");

            // Act
            bool result = service.DeactivateUser(user.Id);

            // Assert
            Assert.True(result);
            User deactivatedUser = service.GetUserById(user.Id);
            Assert.False(deactivatedUser.IsActive);
        }

        // Test 8: Complete workflow test
        [Fact]
        public void UserService_CompleteWorkflow_WorksCorrectly()
        {
            // Arrange
            var service = new UserService();

            // Act & Assert - Step by step

            // Step 1: Create users
            User alice = service.CreateUser("Alice", "alice@example.com");
            User bob = service.CreateUser("Bob", "bob@example.com");
            Assert.Equal(2, service.GetUserCount());

            // Step 2: Verify active users
            List<User> activeUsers = service.GetActiveUsers();
            Assert.Equal(2, activeUsers.Count);

            // Step 3: Deactivate one user
            service.DeactivateUser(bob.Id);
            activeUsers = service.GetActiveUsers();
            Assert.Equal(1, activeUsers.Count);

            // Step 4: Verify correct user is still active
            Assert.Contains(activeUsers, u => u.Name == "Alice");
            Assert.DoesNotContain(activeUsers, u => u.Name == "Bob");
        }
    }
}
```

#### Step 3: Run the Integration Tests

```bash
# Run all tests
dotnet test

# Run only UserService tests
dotnet test --filter "UserService"

# You should see all tests passing!
```

---

## Best Practices

### 1. Test One Thing Per Test

❌ **Bad** - Testing multiple things:
```csharp
[Fact]
public void Calculator_Works()
{
    var calc = new Calculator();
    Assert.Equal(8, calc.Add(5, 3));
    Assert.Equal(2, calc.Subtract(5, 3));
    Assert.Equal(15, calc.Multiply(5, 3));
}
```

✅ **Good** - One test per method:
```csharp
[Fact]
public void Add_TwoNumbers_ReturnsSum()
{
    var calc = new Calculator();
    Assert.Equal(8, calc.Add(5, 3));
}

[Fact]
public void Subtract_TwoNumbers_ReturnsDifference()
{
    var calc = new Calculator();
    Assert.Equal(2, calc.Subtract(5, 3));
}
```

### 2. Use Descriptive Test Names

❌ **Bad**:
```csharp
[Fact]
public void Test1() { }

[Fact]
public void TestAdd() { }
```

✅ **Good**:
```csharp
[Fact]
public void Add_TwoPositiveNumbers_ReturnsSum() { }

[Fact]
public void Add_NegativeAndPositive_ReturnsCorrectResult() { }
```

### 3. Arrange-Act-Assert Pattern

Always structure tests this way:

```csharp
[Fact]
public void MyTest()
{
    // Arrange - Set up everything
    var calculator = new Calculator();
    int a = 5;
    int b = 3;

    // Act - Do the action
    int result = calculator.Add(a, b);

    // Assert - Check result
    Assert.Equal(8, result);
}
```

### 4. Test Edge Cases

Don't just test the happy path:

```csharp
// Normal case
[Fact]
public void Add_TwoPositiveNumbers_ReturnsSum() { }

// Edge cases
[Fact]
public void Add_WithZero_ReturnsOtherNumber() { }

[Fact]
public void Add_NegativeNumbers_ReturnsNegativeSum() { }

[Fact]
public void Add_VeryLargeNumbers_HandlesOverflow() { }
```

### 5. Keep Tests Independent

Each test should work on its own:

❌ **Bad** - Tests depend on each other:
```csharp
private static User testUser;

[Fact]
public void Test1_CreateUser()
{
    testUser = service.CreateUser("Alice", "email");
}

[Fact]
public void Test2_UpdateUser()
{
    service.UpdateUser(testUser); // Depends on Test1!
}
```

✅ **Good** - Each test is independent:
```csharp
[Fact]
public void CreateUser_ValidData_ReturnsUser()
{
    var service = new UserService();
    User user = service.CreateUser("Alice", "email");
    Assert.NotNull(user);
}

[Fact]
public void UpdateUser_ValidUser_UpdatesSuccessfully()
{
    var service = new UserService();
    User user = service.CreateUser("Alice", "email"); // Create fresh
    service.UpdateUser(user);
    Assert.True(service.GetUserById(user.Id).LastUpdated > DateTime.MinValue);
}
```

### 6. Use Clear Assert Messages

```csharp
// Add message to make failures clearer
Assert.Equal(expected, actual, "User count should be 3 after adding 3 users");

Assert.True(user.IsActive, "Newly created users should be active by default");
```

---

## Troubleshooting

### Problem 1: "Command 'dotnet' not found"

**Solution**:
1. Install .NET SDK from https://dotnet.microsoft.com/download
2. Restart your terminal/command prompt
3. Verify: `dotnet --version`

### Problem 2: Tests Won't Run

**Solution**:
```bash
# Make sure you're in the test project folder
cd Calculator.Tests

# Restore packages
dotnet restore

# Build the project
dotnet build

# Run tests
dotnet test
```

### Problem 3: "Cannot find Calculator namespace"

**Solution**:
```bash
# Add reference to the main project
cd Calculator.Tests
dotnet add reference ../Calculator/Calculator.csproj
```

### Problem 4: Test Failing with "Expected X but was Y"

**Solution**:
1. Read the error message carefully
2. Check your expected value
3. Debug the actual code
4. Add Console.WriteLine to see values:
   ```csharp
   Console.WriteLine($"Expected: {expected}, Actual: {actual}");
   ```

### Problem 5: All Tests Skipped

**Solution**:
- Make sure methods are `public`
- Check for `[Fact]` or `[Theory]` attribute
- Rebuild: `dotnet build`

---

## Quick Reference

### Common Assert Methods

```csharp
// Equality
Assert.Equal(expected, actual);
Assert.NotEqual(expected, actual);

// Boolean
Assert.True(condition);
Assert.False(condition);

// Null checks
Assert.Null(obj);
Assert.NotNull(obj);

// Collections
Assert.Empty(collection);
Assert.NotEmpty(collection);
Assert.Contains(item, collection);
Assert.DoesNotContain(item, collection);

// Exceptions
Assert.Throws<ExceptionType>(() => method());

// Strings
Assert.Contains("substring", fullString);
Assert.StartsWith("prefix", fullString);
Assert.EndsWith("suffix", fullString);

// Numbers
Assert.InRange(value, min, max);
```

### Common Test Attributes

```csharp
[Fact]           // Single test
[Theory]         // Parameterized test
[InlineData()]   // Test data for Theory
[Skip("Reason")] // Skip this test
```

---

## Practice Exercises

### Exercise 1: String Validator

Create a `StringValidator` class that tests:
1. If a string is empty
2. If a string has minimum length
3. If a string contains only letters
4. If a string is a valid email format

Then write at least 8 tests for it.

### Exercise 2: Shopping Cart

Create a `ShoppingCart` class with:
- Add item method
- Remove item method
- Get total price method
- Apply discount method

Write tests for:
- Adding items increases count
- Removing items decreases count
- Total price is calculated correctly
- Discount is applied correctly
- Removing non-existent item doesn't crash

### Exercise 3: Temperature Converter

Create a `TemperatureConverter` class:
- Convert Celsius to Fahrenheit
- Convert Fahrenheit to Celsius
- Handle freezing/boiling points

Write tests for:
- Normal conversions
- Zero values
- Freezing point (0°C = 32°F)
- Boiling point (100°C = 212°F)
- Negative temperatures

---

## Next Steps

1. **Practice Daily**: Write tests for 30 minutes each day
2. **Test Real Projects**: Apply testing to actual work projects
3. **Learn Advanced Topics**:
   - Mocking (Moq library)
   - Test doubles
   - Test-driven development (TDD)
   - API testing with RestSharp
   - UI testing with Selenium
4. **Join Communities**:
   - Stack Overflow
   - Reddit r/csharp
   - C# Discord servers
5. **Read Documentation**:
   - xUnit: https://xunit.net/
   - NUnit: https://nunit.org/
   - MSTest: https://docs.microsoft.com/en-us/dotnet/core/testing/

---

## Summary Checklist

✅ I can create a new test project
✅ I can write a unit test with Arrange-Act-Assert
✅ I can run tests from command line
✅ I can test for exceptions
✅ I can use Theory tests with multiple inputs
✅ I understand test naming conventions
✅ I can test classes and methods
✅ I can write integration tests
✅ I know common testing best practices
✅ I can troubleshoot test failures

---

**Congratulations!** You now know how to write automated tests in C#! 🎉

Keep practicing, and soon you'll be a proficient test automation engineer. Remember: good tests make good software!

---

**Need Help?**
- Refer back to this guide
- Check the C# learning platform lessons
- Search for specific errors on Stack Overflow
- Practice with the exercises above

**Happy Testing!** 🚀
