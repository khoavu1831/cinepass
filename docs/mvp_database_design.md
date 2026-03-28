# CinePass MVP: Core Database Design + AI Integration

**Phiên bản:** 1.0  
**Mục đích:** Thiết kế database tối giản nhưng có khả năng scale, với tích hợp AI semantic search

---

## ⚡ Tổng Quan

### Bộ Core Models (7 Tables)
```
┌─────────────────────────────────────────────┐
│           CinePass MVP Models               │
├─────────────────────────────────────────────┤
│ 1. User (5 nghìn records/triệu users)       │
│ 2. Movie (50 nghìn từ TMDB)                 │
│ 3. Review ← Core content                    │
│ 4. Comment ← Discussions                    │
│ 5. Like ← Social signal                     │
│ 6. Follow ← Social graph                    │
│ 7. ReviewEmbedding ← AI vectors             │
└─────────────────────────────────────────────┘
```

### Loại Bỏ So Với Full Spec
- ❌ Notification (thêm Phase 2)
- ❌ Watchlist (có thể làm nhanh sau)
- ❌ Booking, Cinema, Room, Seat, Showtime (xóa hoàn toàn)
- ❌ Badge, Report, MutedUser (Phase 2+)

---

## 📊 Chi Tiết Từng Model

### 1️⃣ USER

**Mục đích:** Xác định danh tính người dùng  
**Ước lượng:** 5,000 - 100,000 records (tùy stage)

#### Cấu Trúc
```csharp
public class User
{
    // Identity
    public Guid Id { get; set; }
    public string Username { get; set; }           // @username
    public string Email { get; set; }              // Unique
    public string PasswordHash { get; set; }       // Bcrypt/Argon2
    
    // Profile
    public string? Bio { get; set; }               // Up to 500 chars
    public string? AvatarUrl { get; set; }         // CloudStorage URL
    
    // Stats (Cache, updated on action)
    public int FollowerCount { get; set; }        // For quick display
    public int FollowingCount { get; set; }
    public int ReviewCount { get; set; }
    
    // Navigation
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Follow> FollowingUsers { get; set; }    // Users I follow
    public ICollection<Follow> Followers { get; set; }         // Users following me
    
    // Metadata
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;
}
```

#### Indexes (SQLite/PostgreSQL)
```sql
CREATE UNIQUE INDEX idx_user_email ON User(Email);
CREATE UNIQUE INDEX idx_user_username ON User(Username);
CREATE INDEX idx_user_created_at ON User(CreatedAt DESC);
```

#### API Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/{id}           # Public profile
PUT    /api/users/me              # Edit own profile
GET    /api/users/me             # My profile
GET    /api/users/{id}/followers
GET    /api/users/{id}/following
```

---

### 2️⃣ MOVIE

**Mục đích:** Catalog phim (từ TMDB/local)  
**Ước lượng:** 50,000 - 200,000 records

#### Cấu Trúc
```csharp
public class Movie
{
    // Identity
    public Guid Id { get; set; }
    public int? TmdbId { get; set; }              // Reference to TMDB API
    
    // Content
    public string Title { get; set; }              // Tiếng Anh
    public string? LocalTitle { get; set; }        // Tiếng Việt (optional)
    public string? Description { get; set; }       // Plot (for AI embedding)
    public string? PosterUrl { get; set; }         // Poster image
    public string? BackdropUrl { get; set; }       // Background image
    public string? TrailerUrl { get; set; }        // YouTube/embed URL
    
    // Metadata
    public int? Duration { get; set; }             // Minutes
    public DateOnly? ReleaseDate { get; set; }     // YYYY-MM-DD
    public string? Language { get; set; }          // en, vi, etc
    public string? Director { get; set; }          // Optional, for AI search
    public string? Cast { get; set; }              // Comma-separated, JSON
    
    // Genres (can be stored as JSON array or separate table)
    public string? GenresJson { get; set; }        // ["Action", "Drama"] as JSON
    
    // Aggregated Stats
    public decimal RatingAvg { get; set; }         // 0.0-10.0, from reviews
    public int ReviewCount { get; set; }           // Count of reviews
    
    // Navigation
    public ICollection<Review> Reviews { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### Indexes
```sql
CREATE UNIQUE INDEX idx_movie_tmdb_id ON Movie(TmdbId);
CREATE INDEX idx_movie_release_date ON Movie(ReleaseDate DESC);
CREATE INDEX idx_movie_rating_avg ON Movie(RatingAvg DESC);
```

#### Data Population
```
Option 1: Import từ TMDB API (recommended)
  - Setup scheduled job: Sync popular movies weekly
  - Initial: Fetch top 10,000 movies
  
Option 2: Manual seed
  - File: /data/movies_seed.json
  - Import on startup: DbContext.Movies.AddRange(...)
```

#### API Endpoints
```
GET    /api/movies                     # List all (paginated)
GET    /api/movies/{id}                # Details
GET    /api/movies?search=query        # Search by title
GET    /api/movies/trending            # Top rated
GET    /api/movies/by-tmdb/{tmdbId}   # Get or create from TMDB
```

---

### 3️⃣ REVIEW ⭐ Core Content

**Mục đích:** User-generated review/rating cho từng movie  
**Ước lượng:** 100,000 - 10 triệu records

#### Cấu Trúc
```csharp
public class Review
{
    // Identity
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid MovieId { get; set; }
    
    // Content
    public string Title { get; set; }              // Review title
    public string Content { get; set; }            // Long-form review text
    public decimal Rating { get; set; }            // 1-10 score (or 1-5, 0.5 increments)
    public bool HasSpoiler { get; set; } = false;  // Warning flag
    
    // Engagement (denormalized, updated on action)
    public int LikeCount { get; set; } = 0;
    public int CommentCount { get; set; } = 0;
    
    // Editing
    public bool IsEdited { get; set; } = false;
    public DateTime? EditedAt { get; set; }
    
    // Navigation
    public User User { get; set; }
    public Movie Movie { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### Indexes
```sql
CREATE INDEX idx_review_movie_id ON Review(MovieId);
CREATE INDEX idx_review_user_id ON Review(UserId);
CREATE INDEX idx_review_created_at ON Review(CreatedAt DESC);
CREATE INDEX idx_review_rating ON Review(Rating DESC);
CREATE INDEX idx_review_like_count ON Review(LikeCount DESC);
CREATE UNIQUE INDEX idx_review_user_movie ON Review(UserId, MovieId); -- One review per user per movie
```

#### Constraints
- **One review per user per movie:** Prevent duplicates
- **Content length:** 10-5000 characters
- **Rating range:** Validate 1-10 or 1-5

#### API Endpoints
```
POST   /api/reviews                    # Create
GET    /api/reviews/{id}               # Read
PUT    /api/reviews/{id}               # Update (own only)
DELETE /api/reviews/{id}               # Delete (own only)
GET    /api/movies/{id}/reviews        # All reviews for movie
GET    /api/users/{id}/reviews         # All reviews by user
GET    /api/me/reviews                 # My reviews

# Sorting
GET    /api/reviews?sort=newest|helpful|rating
```

---

### 4️⃣ COMMENT

**Mục đích:** Discussion/feedback trên reviews  
**Ước lượng:** 500,000 - 50 triệu records

#### Cấu Trúc
```csharp
public class Comment
{
    // Identity
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ReviewId { get; set; }
    
    // Content
    public string Content { get; set; }            // Comment text (max 2000 chars)
    
    // Design decision: NO ParentId for MVP
    // - Nested comments add complexity
    // - Can add later in Phase 2
    
    // Navigation
    public User User { get; set; }
    public Review Review { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### Indexes
```sql
CREATE INDEX idx_comment_review_id ON Comment(ReviewId);
CREATE INDEX idx_comment_user_id ON Comment(UserId);
CREATE INDEX idx_comment_created_at ON Comment(CreatedAt DESC);
```

#### API Endpoints
```
POST   /api/comments                   # Create (ReviewId in body)
GET    /api/reviews/{reviewId}/comments  # Read all for review
PUT    /api/comments/{id}              # Update (own only)
DELETE /api/comments/{id}              # Delete (own only)
```

---

### 5️⃣ LIKE

**Mục đض:** Thumbs up signal cho reviews  
**Ước lượng:** 1-10 triệu records

#### Cấu Trúc
```csharp
public class Like
{
    // Identity
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ReviewId { get; set; }
    
    // Navigation
    public User User { get; set; }
    public Review Review { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; }
}
```

#### Constraints
- **Unique:** One like per user per review (prevent duplicate likes)

#### Indexes
```sql
CREATE UNIQUE INDEX idx_like_user_review ON Like(UserId, ReviewId);
CREATE INDEX idx_like_review_id ON Like(ReviewId);
```

#### API Endpoints
```
POST   /api/reviews/{id}/like          # Like a review
DELETE /api/reviews/{id}/like          # Unlike
GET    /api/reviews/{id}/likes         # Get all who liked (optional)
GET    /api/me/likes                   # My liked reviews
```

---

### 6️⃣ FOLLOW

**Mục đích:** Social graph - theo dõi người dùng  
**Ước lượng:** 10,000 - 1 triệu records

#### Cấu Trúc
```csharp
public class Follow
{
    // Identity
    public Guid Id { get; set; }
    public Guid FollowerId { get; set; }        // Người follow (theo dõi)
    public Guid FollowingId { get; set; }       // Người được follow (được theo dõi)
    
    // Navigation (self-referencing)
    public User Follower { get; set; }
    public User Following { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; }
}
```

#### Constraints
- **No self-follow:** `FollowerId != FollowingId`
- **Unique:** One follow relationship per pair

#### Indexes
```sql
CREATE UNIQUE INDEX idx_follow_pair ON Follow(FollowerId, FollowingId);
CREATE INDEX idx_follow_follower_id ON Follow(FollowerId);
CREATE INDEX idx_follow_following_id ON Follow(FollowingId);
```

#### API Endpoints
```
POST   /api/users/{id}/follow          # Follow
DELETE /api/users/{id}/follow          # Unfollow
GET    /api/users/{id}/followers       # Get followers
GET    /api/users/{id}/following       # Get following
GET    /api/me/feed                    # Personal feed (from following)
```

---

### 7️⃣ REVIEW_EMBEDDING 🤖 AI Vector Storage

**Mục đích:** Store embeddings cho AI semantic search  
**Ước lượng:** 100,000 - 10 triệu records (1 per review + movie)

#### Cấu Trúc
```csharp
public class ReviewEmbedding
{
    // Identity
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }
    public Guid MovieId { get; set; }
    
    // Embeddings (float arrays, 1536-dim for OpenAI)
    public float[] MovieDescriptionVector { get; set; }   // Movie description embedding
    public float[] ReviewContentVector { get; set; }      // Review content embedding
    
    // Optional: Combined vector (weighted average)
    public float[] CombinedVector { get; set; }
    
    // Metadata
    public string EmbeddingModel { get; set; }    // "text-embedding-3-small" (for tracking)
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### Storage Options

**Option 1: PostgreSQL + pgvector (Recommended for MVP)**
```sql
-- Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table
CREATE TABLE review_embeddings (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES reviews(id),
    movie_id UUID NOT NULL REFERENCES movies(id),
    
    -- Vector columns (1536 dimensions)
    movie_description_vector vector(1536),
    review_content_vector vector(1536),
    combined_vector vector(1536),
    
    embedding_model VARCHAR(100),
    created_at TIMESTAMP DEFAULT UTC_NOW(),
    updated_at TIMESTAMP
);

-- Vector indexes (for fast similarity search)
CREATE INDEX ON review_embeddings USING ivfflat (
    movie_description_vector vector_cosine_ops
) WITH (lists = 100);
```

**Query Example (PostgreSQL + pgvector):**
```sql
-- "Tìm phim giống với query"
SELECT 
    m.id, m.title, m.poster_url,
    1 - (re.movie_description_vector <=> query_vector) AS similarity_score
FROM review_embeddings re
JOIN movies m ON re.movie_id = m.id
WHERE re.movie_description_vector <=> query_vector < 0.2  -- Cosine distance
ORDER BY similarity_score DESC
LIMIT 10;
```

**Option 2: Pinecone (For scale > 1M vectors)**
- Managed service (no DevOps needed)
- Faster queries, built-in reranking
- Cost: ~$0.25 per 1M queries
- Can migrate from pgvector later

#### API for Embedding Management
```
POST   /api/admin/embeddings/regenerate    # Regenerate all vectors
POST   /api/admin/embeddings/movie/{id}    # Regenerate for specific movie
GET    /api/admin/embeddings/status        # Check embedding coverage
```

---

## 🔗 Entity Relationships – ER Diagram

```
┌─────────────────┐
│      User       │  (1) ────── (Many) Review
├─────────────────┤ (1) ────── (Many) Comment
│ id (PK)         │ (1) ────── (Many) Like
│ username        │ (1) ──────→ (Many) Follow (Follower)
│ email           │ (1) ──────→ (Many) Follow (Following)
│ bio             │
│ avatar_url      │
└─────────────────┘


┌─────────────────┐
│     Movie       │  (1) ────── (Many) Review
├─────────────────┤ (1) ────── (Many) ReviewEmbedding
│ id (PK)         │
│ tmdb_id         │
│ title           │
│ description     │
│ poster_url      │
│ rating_avg      │
└─────────────────┘


┌─────────────────┐
│     Review      │  (1) ────── (Many) Comment
├─────────────────┤ (1) ────── (Many) Like
│ id (PK)         │ (1) ────── (1) ReviewEmbedding
│ user_id (FK)    │
│ movie_id (FK)   │
│ title           │
│ content         │
│ rating          │
│ like_count      │
│ comment_count   │
└─────────────────┘


┌─────────────────┐
│    Comment      │  (Many) ────── (1) Review
├─────────────────┤ (Many) ────── (1) User
│ id (PK)         │
│ review_id (FK)  │
│ user_id (FK)    │
│ content         │
└─────────────────┘


┌─────────────────┐
│      Like       │  (Many) ────── (1) Review
├─────────────────┤ (Many) ────── (1) User
│ id (PK)         │
│ review_id (FK)  │
│ user_id (FK)    │
└─────────────────┘


┌─────────────────┐
│     Follow      │  (1) ──FollowerId──→ (1) User
├─────────────────┤ (1) ──FollowingId──→ (1) User
│ id (PK)         │
│ follower_id (FK)│
│ following_id(FK)│
└─────────────────┘


┌──────────────────────────┐
│   ReviewEmbedding 🤖     │  (1) ────── (1) Review
├──────────────────────────┤ (1) ────── (1) Movie
│ id (PK)                  │
│ review_id (FK) UNIQUE    │
│ movie_id (FK)            │
│ movie_description_vector │
│ review_content_vector    │
│ combined_vector          │
└──────────────────────────┘
```

---

## 📈 Database Size Estimation

### Storage per Record
| Model | Size/Record | Total (1M users) |
|-------|------------|------------------|
| User | ~500 B | 500 MB |
| Movie | ~2 KB | 100 GB (50M movies) |
| Review | ~1 KB | 1 TB (1M reviews) |
| Comment | ~500 B | 500 GB (1M comments) |
| Like | ~32 B | 32 GB (1B likes) |
| Follow | ~32 B | 32 GB (1B follows) |
| ReviewEmbedding | ~12 KB | 12 TB (1M embeddings) |

**Total:** ~15-20 TB (ngay cả với 1M users)

### Optimization Strategies
- **Read replicas:** For high-traffic queries (movies, reviews)
- **Caching layer:** Redis for user profiles, movie metadata
- **Archival:** Move old reviews/comments to cold storage
- **Vector DB:** Separate Pinecone for embeddings (doesn't count towards SQL storage)

---

## 🚀 AI Integration Flow

### Scenario: Semantic Search for "cô bé quàng khăn đỏ và con sói"

```
1️⃣ User Input
   Query: "cô bé quàng khăn đỏ và con sói"

2️⃣ Embedding Generation
   POST /api/ai/embed
   → OpenAI API: text-embedding-3-small
   → Output: [0.123, -0.456, ..., 0.789] (1536-dim)

3️⃣ Vector Similarity Search
   SELECT * FROM review_embeddings
   WHERE movie_description_vector <~> query_vector
   LIMIT 10

4️⃣ Results Ranking
   - By similarity score (0.92, 0.89, 0.85, ...)
   - By movie rating (0-10)
   - By review count

5️⃣ Response
   [
     {
       "movieId": "...", "title": "Little Red Riding Hood",
       "similarity": 0.92, "rating": 7.8, "reviews": 234
     },
     ...
   ]

6️⃣ Frontend Display
   Show top 10 results with relevance indicator
```

---

## 🔄 Data Flow: Create Review

```
┌─ Frontend ──────────────────────────────┐
│ User fills form:                        │
│ - Movie selection                       │
│ - Rating (1-10)                         │
│ - Title                                 │
│ - Content (long-form)                   │
│ - Spoiler warning checkbox              │
└─────────┬──────────────────────────────┘
          │
          ↓
┌─ API Controller ────────────────────────┐
│ POST /api/reviews                       │
│ Validate: rating, content length, etc.  │
└─────────┬──────────────────────────────┘
          │
          ↓
┌─ Database Transaction ──────────────────┐
│ 1. Insert Review                        │
│ 2. Update Movie.ReviewCount             │
│ 3. Update Movie.RatingAvg (recalc)      │
│ 4. Update User.ReviewCount              │
└─────────┬──────────────────────────────┘
          │
          ↓
┌─ Background Job ────────────────────────┐
│ Generate Embedding (Async)              │
│ 1. Extract: movie desc + review content │
│ 2. API OpenAI → get vectors             │
│ 3. Insert ReviewEmbedding               │
└─────────┬──────────────────────────────┘
          │
          ↓
┌─ Response ──────────────────────────────┐
│ {                                       │
│   "id": "...",                          │
│   "reviewId": "...",                    │
│   "movieId": "...",                     │
│   "success": true                       │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist: Implementing MVP Models

### Phase 0: Setup
- [ ] Create DbContext với 7 models
- [ ] Configure relationships, indexes
- [ ] Setup migration: `dotnet ef migrations add InitialCreate`
- [ ] Seed TMDB movies (~1000 popular films)

### Phase 1: Core CRUD
- [ ] User: Register/Login/Profile
- [ ] Movie: Fetch from TMDB, List/Search
- [ ] Review: Create/Read/Update/Delete
- [ ] Comment: Create/Read/Delete
- [ ] Like: Add/Remove
- [ ] Follow: Add/Remove

### Phase 2: Social Features
- [ ] Follow + User stats cache
- [ ] Personal feed (reviews from following)
- [ ] Trending feed (by likes/rating)
- [ ] Leaderboard query

### Phase 3: AI Integration
- [ ] Setup pgvector extension
- [ ] Implement IAiSearchService
- [ ] Batch generate embeddings for existing movies
- [ ] Create `/api/movies/search-ai` endpoint
- [ ] Performance test (query times)

---

## 🎯 Summary: MVP vs Full Spec

| Aspect | MVP (Phase 1) | Full Spec (Future) |
|--------|---------------|--------------------|
| **Models** | 7 tables | 12+ tables |
| **Social** | Follow, Like, Comment | + Notifications, Blocks |
| **Search** | Title + AI semantic | + Filters, Advanced |
| **Admin** | Basic moderation | + Analytics, Dashboard |
| **Dev Time** | 8-12 weeks | 20-24 weeks |
| **Scalability** | Up to 1M users | 100M+ users |

---

## 📚 References & Next Steps

1. **Database Setup:** PostgreSQL 14+ with pgvector extension
2. **ORM:** Entity Framework Core 8.0+
3. **AI:** OpenAI text-embedding API (or open-source alternatives)
4. **Vector Search:** PostgreSQL pgvector OR Pinecone (scale phase)

**Next Meeting:** Review this design, finalize schema, start implementation
