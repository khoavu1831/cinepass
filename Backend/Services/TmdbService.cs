using System.Text.Json;
using CinePass_be.Data;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Services;

/// <summary>
/// TmdbService - Fetch movie data from TMDB API and seed database
/// For MVP: Stores genres as JSON instead of separate Genre/MovieGenre tables
/// </summary>
public class TmdbService(HttpClient http, IConfiguration config, AppDbContext db)
{
    private readonly string _token = config["Tmdb:Token"]!;
    private readonly string _baseUrl = config["Tmdb:BaseUrl"] ?? "https://api.themoviedb.org/3/";
    private readonly string _imageBase = "https://image.tmdb.org/t/p/w500";

    private HttpRequestMessage BuildRequest(string path)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, _baseUrl + path);
        req.Headers.Add("Authorization", $"Bearer {_token}");
        req.Headers.Add("Accept", "application/json");
        return req;
    }

    /// <summary>
    /// Seed movies from TMDB popular movies API
    /// Stores genre IDs as JSON array in Movie.GenresJson
    /// </summary>
    public async Task<int> SeedMoviesAsync(int count = 20)
    {
        var seeded = 0;
        var page = 1;

        while (seeded < count)
        {
            var res = await http.SendAsync(BuildRequest($"movie/popular?language=vi-VN&page={page}"));
            if (!res.IsSuccessStatusCode) break;

            var json = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            var results = json.RootElement.GetProperty("results");

            foreach (var item in results.EnumerateArray())
            {
                if (seeded >= count) break;

                var tmdbId = item.GetProperty("id").GetInt32();

                // Skip if already exists
                if (await db.Movies.AnyAsync(m => m.TmdbId == tmdbId))
                    continue;

                // Parse release date
                var releaseStr = item.TryGetProperty("release_date", out var rd) ? rd.GetString() : null;
                DateOnly? releaseDate = DateOnly.TryParse(releaseStr, out var d) ? d : null;

                // Extract and serialize genres as JSON
                string genresJson = "[]";
                if (item.TryGetProperty("genre_ids", out var genreIds))
                {
                    var genres = genreIds.EnumerateArray()
                        .Select(g => g.GetInt32().ToString())
                        .ToList();
                    genresJson = JsonSerializer.Serialize(genres);
                }

                // Create movie entity
                var movie = new Movie
                {
                    TmdbId = tmdbId,
                    Title = item.GetProperty("title").GetString() ?? "",
                    LocalTitle = item.TryGetProperty("title", out var t) ? t.GetString() : null,
                    Description = item.TryGetProperty("overview", out var ov) ? ov.GetString() : null,
                    Duration = 120,
                    ReleaseDate = releaseDate,
                    PosterUrl = item.TryGetProperty("poster_path", out var pp) && pp.GetString() != null
                        ? _imageBase + pp.GetString()
                        : null,
                    Language = item.TryGetProperty("original_language", out var lang) ? lang.GetString() : null,
                    GenresJson = genresJson,
                    RatingAvg = item.TryGetProperty("vote_average", out var va)
                        ? Math.Round((decimal)va.GetDouble() / 2, 1)  // Convert from 0-10 TMDB scale to 0-5
                        : 0
                };

                db.Movies.Add(movie);
                await db.SaveChangesAsync();
                seeded++;
            }

            page++;
            if (!json.RootElement.TryGetProperty("total_pages", out var tp) || page > tp.GetInt32())
                break;
        }

        return seeded;
    }
}
