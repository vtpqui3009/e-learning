using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly ILogger<TasksController> _logger;

    public TasksController(ITaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    /// <summary>
    /// Get all tasks with optional filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetTasks(
        [FromQuery] int? userId = null,
        [FromQuery] TaskStatus? status = null)
    {
        try
        {
            var tasks = await _taskService.GetAllTasksAsync(userId, status);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks");
            return StatusCode(500, "An error occurred while retrieving tasks");
        }
    }

    /// <summary>
    /// Get a specific task by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskResponse>> GetTask(int id)
    {
        try
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound($"Task with ID {id} not found");

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task {TaskId}", id);
            return StatusCode(500, "An error occurred while retrieving the task");
        }
    }

    /// <summary>
    /// Create a new task
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateTask([FromBody] CreateTaskRequest request)
    {
        try
        {
            var task = await _taskService.CreateTaskAsync(request);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, "An error occurred while creating the task");
        }
    }

    /// <summary>
    /// Update an existing task
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TaskResponse>> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        try
        {
            var task = await _taskService.UpdateTaskAsync(id, request);
            if (task == null)
                return NotFound($"Task with ID {id} not found");

            return Ok(task);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {TaskId}", id);
            return StatusCode(500, "An error occurred while updating the task");
        }
    }

    /// <summary>
    /// Delete a task
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        try
        {
            var result = await _taskService.DeleteTaskAsync(id);
            if (!result)
                return NotFound($"Task with ID {id} not found");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {TaskId}", id);
            return StatusCode(500, "An error occurred while deleting the task");
        }
    }

    /// <summary>
    /// Update task status
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<TaskResponse>> UpdateTaskStatus(int id, [FromBody] TaskStatus newStatus)
    {
        try
        {
            var task = await _taskService.UpdateTaskStatusAsync(id, newStatus);
            if (task == null)
                return NotFound($"Task with ID {id} not found");

            return Ok(task);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task status {TaskId}", id);
            return StatusCode(500, "An error occurred while updating the task status");
        }
    }

    /// <summary>
    /// Get task statistics for a user
    /// </summary>
    [HttpGet("statistics/{userId}")]
    public async Task<ActionResult<TaskStatistics>> GetStatistics(int userId)
    {
        try
        {
            var stats = await _taskService.GetTaskStatisticsAsync(userId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving statistics for user {UserId}", userId);
            return StatusCode(500, "An error occurred while retrieving statistics");
        }
    }

    /// <summary>
    /// Get overdue tasks
    /// </summary>
    [HttpGet("overdue")]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetOverdueTasks([FromQuery] int? userId = null)
    {
        try
        {
            var tasks = await _taskService.GetOverdueTasksAsync(userId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving overdue tasks");
            return StatusCode(500, "An error occurred while retrieving overdue tasks");
        }
    }
}
