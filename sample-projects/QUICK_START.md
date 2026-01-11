# Quick Start Guide - Task Manager API

This guide will help you get started with the Task Manager API project for the testing lessons.

## Prerequisites

### Required
- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download)

### Optional (for manual testing)
- **Postman** - [Download here](https://www.postman.com/downloads/)
- **Visual Studio 2022** or **VS Code** or **Rider**

## Verifying .NET Installation

Open a terminal and run:
```bash
dotnet --version
```

You should see version 8.0 or higher. If not, install .NET 8.0 SDK.

## Running the API

### Option 1: Using Command Line

1. Open terminal in the `sample-projects/TaskManagerAPI` directory:
```bash
cd sample-projects/TaskManagerAPI
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run
```

4. The API will start at:
   - HTTPS: `https://localhost:5001`
   - HTTP: `http://localhost:5000`

5. Open your browser and navigate to:
```
https://localhost:5001
```

You should see the Swagger UI with all available endpoints.

### Option 2: Using Visual Studio

1. Open `TaskManagerAPI.sln`
2. Press **F5** or click **Run**
3. The API will start and open Swagger UI automatically

### Option 3: Using VS Code

1. Open the `sample-projects` folder in VS Code
2. Install the **C# Dev Kit** extension if prompted
3. Press **F5** to run
4. Select **C#: TaskManagerAPI** if prompted

## Running the Tests

### Command Line

Navigate to the test project:
```bash
cd sample-projects/TaskManagerAPI.Tests
dotnet test
```

### Visual Studio

1. Open **Test Explorer** (Test > Test Explorer)
2. Click **Run All Tests**

### VS Code

1. Install the **.NET Core Test Explorer** extension
2. Tests will appear in the sidebar
3. Click the play button to run tests

## Expected Output

When you run the API, you should see:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

When you run tests:
```
Passed!  - Failed:     0, Passed:    28, Skipped:     0, Total:    28
```

## Testing the API

### Option 1: Swagger UI (Easiest)

1. Navigate to `https://localhost:5001`
2. Click on any endpoint (e.g., GET `/api/tasks`)
3. Click **"Try it out"**
4. Click **"Execute"**
5. See the response below

### Option 2: Postman

1. Create a new request
2. Set method to **GET**
3. Set URL to `https://localhost:5001/api/tasks`
4. Click **Send**
5. You should see a JSON array of tasks

### Option 3: curl (Command Line)

```bash
curl -k https://localhost:5001/api/tasks
```

Note: `-k` flag skips SSL verification (only for development)

## Sample Requests

### Get All Tasks
```bash
curl -k https://localhost:5001/api/tasks
```

### Create a Task
```bash
curl -k -X POST "https://localhost:5001/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Testing",
    "description": "Complete all testing lessons",
    "priority": "High",
    "userId": 1,
    "categoryId": 1
  }'
```

### Get Task by ID
```bash
curl -k https://localhost:5001/api/tasks/1
```

### Update Task Status
```bash
curl -k -X PATCH "https://localhost:5001/api/tasks/1/status" \
  -H "Content-Type: application/json" \
  -d '"InProgress"'
```

## Troubleshooting

### Port Already in Use

If ports 5000/5001 are in use, you can change them in `appsettings.json`:

```json
{
  "Urls": "https://localhost:7001;http://localhost:7000"
}
```

### SSL Certificate Warning

When accessing `https://localhost:5001`, you might see a certificate warning. This is normal for development. Click "Advanced" and "Proceed" (or trust the dev certificate).

To trust the development certificate:
```bash
dotnet dev-certs https --trust
```

### .NET SDK Not Found

Make sure you've installed .NET 8.0 SDK from:
https://dotnet.microsoft.com/download

After installation, restart your terminal.

### Build Errors

If you get build errors, try:
```bash
dotnet clean
dotnet restore
dotnet build
```

## Next Steps

Now that you have the API running:

1. **Explore the Swagger UI** - Try all endpoints
2. **Read the Manual Testing Guide** - `MANUAL_TESTING_GUIDE.md`
3. **Run the Tests** - See how automated tests work
4. **Follow the Lessons** - Start with `00-project-overview.mdx`

## Project Structure

```
sample-projects/
├── TaskManagerAPI/              # Main API project
│   ├── Controllers/            # API endpoints
│   ├── Services/              # Business logic
│   ├── Models/                # Data models
│   ├── DTOs/                  # Request/Response objects
│   ├── Data/                  # Database context
│   ├── Program.cs             # App startup
│   └── appsettings.json       # Configuration
│
├── TaskManagerAPI.Tests/       # Test project
│   ├── Services/              # Unit tests
│   └── Controllers/           # Integration tests
│
├── TaskManagerAPI.sln          # Solution file
├── README.md                   # Detailed documentation
├── MANUAL_TESTING_GUIDE.md     # Manual testing scenarios
└── QUICK_START.md              # This file
```

## Useful Commands

```bash
# Run the API
dotnet run

# Run with watch (auto-restart on changes)
dotnet watch run

# Run tests
dotnet test

# Run tests with detailed output
dotnet test --logger "console;verbosity=detailed"

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Clean build artifacts
dotnet clean

# Restore dependencies
dotnet restore

# Build without running
dotnet build
```

## Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify .NET SDK is installed: `dotnet --version`
3. Make sure ports 5000/5001 are available
4. Try cleaning and rebuilding: `dotnet clean && dotnet build`

## Ready to Learn!

You're all set! The API is running, tests are passing, and you're ready to dive into the testing lessons.

Start with:
- **Lesson 00**: Project Overview (`content/lessons/10-testing/00-project-overview.mdx`)
- **Manual Testing Guide**: `MANUAL_TESTING_GUIDE.md`

Happy testing! 🧪
