namespace CinePass_be.Models;

/// <summary>
/// Follow model - Social graph for following users
/// One follow per follower/following pair
/// </summary>
public class Follow
{
    // Identity
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FollowerId { get; set; }        // User who follows
    public Guid FollowingId { get; set; }       // User being followed

    // Navigation Properties
    public User Follower { get; set; } = null!;
    public User Following { get; set; } = null!;

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
