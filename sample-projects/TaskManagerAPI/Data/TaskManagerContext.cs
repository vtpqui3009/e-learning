using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data;

public class TaskManagerContext : DbContext
{
    public TaskManagerContext(DbContextOptions<TaskManagerContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Tasks)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Username = "john.doe", Email = "john@example.com", FullName = "John Doe" },
            new User { Id = 2, Username = "jane.smith", Email = "jane@example.com", FullName = "Jane Smith" }
        );

        // Seed Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Work", Description = "Work-related tasks", ColorCode = "#3b82f6" },
            new Category { Id = 2, Name = "Personal", Description = "Personal tasks", ColorCode = "#10b981" },
            new Category { Id = 3, Name = "Shopping", Description = "Shopping list", ColorCode = "#f59e0b" }
        );

        // Seed Tasks
        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem
            {
                Id = 1,
                Title = "Complete project documentation",
                Description = "Write comprehensive documentation for the API",
                Status = TaskStatus.InProgress,
                Priority = TaskPriority.High,
                UserId = 1,
                CategoryId = 1,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                DueDate = DateTime.UtcNow.AddDays(2)
            },
            new TaskItem
            {
                Id = 2,
                Title = "Buy groceries",
                Description = "Milk, bread, eggs",
                Status = TaskStatus.Todo,
                Priority = TaskPriority.Medium,
                UserId = 1,
                CategoryId = 3,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                DueDate = DateTime.UtcNow.AddDays(1)
            },
            new TaskItem
            {
                Id = 3,
                Title = "Review pull requests",
                Status = TaskStatus.Done,
                Priority = TaskPriority.High,
                UserId = 2,
                CategoryId = 1,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                DueDate = DateTime.UtcNow.AddDays(-1),
                CompletedAt = DateTime.UtcNow.AddDays(-1)
            }
        );
    }
}
