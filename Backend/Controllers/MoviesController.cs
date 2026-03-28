using CinePass_be.DTOs.Movie;
using CinePass_be.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CinePass_be.Controllers;

/// <summary>
/// Movies API endpoints - MVP version
/// Core endpoints for social media review platform
/// </summary>
[ApiController]
[Route("api/movies")]
public class MoviesController(IMovieRepository movieRepo) : ControllerBase
{
    /// <summary>
    /// Get paginated list of movies with optional search
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMovies(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await movieRepo.GetMoviesPagedAsync(search, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Get top trending movies (by rating and review count)
    /// </summary>
    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] int count = 10)
    {
        var items = await movieRepo.GetTrendingMoviesAsync(count);
        return Ok(items);
    }

    /// <summary>
    /// Get movie details by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var movie = await movieRepo.GetMovieDetailAsync(id);

        if (movie is null)
            return NotFound(new { message = "Không tìm thấy phim." });

        return Ok(movie);
    }

    /// <summary>
    /// Search movies by title or local title
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(new { message = "Vui lòng nhập từ khóa tìm kiếm." });

        var result = await movieRepo.GetMoviesPagedAsync(q, page, pageSize);
        return Ok(result);
    }
}
