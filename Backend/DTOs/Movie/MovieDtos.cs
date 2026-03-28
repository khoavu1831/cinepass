using System.Text.Json;

namespace CinePass_be.DTOs.Movie;

/// <summary>
/// Genre DTO - for future use if genre endpoints are added
/// </summary>
public class GenreDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
}

/// <summary>
/// MovieListItemDto - Used in list/search endpoints
/// Genres stored as JSON in database, parsed to List<string> here
/// </summary>
public class MovieListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? LocalTitle { get; set; }
    public string? PosterUrl { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public decimal RatingAvg { get; set; }
    public int Duration { get; set; }
    public int ReviewCount { get; set; }
    
    // Genres stored as JSON in database, converted to list here
    public string? GenresJson { get; set; }
    public List<string> Genres
    {
        get
        {
            if (string.IsNullOrEmpty(GenresJson))
                return [];

            try
            {
                return JsonSerializer.Deserialize<List<string>>(GenresJson) ?? [];
            }
            catch
            {
                return [];
            }
        }
    }
}

/// <summary>
/// MovieDetailDto - Extended movie details for detail page
/// </summary>
public class MovieDetailDto : MovieListItemDto
{
    public string? Description { get; set; }
    public string? TrailerUrl { get; set; }
    public string? Language { get; set; }
    public string? Director { get; set; }
    public string? Cast { get; set; }
}

/// <summary>
/// Generic pagination result wrapper
/// </summary>
public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
