# How to Download and Access the Task Manager API Project

This guide explains how to get the Task Manager API project on your local machine so you can follow along with the testing lessons.

## Prerequisites

Before downloading, make sure you have:
- ✅ **.NET 8.0 SDK** or later installed
  - Check: `dotnet --version`
  - Download: https://dotnet.microsoft.com/download
- ✅ A code editor (VS Code, Visual Studio, or Rider)
- ✅ Git (optional, for cloning)

## Method 1: Course Materials (Recommended)

If you're taking this course from official materials, the project is already included!

**Location**: `sample-projects/TaskManagerAPI/`

```bash
# Navigate to the project
cd sample-projects/TaskManagerAPI

# Verify you have the files
ls
```

**What you should see:**
```
Controllers/
Services/
Models/
DTOs/
Data/
TaskManagerAPI.csproj
Program.cs
appsettings.json
README.md
```

**If you see these files, you're ready to go!** Skip to "Quick Start" below.

## Method 2: Clone from GitHub

Clone the entire course repository:

```bash
# Clone the repository
git clone https://github.com/vtpqui3009/e-learning.git

# Navigate to Task Manager API
cd e-learning/sample-projects/TaskManagerAPI

# Verify files
ls
```

## Method 3: Download ZIP

### Step 1: Go to GitHub

Visit the course repository:
```
https://github.com/vtpqui3009/e-learning
```

### Step 2: Download

1. Click the green **"Code"** button
2. Select **"Download ZIP"**
3. Save the file to your computer

### Step 3: Extract

1. Extract the ZIP file to a location like:
   - Windows: `C:\Users\YourName\Documents\csharp-learning`
   - Mac/Linux: `~/Documents/csharp-learning`

2. Navigate to the project:
   ```bash
   cd e-learning/sample-projects/TaskManagerAPI
   ```

## Method 4: Copy Individual Files

If you only want the Task Manager API (not the entire course):

### Files to Download

**Main Project** (`TaskManagerAPI/`):
```
TaskManagerAPI/
├── Controllers/
│   └── TasksController.cs
├── Services/
│   ├── ITaskService.cs
│   └── TaskService.cs
├── Models/
│   ├── TaskItem.cs
│   ├── User.cs
│   └── Category.cs
├── DTOs/
│   └── TaskDTOs.cs
├── Data/
│   └── TaskManagerContext.cs
├── TaskManagerAPI.csproj
├── Program.cs
├── appsettings.json
└── README.md
```

**Test Project** (`TaskManagerAPI.Tests/`):
```
TaskManagerAPI.Tests/
├── Services/
│   └── TaskServiceTests.cs
├── Controllers/
│   └── TasksControllerIntegrationTests.cs
└── TaskManagerAPI.Tests.csproj
```

**Documentation**:
- `README.md`
- `MANUAL_TESTING_GUIDE.md`
- `QUICK_START.md`

Download these from the GitHub repository by clicking on each file and selecting "Raw" → "Save As".

## Quick Start (After Download)

Once you have the files, follow these steps:

### 1. Verify .NET Installation

```bash
dotnet --version
```

Should show `8.0` or higher.

### 2. Navigate to Project

```bash
cd sample-projects/TaskManagerAPI
```

### 3. Restore Packages

```bash
dotnet restore
```

This downloads all NuGet packages (Entity Framework, Swagger, etc.)

### 4. Run the API

```bash
dotnet run
```

You should see:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 5. Open Swagger UI

Open your browser to:
```
https://localhost:5001
```

You should see the Swagger UI with all API endpoints!

### 6. Test an Endpoint

In Swagger:
1. Click **GET /api/tasks**
2. Click "Try it out"
3. Click "Execute"
4. You should see JSON with 3 sample tasks!

### 7. Run the Tests

Open a **new terminal** (keep the API running) and run:

```bash
cd sample-projects/TaskManagerAPI.Tests
dotnet test
```

You should see:
```
Passed!  - Failed:     0, Passed:    28, Skipped:     0, Total:    28
```

🎉 **Success!** You're ready to start the testing lessons!

## Troubleshooting

### Problem: "dotnet: command not found"

**Solution**: Install .NET 8.0 SDK from https://dotnet.microsoft.com/download

After installation, restart your terminal and try again.

### Problem: "Port 5001 already in use"

**Solution**: Another application is using port 5001.

Option 1: Stop the other application
Option 2: Change the port in `appsettings.json`:

```json
{
  "Urls": "https://localhost:7001;http://localhost:7000"
}
```

### Problem: Build errors

**Solution**: Clean and rebuild:

```bash
dotnet clean
dotnet restore
dotnet build
```

### Problem: Certificate warnings in browser

**Solution**: Trust the development certificate:

```bash
dotnet dev-certs https --trust
```

### Problem: Missing files after download

**Solution**: Re-download or clone the repository.

Verify you have:
- ✅ TaskManagerAPI.csproj
- ✅ Program.cs
- ✅ Controllers/ directory
- ✅ Services/ directory

If any are missing, re-download the complete project.

## Project Structure

After downloading, you should have:

```
sample-projects/
├── TaskManagerAPI/              # Main API project
│   ├── Controllers/            # API endpoints (8 endpoints)
│   ├── Services/              # Business logic
│   ├── Models/                # Data models
│   ├── DTOs/                  # Request/Response objects
│   ├── Data/                  # Database context
│   ├── Program.cs             # App startup
│   ├── appsettings.json       # Configuration
│   └── README.md              # Project documentation
│
├── TaskManagerAPI.Tests/       # Test project (28 tests)
│   ├── Services/              # Unit tests
│   └── Controllers/           # Integration tests
│
├── QUICK_START.md             # Quick setup guide
├── MANUAL_TESTING_GUIDE.md    # Manual testing scenarios
└── DOWNLOAD_GUIDE.md          # This file
```

## File Sizes (Approximate)

- **TaskManagerAPI/** - ~50 KB (source code)
- **TaskManagerAPI.Tests/** - ~30 KB (test code)
- **Documentation** - ~20 KB
- **Total** - ~100 KB (without packages)

After `dotnet restore`:
- **With packages** - ~50 MB (includes all NuGet packages)

## Next Steps

Once you have the project running:

1. **Read the README**: `sample-projects/TaskManagerAPI/README.md`
2. **Review Manual Testing Guide**: `MANUAL_TESTING_GUIDE.md`
3. **Start Lesson 00**: Project Overview
4. **Follow Lesson 02**: Setup Environment (complete walkthrough)

## Need Help?

If you encounter issues:

1. **Check Prerequisites**: Ensure .NET 8.0 SDK is installed
2. **Verify Files**: Make sure all files downloaded correctly
3. **Read Error Messages**: They usually point to the problem
4. **Try Clean Build**: `dotnet clean && dotnet restore && dotnet build`
5. **Ask Instructor**: Provide the error message you're seeing

## Alternative: Create from Scratch

If you prefer to create the project yourself (great learning exercise!):

1. Follow **Lesson 02 - Setup Environment**
2. Create a new Web API project
3. Copy the code from the lessons
4. Build the project step-by-step

This approach takes longer but helps you understand the architecture!

## Verify Your Setup

Run this checklist to confirm everything is working:

- [ ] .NET 8.0 SDK installed (`dotnet --version`)
- [ ] Project files downloaded
- [ ] `dotnet restore` completed successfully
- [ ] `dotnet run` starts the API
- [ ] Browser opens to https://localhost:5001
- [ ] Swagger UI loads
- [ ] GET /api/tasks returns data
- [ ] `dotnet test` shows 28 passing tests

**If all checkboxes are ticked, you're ready to learn testing!** 🚀

## Quick Commands Reference

```bash
# Navigate to project
cd sample-projects/TaskManagerAPI

# Restore packages
dotnet restore

# Run the API
dotnet run

# Run tests (in new terminal)
cd ../TaskManagerAPI.Tests
dotnet test

# Build without running
dotnet build

# Clean build artifacts
dotnet clean
```

Happy learning! 🎓
