# MVP Migration: Cleanup Checklist

**Trạng thái:** In Progress  
**Hoàn thành:** Models + AppDbContext configuration  
**Còn lại:** Controllers, Services, DTOs, Database Migration

---

## ✅ Completed

- [x] User.cs - Updated with stats caching
- [x] Movie.cs - Removed MovieStatus enum, added GenresJson
- [x] Review.cs - Added Title, IsEdited, HasSpoiler
- [x] Comment.cs - Removed nested comments (ParentId)
- [x] Like.cs - Added Id field
- [x] Follow.cs - Added Id field, updated relationships
- [x] ReviewEmbedding.cs - Created new model
- [x] AppDbContext.cs - Configured 7 core models with proper indexes and relationships

---

## 🔄 In Progress / TODO

### Files to Update:

#### 1. **Remove Old Models (Infrastructure)**
   - [x] Models: Booking, BookingSeat, Cinema, Room, Seat, Showtime, Notification, Genre, MovieGenre
   - [ ] Update Program.cs if any service registrations reference deleted models
   - [ ] Check Migrations folder for references

#### 2. **Services**
   - [ ] **TmdbService.cs** - MAJOR REFACTOR
     - Remove MovieStatus logic (COMING_SOON vs NOW_SHOWING)
     - Remove SeedGenresAsync() method
     - Change how genres are stored: `Movie.GenresJson = JsonSerializer.Serialize(genres)` instead of creating MovieGenre rows
     - Update to handle genre_ids from TMDB API and store as JSON array
     
   - [ ] JwtService.cs - Check if it references any deleted models
   - [ ] AuthService.cs - Check if it references any deleted models

#### 3. **Repositories**
   - [ ] **MovieRepository.cs** - MAJOR CLEANUP
     - Remove `GetMoviesByGenreAsync()` method
     - Remove `GetMovieWithGenresAsync()` method
     - Simplify `GetMoviesPagedAsync()` to remove genreId parameter
     - Remove MovieGenres includes in LINQ queries
     - Update mapping to parse GenresJson instead
     
   - [ ] IMovieRepository.cs - Update interface signatures
   - [ ] Repository.cs - Check generic implementation
   - [ ] UserRepository.cs - Should be fine, no booking/genre refs

#### 4. **Controllers**
   - [ ] **GenresController.cs** - DELETE or stubs for future use
     - Option A: Delete completely (genres handled via GenresJson)
     - Option B: Create simple endpoint that parses all GenresJson from movies
     
   - [ ] **MoviesController.cs** - REFACTOR
     - Remove `genreId` parameter from GetMovies()
     - Remove `status` filtering (all movies treated equally)
     - Keep: pagination, search, trending
     - Simplify: Remove "coming-soon" endpoint (status no longer exists)
     - Keep: basic CRUD for movies
     
   - [ ] MoviesController.cs - Will need review/comment endpoints added (separate PR)
   - [ ] AuthController.cs - Verify no booking references
   - [ ] SeedController.cs - Should work fine after TmdbService update

#### 5. **DTOs (Data Transfer Objects)**
   - [ ] **MovieDtos.cs** - UPDATE
     - Remove or change `Genres: List<GenreDto>` in MovieListItemDto
     - Option A: Add `GenresJson: string` field
     - Option B: Add `Genres: List<string>` field (parsed from GenresJson)
     - Update MovieDetailDto accordingly
     
   - [ ] GenreDto - Keep for now (flexible for future)
   - [ ] Movie/*/*.cs DTOs - Check for references

#### 6. **Database**
   - [ ] Create new migration: `dotnet ef migrations add MigrateToMvpModels`
     - This will drop old tables (Booking, Cinema, etc.)
     - Create new ReviewEmbedding table
     - Update Movie table structure
     
   - [ ] Update database: `dotnet ef database update`
   - [ ] Seed initial movies via Updated TmdbService

#### 7. **Program.cs & Configuration**
   - [ ] Check dependency injection registration
   - [ ] Remove any service registrations for deleted models
   - [ ] Ensure AppDbContext is still properly registered

#### 8. **Testing**
   - [ ] Compile project - check for any lingering references
   - [ ] Unit tests (if any) - update for new models
   - [ ] API test endpoints to ensure they work

---

## 🔗 Dependency Graph

```
AppDbContext (DONE)
  ├─ User model (DONE)
  ├─ Movie model (DONE)
  ├─ Review model (DONE)
  ├─ ReviewEmbedding model (DONE)
  └─ Others (DONE)

TmdbService.cs 🔴
  ├─ Uses MovieStatus (REMOVE)
  ├─ Uses SeedGenresAsync (REMOVE)
  └─ Uses MovieGenre.Add() (REFACTOR to JSON)

MovieRepository.cs 🔴
  ├─ Uses MovieGenres Include (REMOVE)
  ├─ Uses genreId filtering (REMOVE)
  └─ Uses GetMoviesByGenreAsync (REMOVE)

MoviesController.cs 🔴
  ├─ Uses genreId query param (REMOVE)
  ├─ Uses status filtering (REMOVE)
  └─ Uses coming-soon endpoint (REMOVE)

GenresController.cs 🔴
  └─ DELETE (genres now in JSON)

DTOs 🟡
  ├─ Update MovieListItemDto.Genres
  └─ Update MovieDetailDto
```

---

## 📋 File-by-File Tasks

### Priority 1 (Critical)
1. **TmdbService.cs** - TmdbService thực hiện seeding, nếu không fix sẽ crash
2. **MovieRepository.cs** - Được used by MoviesController
3. **IMovieRepository.cs** - Update interface

### Priority 2 (Important)  
4. **MovieDtos.cs** - DTOs used by controllers
5. **MoviesController.cs** - Main API endpoint
6. **GenresController.cs** - Remove/stub

### Priority 3 (Cleanup)
7. Program.cs - Remove old registrations
8. Database migration - `dotnet ef migrations add`
9. Test compilation

---

## 🛠️ Code Snippets for Changes

### TmdbService - GenresJson Approach
```csharp
// Old:
db.MovieGenres.Add(new MovieGenre { MovieId = movie.Id, GenreId = genreId });

// New:
var genres = item.GetProperty("genre_ids").EnumerateArray()
    .Select(g => g.GetInt32().ToString())
    .ToList();
movie.GenresJson = JsonSerializer.Serialize(genres);
```

### MovieRepository - Remove Genre Logic
```csharp
// OLD:
var result = await movieRepo.GetMoviesPagedAsync(status, genreId, search, page, pageSize);

// NEW:
var result = await movieRepo.GetMoviesPagedAsync(search, page, pageSize);
```

### Movie DTO - Parse Genres
```csharp
public List<string> Genres => 
    string.IsNullOrEmpty(GenresJson) 
        ? [] 
        : JsonSerializer.Deserialize<List<string>>(GenresJson) ?? [];
```

---

## Recommended Order of Changes

1. ✅ Models & AppDbContext (DONE)
2. 🔄 TmdbService.cs - Fix seeding to use GenresJson
3. 🔄 MovieRepository.cs - Remove genre methods
4. 🔄 MoviesController.cs - Simplify parameters
5. 🔄 DTOs - Update Genres field
6. 🔄 GenresController.cs - Remove or stub
7. 🔄 Program.cs - Cleanup registrations
8. 🔄 EF Migration - `dotnet ef migrations add`
9. ✅ Database update
10. ✅ Test compilation

---

Note: After these changes, the project should compile and run with MVP models only.
Booking, Cinema, Seat, Showtime capabilities are completely removed.
