using CinePass_be.Data;
using CinePass_be.DTOs.Movie;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Repositories;

/// <summary>
/// Movie Repository implementation - MVP version
/// Simplified queries for social media review platform
/// Genres stored as JSON in Movie.GenresJson
/// </summary>
public class MovieRepository : Repository<Movie>, IMovieRepository
{
    public MovieRepository(AppDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Get paginated list of all movies with optional search
    /// </summary>
    public async Task<PagedResult<MovieListItemDto>> GetMoviesPagedAsync(
        string? search = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _dbSet.AsQueryable();

        // Filter by search query (title or local title)
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(m => 
                m.Title.ToLower().Contains(searchLower) || 
                (m.LocalTitle != null && m.LocalTitle.ToLower().Contains(searchLower)));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new MovieListItemDto
            {
                Id = m.Id,
                Title = m.Title,
                LocalTitle = m.LocalTitle,
                PosterUrl = m.PosterUrl,
                ReleaseDate = m.ReleaseDate,
                RatingAvg = m.RatingAvg,
                Duration = m.Duration ?? 0,
                ReviewCount = m.ReviewCount,
                GenresJson = m.GenresJson
            })
            .ToListAsync();

        return new PagedResult<MovieListItemDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    /// <summary>
    /// Get complete movie details by ID
    /// </summary>
    public async Task<MovieDetailDto?> GetMovieDetailAsync(Guid id)
    {
        return await _dbSet
            .Where(m => m.Id == id)
            .Select(m => new MovieDetailDto
            {
                Id = m.Id,
                Title = m.Title,
                LocalTitle = m.LocalTitle,
                PosterUrl = m.PosterUrl,
                ReleaseDate = m.ReleaseDate,
                RatingAvg = m.RatingAvg,
                Duration = m.Duration ?? 0,
                ReviewCount = m.ReviewCount,
                GenresJson = m.GenresJson,
                Description = m.Description,
                TrailerUrl = m.TrailerUrl,
                Language = m.Language,
                Director = m.Director,
                Cast = m.Cast
            })
            .FirstOrDefaultAsync();
    }

    /// <summary>
    /// Get trending movies ordered by rating and review count
    /// </summary>
    public async Task<List<MovieListItemDto>> GetTrendingMoviesAsync(int count = 10)
    {
        return await _dbSet
            .OrderByDescending(m => m.RatingAvg)
            .ThenByDescending(m => m.ReviewCount)
            .Take(count)
            .Select(m => new MovieListItemDto
            {
                Id = m.Id,
                Title = m.Title,
                LocalTitle = m.LocalTitle,
                PosterUrl = m.PosterUrl,
                ReleaseDate = m.ReleaseDate,
                RatingAvg = m.RatingAvg,
                Duration = m.Duration ?? 0,
                ReviewCount = m.ReviewCount,
                GenresJson = m.GenresJson
            })
            .ToListAsync();
    }
}
