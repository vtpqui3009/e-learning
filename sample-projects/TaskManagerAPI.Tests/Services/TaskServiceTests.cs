using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;
using Xunit;

namespace TaskManagerAPI.Tests.Services;

public class TaskServiceTests : IDisposable
{
    private readonly TaskManagerContext _context;
    private readonly TaskService _taskService;

    public TaskServiceTests()
    {
        // Create a new in-memory database for each test
        var options = new DbContextOptionsBuilder<TaskManagerContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TaskManagerContext(options);
        _context.Database.EnsureCreated();
        _taskService = new TaskService(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task CreateTaskAsync_WithValidData_ShouldCreateTask()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "Test Task",
            Description: "Test Description",
            Priority: TaskPriority.High,
            DueDate: DateTime.UtcNow.AddDays(7),
            UserId: 1,
            CategoryId: 1
        );

        // Act
        var result = await _taskService.CreateTaskAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Test Task");
        result.Priority.Should().Be(TaskPriority.High);
        result.Status.Should().Be(TaskStatus.Todo);
    }

    [Fact]
    public async Task CreateTaskAsync_WithEmptyTitle_ShouldThrowException()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "",
            Description: "Test Description",
            Priority: TaskPriority.Medium,
            DueDate: null,
            UserId: 1,
            CategoryId: null
        );

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _taskService.CreateTaskAsync(request));
    }

    [Fact]
    public async Task CreateTaskAsync_WithPastDueDate_ShouldThrowException()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "Test Task",
            Description: "Test Description",
            Priority: TaskPriority.Medium,
            DueDate: DateTime.UtcNow.AddDays(-1),
            UserId: 1,
            CategoryId: null
        );

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _taskService.CreateTaskAsync(request));
        exception.Message.Should().Contain("past");
    }

    [Fact]
    public async Task CreateTaskAsync_WithNonexistentUser_ShouldThrowException()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "Test Task",
            Description: "Test Description",
            Priority: TaskPriority.Medium,
            DueDate: null,
            UserId: 999, // Non-existent user
            CategoryId: null
        );

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _taskService.CreateTaskAsync(request));
        exception.Message.Should().Contain("User");
    }

    [Fact]
    public async Task GetAllTasksAsync_WithNoFilters_ShouldReturnAllTasks()
    {
        // Act
        var result = await _taskService.GetAllTasksAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCountGreaterThan(0); // Seeded data
    }

    [Fact]
    public async Task GetAllTasksAsync_FilteredByUserId_ShouldReturnUserTasks()
    {
        // Act
        var result = await _taskService.GetAllTasksAsync(userId: 1);

        // Assert
        result.Should().NotBeNull();
        result.Should().OnlyContain(t => t.UserId == 1);
    }

    [Fact]
    public async Task GetAllTasksAsync_FilteredByStatus_ShouldReturnFilteredTasks()
    {
        // Act
        var result = await _taskService.GetAllTasksAsync(status: TaskStatus.Todo);

        // Assert
        result.Should().NotBeNull();
        result.Should().OnlyContain(t => t.Status == TaskStatus.Todo);
    }

    [Fact]
    public async Task GetTaskByIdAsync_WithValidId_ShouldReturnTask()
    {
        // Act
        var result = await _taskService.GetTaskByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetTaskByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _taskService.GetTaskByIdAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateTaskAsync_WithValidData_ShouldUpdateTask()
    {
        // Arrange
        var request = new UpdateTaskRequest(
            Title: "Updated Title",
            Description: "Updated Description",
            Status: null,
            Priority: TaskPriority.Critical,
            DueDate: null,
            CategoryId: null
        );

        // Act
        var result = await _taskService.UpdateTaskAsync(1, request);

        // Assert
        result.Should().NotBeNull();
        result!.Title.Should().Be("Updated Title");
        result.Priority.Should().Be(TaskPriority.Critical);
    }

    [Fact]
    public async Task UpdateTaskAsync_WithNonexistentTask_ShouldReturnNull()
    {
        // Arrange
        var request = new UpdateTaskRequest(
            Title: "Updated Title",
            Description: null,
            Status: null,
            Priority: null,
            DueDate: null,
            CategoryId: null
        );

        // Act
        var result = await _taskService.UpdateTaskAsync(999, request);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateTaskStatusAsync_WithValidTransition_ShouldUpdateStatus()
    {
        // Arrange - Get a Todo task
        var task = await _taskService.GetTaskByIdAsync(2);
        task!.Status.Should().Be(TaskStatus.Todo);

        // Act - Transition to InProgress
        var result = await _taskService.UpdateTaskStatusAsync(2, TaskStatus.InProgress);

        // Assert
        result.Should().NotBeNull();
        result!.Status.Should().Be(TaskStatus.InProgress);
    }

    [Fact]
    public async Task UpdateTaskStatusAsync_WithInvalidTransition_ShouldThrowException()
    {
        // Arrange - Get a Todo task
        var task = await _taskService.GetTaskByIdAsync(2);
        task!.Status.Should().Be(TaskStatus.Todo);

        // Act & Assert - Try to transition directly to Done (not allowed)
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _taskService.UpdateTaskStatusAsync(2, TaskStatus.Done));
    }

    [Fact]
    public async Task UpdateTaskStatusAsync_TransitionToDone_ShouldSetCompletedDate()
    {
        // Arrange - First move to InProgress
        await _taskService.UpdateTaskStatusAsync(2, TaskStatus.InProgress);

        // Act - Then move to Done
        var result = await _taskService.UpdateTaskStatusAsync(2, TaskStatus.Done);

        // Assert
        result.Should().NotBeNull();
        result!.Status.Should().Be(TaskStatus.Done);
        result.CompletedAt.Should().NotBeNull();
        result.CompletedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task DeleteTaskAsync_WithValidId_ShouldDeleteTask()
    {
        // Act
        var result = await _taskService.DeleteTaskAsync(1);

        // Assert
        result.Should().BeTrue();
        var deletedTask = await _taskService.GetTaskByIdAsync(1);
        deletedTask.Should().BeNull();
    }

    [Fact]
    public async Task DeleteTaskAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Act
        var result = await _taskService.DeleteTaskAsync(999);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task GetTaskStatisticsAsync_ShouldReturnCorrectCounts()
    {
        // Act
        var result = await _taskService.GetTaskStatisticsAsync(userId: 1);

        // Assert
        result.Should().NotBeNull();
        result.TotalTasks.Should().BeGreaterThan(0);
        result.TodoTasks.Should().BeGreaterThanOrEqualTo(0);
        result.InProgressTasks.Should().BeGreaterThanOrEqualTo(0);
        result.CompletedTasks.Should().BeGreaterThanOrEqualTo(0);
    }

    [Fact]
    public async Task GetOverdueTasksAsync_ShouldReturnOnlyOverdueTasks()
    {
        // Arrange - Create an overdue task
        var request = new CreateTaskRequest(
            Title: "Overdue Task",
            Description: "This is overdue",
            Priority: TaskPriority.High,
            DueDate: DateTime.UtcNow.AddDays(-5), // 5 days ago
            UserId: 1,
            CategoryId: 1
        );

        // This will fail due to validation, so let's directly add to DB for testing
        var overdueTask = new TaskItem
        {
            Title = "Overdue Task",
            Status = TaskStatus.Todo,
            Priority = TaskPriority.High,
            DueDate = DateTime.UtcNow.AddDays(-5),
            UserId = 1,
            CategoryId = 1
        };
        _context.Tasks.Add(overdueTask);
        await _context.SaveChangesAsync();

        // Act
        var result = await _taskService.GetOverdueTasksAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().Contain(t => t.Title == "Overdue Task");
        result.Should().OnlyContain(t => t.DueDate < DateTime.UtcNow.Date && t.Status != TaskStatus.Done);
    }

    [Theory]
    [InlineData(TaskPriority.Low)]
    [InlineData(TaskPriority.Medium)]
    [InlineData(TaskPriority.High)]
    [InlineData(TaskPriority.Critical)]
    public async Task CreateTaskAsync_WithDifferentPriorities_ShouldCreateTask(TaskPriority priority)
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: $"Task with {priority} priority",
            Description: "Test",
            Priority: priority,
            DueDate: null,
            UserId: 1,
            CategoryId: null
        );

        // Act
        var result = await _taskService.CreateTaskAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Priority.Should().Be(priority);
    }
}
