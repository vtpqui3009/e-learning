# Task Manager API

A comprehensive RESTful API for managing tasks, users, and categories. This project is designed as a practical example for learning manual and automated testing in C#.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **User Management**: Associate tasks with users
- **Category System**: Organize tasks into categories
- **Priority Levels**: Low, Medium, High, Critical
- **Status Workflow**: Todo → InProgress → Done (with validation)
- **Due Date Tracking**: Set and track task deadlines
- **Statistics**: Get task statistics per user
- **Overdue Detection**: Identify tasks past their due date

## Technology Stack

- **.NET 8.0**: Latest .NET framework
- **ASP.NET Core Web API**: RESTful API framework
- **Entity Framework Core**: ORM for database access
- **In-Memory Database**: Simple database for development/testing
- **Swagger/OpenAPI**: API documentation
- **xUnit**: Unit testing framework
- **Moq**: Mocking library
- **FluentAssertions**: Assertion library

## 📥 Download and Setup

### How to Get This Project

**If you're taking the course**: The project is already in `sample-projects/TaskManagerAPI/`

**Download from GitHub**:
```bash
git clone https://github.com/vtpqui3009/e-learning.git
cd e-learning/sample-projects/TaskManagerAPI
```

**Or download ZIP**:
1. Go to the course repository on GitHub
2. Click "Code" → "Download ZIP"
3. Extract and navigate to `sample-projects/TaskManagerAPI/`

**Detailed instructions**: See `../DOWNLOAD_GUIDE.md`

## Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- Visual Studio 2022, VS Code, or Rider

### Running the API

```bash
cd TaskManagerAPI
dotnet restore
dotnet run
```

The API will start at `https://localhost:5001` (or `http://localhost:5000`)

### Swagger UI

Navigate to `https://localhost:5001` to access the Swagger UI for testing the API interactively.

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks (optional filters: userId, status)
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/status` - Update task status
- `GET /api/tasks/statistics/{userId}` - Get task statistics for a user
- `GET /api/tasks/overdue` - Get overdue tasks (optional filter: userId)

## Testing

### Running Unit Tests

```bash
cd TaskManagerAPI.Tests
dotnet test
```

### Running Tests with Coverage

```bash
dotnet test --collect:"XPlat Code Coverage"
```

### Test Projects

- **Unit Tests**: Test business logic in isolation (TaskServiceTests)
- **Integration Tests**: Test API endpoints end-to-end (TasksControllerIntegrationTests)

## Manual Testing Guide

See [MANUAL_TESTING_GUIDE.md](MANUAL_TESTING_GUIDE.md) for comprehensive manual testing scenarios.

## Data Model

### TaskItem

```csharp
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive docs",
  "status": "InProgress", // Todo, InProgress, Done, Cancelled
  "priority": "High",     // Low, Medium, High, Critical
  "createdAt": "2024-01-15T10:00:00Z",
  "dueDate": "2024-01-20T23:59:59Z",
  "completedAt": null,
  "userId": 1,
  "categoryId": 1
}
```

### Status Transitions

Valid transitions:
- **Todo** → InProgress, Cancelled
- **InProgress** → Done, Todo, Cancelled
- **Done** → InProgress
- **Cancelled** → Todo

## Business Rules

1. **Title is required** and cannot exceed 200 characters
2. **Due date cannot be in the past** when creating/updating
3. **User must exist** when creating a task
4. **Category must exist** if provided
5. **Status transitions** must follow the workflow
6. **CompletedAt** is automatically set when status changes to Done

## Seeded Data

The application comes with sample data:

### Users
- John Doe (ID: 1)
- Jane Smith (ID: 2)

### Categories
- Work (ID: 1)
- Personal (ID: 2)
- Shopping (ID: 3)

### Tasks
- 3 sample tasks across different statuses and users

## Learning Objectives

This project demonstrates:

### For Manual Testing
- API endpoint testing with tools (Postman, curl, Swagger)
- Validation testing
- Workflow testing (status transitions)
- Edge case testing (past dates, invalid IDs)
- Error handling verification

### For Automated Testing
- **Unit Testing**: Isolated business logic testing
- **Integration Testing**: End-to-end API testing
- **Test Patterns**: Arrange-Act-Assert
- **Mocking**: Using Moq for dependencies
- **Assertions**: FluentAssertions for readable tests
- **Test Data**: In-memory database for isolated tests
- **Theory Testing**: Parameterized tests with multiple inputs

## Project Structure

```
TaskManagerAPI/
├── Controllers/         # API endpoints
├── Services/           # Business logic
├── Models/             # Data entities
├── DTOs/               # Data transfer objects
├── Data/               # Database context
└── Program.cs          # Application startup

TaskManagerAPI.Tests/
├── Services/           # Service unit tests
└── Controllers/        # Integration tests
```

## Contributing

This is an educational project. Feel free to extend it with:
- Authentication/Authorization
- Real database (SQL Server, PostgreSQL)
- Task assignments and collaboration
- File attachments
- Notifications
- Task templates
- Recurring tasks

## License

MIT License - Free to use for educational purposes
