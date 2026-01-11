using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetAllTasksAsync(int? userId = null, TaskStatus? status = null);
    Task<TaskResponse?> GetTaskByIdAsync(int id);
    Task<TaskResponse> CreateTaskAsync(CreateTaskRequest request);
    Task<TaskResponse?> UpdateTaskAsync(int id, UpdateTaskRequest request);
    Task<bool> DeleteTaskAsync(int id);
    Task<TaskResponse?> UpdateTaskStatusAsync(int id, TaskStatus newStatus);
    Task<TaskStatistics> GetTaskStatisticsAsync(int userId);
    Task<IEnumerable<TaskResponse>> GetOverdueTasksAsync(int? userId = null);
}
