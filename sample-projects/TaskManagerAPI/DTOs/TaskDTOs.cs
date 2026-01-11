using TaskManagerAPI.Models;

namespace TaskManagerAPI.DTOs;

public record CreateTaskRequest(
    string Title,
    string? Description,
    TaskPriority Priority,
    DateTime? DueDate,
    int UserId,
    int? CategoryId
);

public record UpdateTaskRequest(
    string? Title,
    string? Description,
    TaskStatus? Status,
    TaskPriority? Priority,
    DateTime? DueDate,
    int? CategoryId
);

public record TaskResponse(
    int Id,
    string Title,
    string? Description,
    TaskStatus Status,
    TaskPriority Priority,
    DateTime CreatedAt,
    DateTime? DueDate,
    DateTime? CompletedAt,
    int UserId,
    string UserName,
    int? CategoryId,
    string? CategoryName
);

public record TaskStatistics(
    int TotalTasks,
    int TodoTasks,
    int InProgressTasks,
    int CompletedTasks,
    int OverdueTasks
);
