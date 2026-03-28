using System.Text.Json;
using CinePass_be.Data;
using CinePass_be.DTOs.Movie;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Controllers;

/// <summary>
/// Genres API endpoints - MVP simplified version
/// For MVP, genres are stored as JSON in Movie.GenresJson
/// This controller provides read-only access to all genres used in the database
/// </summary>
[ApiController]
[Route("api/genres")]
public class GenresController(AppDbContext db) : ControllerBase
{
    /// <summary>
    /// Get all genres used across all movies (parsed from JSON)
    /// Returns a deduplicated list of genre names
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var movies = await db.Movies
            .Where(m => m.GenresJson != null && m.GenresJson != "[]")
            .Select(m => m.GenresJson)
            .ToListAsync();

        var genreSet = new HashSet<string>();

        foreach (var genresJson in movies)
        {
            if (string.IsNullOrEmpty(genresJson)) continue;

            try
            {
                var genres = JsonSerializer.Deserialize<List<string>>(genresJson) ?? [];
                foreach (var genre in genres)
                {
                    genreSet.Add(genre);
                }
            }
            catch
            {
                // Ignore parse errors
            }
        }

        var result = genreSet
            .OrderBy(g => g)
            .ToList();

        return Ok(result);
    }
}
