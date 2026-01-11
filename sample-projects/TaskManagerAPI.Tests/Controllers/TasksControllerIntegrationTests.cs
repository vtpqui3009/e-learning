using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using Xunit;

namespace TaskManagerAPI.Tests.Controllers;

public class TasksControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TasksControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTasks_ShouldReturnOkWithTasks()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskResponse>>();
        tasks.Should().NotBeNull();
        tasks.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetTasks_WithUserIdFilter_ShouldReturnFilteredTasks()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks?userId=1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskResponse>>();
        tasks.Should().NotBeNull();
        tasks.Should().OnlyContain(t => t.UserId == 1);
    }

    [Fact]
    public async Task GetTasks_WithStatusFilter_ShouldReturnFilteredTasks()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks?status=Todo");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskResponse>>();
        tasks.Should().NotBeNull();
        tasks.Should().OnlyContain(t => t.Status == TaskStatus.Todo);
    }

    [Fact]
    public async Task GetTaskById_WithValidId_ShouldReturnTask()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var task = await response.Content.ReadFromJsonAsync<TaskResponse>();
        task.Should().NotBeNull();
        task!.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetTaskById_WithInvalidId_ShouldReturnNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateTask_WithValidData_ShouldReturnCreated()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "New Integration Test Task",
            Description: "Created via integration test",
            Priority: TaskPriority.High,
            DueDate: DateTime.UtcNow.AddDays(7),
            UserId: 1,
            CategoryId: 1
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var task = await response.Content.ReadFromJsonAsync<TaskResponse>();
        task.Should().NotBeNull();
        task!.Title.Should().Be("New Integration Test Task");
        task.Priority.Should().Be(TaskPriority.High);

        // Verify Location header
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateTask_WithEmptyTitle_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "",
            Description: "Test",
            Priority: TaskPriority.Medium,
            DueDate: null,
            UserId: 1,
            CategoryId: null
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateTask_WithPastDueDate_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new CreateTaskRequest(
            Title: "Test Task",
            Description: "Test",
            Priority: TaskPriority.Medium,
            DueDate: DateTime.UtcNow.AddDays(-1),
            UserId: 1,
            CategoryId: null
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateTask_WithValidData_ShouldReturnOk()
    {
        // Arrange
        var updateRequest = new UpdateTaskRequest(
            Title: "Updated Integration Task",
            Description: "Updated description",
            Status: null,
            Priority: TaskPriority.Critical,
            DueDate: null,
            CategoryId: null
        );

        // Act
        var response = await _client.PutAsJsonAsync("/api/tasks/1", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var task = await response.Content.ReadFromJsonAsync<TaskResponse>();
        task.Should().NotBeNull();
        task!.Title.Should().Be("Updated Integration Task");
        task.Priority.Should().Be(TaskPriority.Critical);
    }

    [Fact]
    public async Task UpdateTask_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var updateRequest = new UpdateTaskRequest(
            Title: "Updated Task",
            Description: null,
            Status: null,
            Priority: null,
            DueDate: null,
            CategoryId: null
        );

        // Act
        var response = await _client.PutAsJsonAsync("/api/tasks/999", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTask_WithValidId_ShouldReturnNoContent()
    {
        // Arrange - Create a task to delete
        var createRequest = new CreateTaskRequest(
            Title: "Task to Delete",
            Description: "Will be deleted",
            Priority: TaskPriority.Low,
            DueDate: null,
            UserId: 1,
            CategoryId: null
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createRequest);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskResponse>();

        // Act
        var response = await _client.DeleteAsync($"/api/tasks/{createdTask!.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify task is deleted
        var getResponse = await _client.GetAsync($"/api/tasks/{createdTask.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTask_WithInvalidId_ShouldReturnNotFound()
    {
        // Act
        var response = await _client.DeleteAsync("/api/tasks/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTaskStatus_WithValidTransition_ShouldReturnOk()
    {
        // Arrange - Create a new task in Todo status
        var createRequest = new CreateTaskRequest(
            Title: "Task for Status Test",
            Description: "Test status transitions",
            Priority: TaskPriority.Medium,
            DueDate: null,
            UserId: 1,
            CategoryId: null
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createRequest);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskResponse>();

        // Act - Transition to InProgress
        var response = await _client.PatchAsJsonAsync(
            $"/api/tasks/{createdTask!.Id}/status",
            TaskStatus.InProgress);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedTask = await response.Content.ReadFromJsonAsync<TaskResponse>();
        updatedTask.Should().NotBeNull();
        updatedTask!.Status.Should().Be(TaskStatus.InProgress);
    }

    [Fact]
    public async Task UpdateTaskStatus_WithInvalidTransition_ShouldReturnBadRequest()
    {
        // Arrange - Create a task in Todo status
        var createRequest = new CreateTaskRequest(
            Title: "Task for Invalid Transition",
            Description: "Test",
            Priority: TaskPriority.Medium,
            DueDate: null,
            UserId: 1,
            CategoryId: null
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createRequest);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskResponse>();

        // Act - Try invalid transition from Todo to Done
        var response = await _client.PatchAsJsonAsync(
            $"/api/tasks/{createdTask!.Id}/status",
            TaskStatus.Done);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetStatistics_WithValidUserId_ShouldReturnStatistics()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks/statistics/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var stats = await response.Content.ReadFromJsonAsync<TaskStatistics>();
        stats.Should().NotBeNull();
        stats!.TotalTasks.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetOverdueTasks_ShouldReturnOnlyOverdueTasks()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks/overdue");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskResponse>>();
        tasks.Should().NotBeNull();
        // All returned tasks should have due dates in the past and not be done
        tasks!.Should().OnlyContain(t =>
            t.DueDate.HasValue &&
            t.DueDate.Value.Date < DateTime.UtcNow.Date &&
            t.Status != TaskStatus.Done);
    }

    [Fact]
    public async Task CompleteWorkflow_CreateUpdateStatusDelete_ShouldWork()
    {
        // Step 1: Create a task
        var createRequest = new CreateTaskRequest(
            Title: "Workflow Test Task",
            Description: "Testing complete workflow",
            Priority: TaskPriority.High,
            DueDate: DateTime.UtcNow.AddDays(7),
            UserId: 1,
            CategoryId: 1
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var task = await createResponse.Content.ReadFromJsonAsync<TaskResponse>();
        var taskId = task!.Id;

        // Step 2: Update to InProgress
        var statusResponse = await _client.PatchAsJsonAsync(
            $"/api/tasks/{taskId}/status",
            TaskStatus.InProgress);
        statusResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        // Step 3: Update to Done
        statusResponse = await _client.PatchAsJsonAsync(
            $"/api/tasks/{taskId}/status",
            TaskStatus.Done);
        statusResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var doneTask = await statusResponse.Content.ReadFromJsonAsync<TaskResponse>();
        doneTask!.CompletedAt.Should().NotBeNull();

        // Step 4: Delete the task
        var deleteResponse = await _client.DeleteAsync($"/api/tasks/{taskId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Step 5: Verify deletion
        var getResponse = await _client.GetAsync($"/api/tasks/{taskId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
