namespace CinePass_be.Models;

/// <summary>
/// Like model - Social signal for reviews
/// One like per user per review
/// </summary>
public class Like
{
    // Identity
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid ReviewId { get; set; }

    // Navigation Properties
    public User User { get; set; } = null!;
    public Review Review { get; set; } = null!;

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
