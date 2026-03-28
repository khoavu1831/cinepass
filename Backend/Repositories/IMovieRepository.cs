using CinePass_be.DTOs.Movie;
using CinePass_be.Models;

namespace CinePass_be.Repositories;

/// <summary>
/// Movie Repository interface - MVP version
/// Core queries for social media movie review platform
/// Genres stored as JSON, no status filtering needed
/// </summary>
public interface IMovieRepository : IRepository<Movie>
{
    /// <summary>
    /// Get paginated list of movies with optional search
    /// </summary>
    Task<PagedResult<MovieListItemDto>> GetMoviesPagedAsync(
        string? search = null,
        int page = 1,
        int pageSize = 20);
    
    /// <summary>
    /// Get complete movie details including reviews
    /// </summary>
    Task<MovieDetailDto?> GetMovieDetailAsync(Guid id);
    
    /// <summary>
    /// Get trending movies (by rating and review count)
    /// </summary>
    Task<List<MovieListItemDto>> GetTrendingMoviesAsync(int count = 10);
}
