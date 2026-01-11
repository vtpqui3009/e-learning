namespace TaskManagerAPI.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ColorCode { get; set; } = "#3b82f6";

    // Relationships
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
