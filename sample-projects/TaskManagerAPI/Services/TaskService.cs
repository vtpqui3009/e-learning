using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services;

public class TaskService : ITaskService
{
    private readonly TaskManagerContext _context;

    public TaskService(TaskManagerContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskResponse>> GetAllTasksAsync(int? userId = null, TaskStatus? status = null)
    {
        var query = _context.Tasks
            .Include(t => t.User)
            .Include(t => t.Category)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(t => t.UserId == userId.Value);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        var tasks = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return tasks.Select(MapToResponse);
    }

    public async Task<TaskResponse?> GetTaskByIdAsync(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.User)
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);

        return task == null ? null : MapToResponse(task);
    }

    public async Task<TaskResponse> CreateTaskAsync(CreateTaskRequest request)
    {
        // Validation: Title is required
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("Task title is required");

        // Validation: Title length
        if (request.Title.Length > 200)
            throw new ArgumentException("Task title cannot exceed 200 characters");

        // Validation: User must exist
        var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
        if (!userExists)
            throw new ArgumentException($"User with ID {request.UserId} not found");

        // Validation: Category must exist if provided
        if (request.CategoryId.HasValue)
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId.Value);
            if (!categoryExists)
                throw new ArgumentException($"Category with ID {request.CategoryId} not found");
        }

        // Validation: Due date cannot be in the past
        if (request.DueDate.HasValue && request.DueDate.Value < DateTime.UtcNow.Date)
            throw new ArgumentException("Due date cannot be in the past");

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            UserId = request.UserId,
            CategoryId = request.CategoryId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return (await GetTaskByIdAsync(task.Id))!;
    }

    public async Task<TaskResponse?> UpdateTaskAsync(int id, UpdateTaskRequest request)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return null;

        // Update only provided fields
        if (request.Title != null)
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                throw new ArgumentException("Task title cannot be empty");
            if (request.Title.Length > 200)
                throw new ArgumentException("Task title cannot exceed 200 characters");
            task.Title = request.Title;
        }

        if (request.Description != null)
            task.Description = request.Description;

        if (request.Status.HasValue)
        {
            // Validate status transition
            ValidateStatusTransition(task.Status, request.Status.Value);
            task.Status = request.Status.Value;

            // Set completed date if transitioning to Done
            if (request.Status.Value == TaskStatus.Done && task.CompletedAt == null)
                task.CompletedAt = DateTime.UtcNow;
        }

        if (request.Priority.HasValue)
            task.Priority = request.Priority.Value;

        if (request.DueDate.HasValue && request.DueDate.Value < DateTime.UtcNow.Date)
            throw new ArgumentException("Due date cannot be in the past");

        if (request.DueDate != null)
            task.DueDate = request.DueDate;

        if (request.CategoryId != null)
        {
            if (request.CategoryId.HasValue)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId.Value);
                if (!categoryExists)
                    throw new ArgumentException($"Category with ID {request.CategoryId} not found");
            }
            task.CategoryId = request.CategoryId;
        }

        await _context.SaveChangesAsync();
        return await GetTaskByIdAsync(id);
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TaskResponse?> UpdateTaskStatusAsync(int id, TaskStatus newStatus)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return null;

        ValidateStatusTransition(task.Status, newStatus);

        task.Status = newStatus;

        if (newStatus == TaskStatus.Done && task.CompletedAt == null)
            task.CompletedAt = DateTime.UtcNow;
        else if (newStatus != TaskStatus.Done)
            task.CompletedAt = null;

        await _context.SaveChangesAsync();
        return await GetTaskByIdAsync(id);
    }

    public async Task<TaskStatistics> GetTaskStatisticsAsync(int userId)
    {
        var tasks = await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        var now = DateTime.UtcNow.Date;

        return new TaskStatistics(
            TotalTasks: tasks.Count,
            TodoTasks: tasks.Count(t => t.Status == TaskStatus.Todo),
            InProgressTasks: tasks.Count(t => t.Status == TaskStatus.InProgress),
            CompletedTasks: tasks.Count(t => t.Status == TaskStatus.Done),
            OverdueTasks: tasks.Count(t => t.DueDate.HasValue && t.DueDate.Value.Date < now && t.Status != TaskStatus.Done)
        );
    }

    public async Task<IEnumerable<TaskResponse>> GetOverdueTasksAsync(int? userId = null)
    {
        var query = _context.Tasks
            .Include(t => t.User)
            .Include(t => t.Category)
            .Where(t => t.DueDate.HasValue && t.DueDate.Value.Date < DateTime.UtcNow.Date && t.Status != TaskStatus.Done);

        if (userId.HasValue)
            query = query.Where(t => t.UserId == userId.Value);

        var tasks = await query.OrderBy(t => t.DueDate).ToListAsync();
        return tasks.Select(MapToResponse);
    }

    private static void ValidateStatusTransition(TaskStatus currentStatus, TaskStatus newStatus)
    {
        // Define allowed transitions
        var allowedTransitions = new Dictionary<TaskStatus, List<TaskStatus>>
        {
            { TaskStatus.Todo, new List<TaskStatus> { TaskStatus.InProgress, TaskStatus.Cancelled } },
            { TaskStatus.InProgress, new List<TaskStatus> { TaskStatus.Done, TaskStatus.Todo, TaskStatus.Cancelled } },
            { TaskStatus.Done, new List<TaskStatus> { TaskStatus.InProgress } },
            { TaskStatus.Cancelled, new List<TaskStatus> { TaskStatus.Todo } }
        };

        if (currentStatus == newStatus)
            return; // No transition needed

        if (!allowedTransitions.ContainsKey(currentStatus) || !allowedTransitions[currentStatus].Contains(newStatus))
            throw new InvalidOperationException($"Cannot transition from {currentStatus} to {newStatus}");
    }

    private static TaskResponse MapToResponse(TaskItem task)
    {
        return new TaskResponse(
            Id: task.Id,
            Title: task.Title,
            Description: task.Description,
            Status: task.Status,
            Priority: task.Priority,
            CreatedAt: task.CreatedAt,
            DueDate: task.DueDate,
            CompletedAt: task.CompletedAt,
            UserId: task.UserId,
            UserName: task.User?.FullName ?? "Unknown",
            CategoryId: task.CategoryId,
            CategoryName: task.Category?.Name
        );
    }
}
