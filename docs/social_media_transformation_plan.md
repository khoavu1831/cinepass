# Kế Hoạch Chuyển Đổi: Từ Hệ Thống Đặt Vé sang Social Media Review Phim

**Ngày cập nhật:** 28/03/2026  
**Phiên bản:** 1.0  
**Trạng thái:** Đề xuất

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1 Cấu Trúc Hiện Tại
CinePass hiện là một nền tảng hybrid với hai tính năng chính:

#### **Tính Năng Booking Vé (sẽ loại bỏ)**
- **Models liên quan:** `Booking`, `BookingSeat`, `Cinema`, `Room`, `Seat`, `Showtime`
- **Chứ năng:**
  - Đặt vé xem phim tại rạp chiếu
  - Quản lý ghế ngồi
  - Xử lý thanh toán
  - Lịch chiếu (Showtime)
- **APIs:** Booking management, Showtime queries, Cinema info

#### **Tính Năng Social Media (sẽ phát triển)**
- **Models sẵn có:** `User`, `Review`, `Comment`, `Like`, `Follow`, `Notification`
- **Chức năng sơ khai:**
  - Đánh giá phim (Rating + Commentary)
  - Bình luận trên reviews
  - Thích (Like) reviews
  - Theo dõi người dùng
  - Thông báo (Notifications)

### 1.2 Bảng So Sánh User Base

| Yếu Tố | Booking Vé | Social Media Review |
|--------|-----------|-------------------|
| Người dùng | Khách hàng của rạp chiếu | Độc giả phim, nhà phê bình |
| Tần suất truy cập | Thỉnh thoảng (khi muốn xem phim) | Thường xuyên (feed newsfeed) |
| Tương tác | Giao dịch (payment) | Cộng đồng (discussion) |
| Doanh thu | Hoa hồng từ booking | Quảng cáo, dịch vụ premium |
| Giá trị dài hạn | Phụ thuộc rạp chiếu | Xây dựng cộng đồng |

---

## 2. ĐỀ XUẤT CHUYỂN ĐỔI

### 2.1 Tầm Nhìn Mới
**CinePass** trở thành **Nền Tảng Social Media Review Phim Hàng Đầu**, nơi:
- Người hâm mộ phim chia sẻ đánh giá và nhận xét
- Các nhà phê bình xây dựng danh tiếng thông qua review chất lượng
- Cộng đồng tương tác, tranh luận về các bộ phim

### 2.2 Lợi Ích Của Chuyển Đổi

| Lợi Ích | Chi Tiết |
|---------|---------|
| **Khả năng mở rộng** | Không bị ràng buộc bởi các rạp chiếu cụ thể; có thể mở rộng toàn cầu |
| **User retention** | Người dùng quay lại thường xuyên hơn với feed newsfeed (so với booking 1 lần mỗi tuần) |
| **Doanh thu đa dạng** | Quảng cáo, subscription premium, affiliate links đến nền tảng streaming |
| **Dữ liệu giá trị** | Thu thập insights về sở thích phim của người dùng để đề xuất cá nhân hóa |
| **Cạnh tranh** | Tương tự IMDb, Letterboxd, MyAnimeList (nếu có anime) |
| **Cộng đồng mạnh** | Xây dựng eco-system người dùng gắn bó lâu dài |

---

## 2.3 MVP Tối Giản + AI Integration (Khuyến Nghị Cho Giai Đoạn 1)

### Triết Lý Thiết Kế
**Mục tiêu:** Xây dựng nền tảng học tập với 4-5 chức năng core, tích hợp AI semantic search, nhưng có khả năng scale mạnh mẽ trong tương lai.

**Khác với bản đầy đủ:**
- Loại bỏ gamification, featured reviews, nested comments phức tạp
- Tập trung vào: **Review → Comment → Like → Follow → AI Search**
- Giảm từ 30+ features xuống còn **~10 chức năng cốt lõi**

### 2.3.1 Chức Năng MVP Tối Giản

| # | Chức Năng | Độ Ưu Tiên | Lý Do |
|---|-----------|-----------|-------|
| 1 | Auth: Register/Login | ⭐⭐⭐ | Enable user identity |
| 2 | User Profile | ⭐⭐⭐ | Basic identity, bio |
| 3 | Create/Read/Update/Delete Review | ⭐⭐⭐ | Core business logic |
| 4 | Like Review | ⭐⭐⭐ | Social signal, ranking |
| 5 | Comment on Review | ⭐⭐⭐ | Community discussion (flat, no nesting) |
| 6 | Follow User | ⭐⭐ | Basic social graph |
| 7 | Personal Feed (from following) | ⭐⭐ | Content discovery |
| 8 | **AI Semantic Search** | ⭐⭐⭐ | Unique feature, differentiation |
| 9 | Movie Details (from TMDB) | ⭐⭐⭐ | Content reference |
| 10 | Basic Admin: Delete inappropriate content | ⭐⭐ | Moderation |

**Loại bỏ ở MVP:**
- ❌ Nested comments (quá phức tạp để bắt đầu)
- ❌ Notifications (có thể thêm later)
- ❌ Gamification, badges, leaderboard
- ❌ Featured reviews, editor's picks
- ❌ Advanced analytics
- ❌ Watchlist (có thể implement nhanh sau)

### 2.3.2 Core Database Models (MVP)

```csharp
// 🟦 Core Models - Tối Giản & Scalable

// 1. USER - Xác định danh tính
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    
    // Profile
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    
    // Relationships
    public ICollection<Review> Reviews { get; set; }          // Reviews được viết
    public ICollection<Comment> Comments { get; set; }        // Comments được viết
    public ICollection<Like> Likes { get; set; }              // Reviews được thích
    public ICollection<Follow> FollowingUsers { get; set; }   // Người mà user này follow
    public ICollection<Follow> Followers { get; set; }        // Người follow user này
    
    // Audit
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// 2. MOVIE - Reference từ TMDB API
public class Movie
{
    public Guid Id { get; set; }
    public int? TmdbId { get; set; }              // Link đến TMDB
    public string Title { get; set; }
    public string? Description { get; set; }
    public string? PosterUrl { get; set; }
    public string? TrailerUrl { get; set; }
    public int? Duration { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    
    // Aggregated Data (từ reviews)
    public decimal RatingAvg { get; set; }        // Tính từ tất cả reviews
    public int ReviewCount { get; set; }          // Cache: số reviews
    
    // Relationships
    public ICollection<Review> Reviews { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; }
}

// 3. REVIEW - Core Content (Nền tảng)
public class Review
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid MovieId { get; set; }
    
    // Content
    public string Title { get; set; }             // Review title
    public string Content { get; set; }           // Review text
    public decimal Rating { get; set; }           // 1-10 hoặc 1-5
    public bool HasSpoiler { get; set; }          // Spoiler warning flag
    
    // Engagement Metrics
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    
    // Relationships
    public User User { get; set; }
    public Movie Movie { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// 4. COMMENT - Discussion
public class Comment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ReviewId { get; set; }
    
    // Content
    public string Content { get; set; }
    
    // Relationships
    public User User { get; set; }
    public Review Review { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// 5. LIKE - Social Signal
public class Like
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ReviewId { get; set; }
    
    // Relationships
    public User User { get; set; }
    public Review Review { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; }
}

// 6. FOLLOW - Social Graph
public class Follow
{
    public Guid Id { get; set; }
    public Guid FollowerId { get; set; }        // Người follow
    public Guid FollowingId { get; set; }       // Người được follow
    
    // Relationships
    public User Follower { get; set; }
    public User Following { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; }
}

// 7. REVIEW_EMBEDDING - Cho AI Search (Vector DB)
// ⚠️ Thêm vào sau khi integrate AI
public class ReviewEmbedding
{
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }
    public Guid MovieId { get; set; }
    
    // Vector embedding (1536 dim cho OpenAI)
    public float[] MovieDescriptionVector { get; set; }
    public float[] ReviewContentVector { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

**Tổng cộng: 7 models (tối giản mà đủ dùng)**

### 2.3.3 AI Semantic Search Integration

#### **Tính Năng: "Tìm Phim Bằng Miêu Tả"**

**Ví dụ Use Cases:**
- User: "tôi muốn phim có cô bé quàng khăn đỏ và con sói"
- System: Tìm được "Little Red Riding Hood", các adaptations Disney/dark versions
- ---
- User: "phim về tình nhân lưu vong ở Paris"
- System: "The Devil Wears Prada", "Amélie", "Midnight in Paris", v.v.

#### **Kiến Trúc AI Search**

```
┌─────────────────────────────────────────────────────────────┐
│ USER QUERY: "cô bé quàng khăn đỏ và con sói"               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │ 1. AI Semantic Embedding      │
         │    (OpenAI/Hugging Face)      │
         │    Query → Vector (1536-dim)  │
         └────────────┬──────────────────┘
                      ↓
         ┌───────────────────────────────┐
         │ 2. Vector Similarity Search   │
         │    (Pinecone/Weaviate/PGVECTOR)
         │    - Movie descriptions       │
         │    - Review content (optional)│
         └────────────┬──────────────────┘
                      ↓
         ┌───────────────────────────────┐
         │ 3. Ranking & Re-ranking       │
         │    - By similarity score      │
         │    - By rating/popularity     │
         │    - By recency               │
         └────────────┬──────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│ RESULTS:                                             │
│ • Little Red Riding Hood (2011) - similarity: 0.92  │
│ • Hoodwinked (2005) - similarity: 0.89              │
│ • Crimson Peak (2015) - similarity: 0.85            │
└──────────────────────────────────────────────────────┘
```

#### **Backend Architecture**

```csharp
// Backend - AI Search Service
public interface IAiSearchService
{
    // Embedding generation
    Task<float[]> GenerateEmbeddingAsync(string text);
    
    // Search
    Task<List<MovieSearchResult>> SearchByDescriptionAsync(
        string query, 
        int topK = 10);
    
    // Batch embedding (cho new movies từ TMDB)
    Task RegenerateAllEmbeddingsAsync();
}

// Implementation cho OpenAI
public class OpenAiSearchService : IAiSearchService
{
    private readonly IOpenAiClient _openAi;
    private readonly IVectorStore _vectorStore;  // Pgvector hoặc Pinecone
    
    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        // Gọi OpenAI API: text-embedding-3-small/large
        var response = await _openAi.CreateEmbeddingAsync(text);
        return response.Data[0].Embedding.ToArray();
    }
    
    public async Task<List<MovieSearchResult>> SearchByDescriptionAsync(
        string query, int topK = 10)
    {
        // 1. Embedding query
        var queryVector = await GenerateEmbeddingAsync(query);
        
        // 2. Vector similarity search
        var results = await _vectorStore.SearchSimilarAsync(
            queryVector, 
            topK,
            "movie_descriptions");  // Index name
        
        // 3. Enrich with metadata & ranking
        return results.Select(r => new MovieSearchResult
        {
            MovieId = r.MovieId,
            Title = r.Metadata["title"],
            SimilarityScore = r.Score,
            Poster = r.Metadata["poster_url"],
            RatingAvg = decimal.Parse(r.Metadata["rating"])
        }).ToList();
    }
}
```

#### **Vector Store Options**

| Vector DB | Pros | Cons | Cost |
|-----------|------|------|------|
| **PostgreSQL + pgvector** | Self-hosted, free, SQL familiar | Slower for large scale | Free |
| **Pinecone** | Fully managed, fast, excellent UI | Vendor lock-in | ~$0.25/1M queries |
| **Weaviate** | Open-source, GraphQL, flexible | Need DevOps | Free (self-hosted) |
| **Milvus** | High-performance, open-source | Complex setup | Free (self-hosted) |

**Khuyến nghị cho MVP:** `PostgreSQL + pgvector` (simplicity), migrate sang Pinecone/Weaviate nếu scale

#### **Frontend - Search UI**

```jsx
// React Component tương tự Google Search
<AIMovieSearch 
  onSearch={(query) => {
    // Call API: /api/movies/search-ai?q={query}
    fetchAiSearchResults(query);
  }}
  results={aiResults}
  showRelevanceScore={true}
/>

// Example Results:
// 1. "Little Red Riding Hood" - Match: 92%
// 2. "Hoodwinked" - Match: 89%
// 3. "Red Riding (2009)" - Match: 85%
```

### 2.3.4 Scalability Roadmap (Phase 2-3)

**Phase 1 (MVP - 8-12 tuần):**  
✅ Core 7 models + basic CRUD  
✅ AI search với pgvector  
✅ Basic social: follow, like, comment  

**Phase 2 (Scaling - 6-8 tuần):**  
➕ Notifications (WebSocket/SignalR)  
➕ Watchlist model  
➕ Advanced analytics  
➕ Migrate vector DB sang Pinecone (for speed)  

**Phase 3 (Enhancement - 4-6 tuần):**  
➕ Leaderboard (cached, regenerated weekly)  
➕ AI-powered recommendations (content-based filtering)  
➕ Moderation tools, detailed reporting  
➕ Admin dashboard  

**Future (Phase 4+):**  
➕ Video reviews (storage + encoding)  
➕ Collaborative filtering recommendations  
➕ Mobile app (React Native)  
➕ Monetization (premium features, ads)

### 2.3.5 Implementation Priority Matrix

```
Priority (Core MVP)
  ↑
  │  📍 Reviews (ASAP)
  │  📍 Auth (ASAP)
  │  📍 AI Search (ASAP - Unique feature!)
  │  📍 Comments (ASAP)
  │  📍 Like (ASAP)
  │
  │  🔔 Follow (Soon)
  │  🔔 Feed (Soon)
  │
  │  ⏳ Watchlist (Later)
  │  ⏳ Notifications (Later)
  │  ⏳ Analytics (Later)
  │
  └──────────────────────────────────────→ Effort (Easy → Hard)
```

---

## 3. DANH SÁCH CHỨC NĂNG CẦN THIẾT

### 3.1 Chức Năng Core (Bắt Buộc)

#### **Quản Lý Tài Khoản**
- [ ] Đăng ký / Đăng nhập (OAuth2 hoặc email)
- [ ] Hồ sơ người dùng: bio, avatar, cover photo
- [ ] Chỉnh sửa thông tin cá nhân
- [ ] Xóa tài khoản
- [ ] Xác thực email / 2FA (bảo mật)

#### **Tính Năng Review**
- [ ] Tạo review cho phim:
  - Đánh giá (1-5 sao hoặc 1-10 điểm)
  - Tiêu đề review
  - Văn bản review
  - Tag spoiler warning
  - Chọn trạng thái: public/draft/private
- [ ] Chỉnh sửa/Xóa review của riêng mình
- [ ] Xem review chi tiết
- [ ] Sắp xếp review: mới nhất, phổ biến, có liên quan

#### **Tương Tác Cộng Đồng**
- [ ] **Like** review
- [ ] **Comment** trên review (phản hồi cấp 1)
- [ ] **Reply** bình luận (phản hồi cấp 2 - nested comments)
- [ ] Xóa bình luận/phản hồi của riêng mình
- [ ] Thích bình luận

#### **Theo Dõi & Thông Báo**
- [ ] Follow/Unfollow người dùng khác
- [ ] Xem follower/following list
- [ ] Thông báo khi:
  - Ai đó follow bạn
  - Bình luận/like trên review của bạn
  - Review từ người bạn follow
- [ ] Xem/Clear thông báo
- [ ] Mute thông báo từ người dùng cụ thể

#### **Feed & Khám Phá**
- [ ] **Feed cá nhân**: review từ người dùng đã follow
- [ ] **Trending feed**: review phổ biến
- [ ] **Explore page**: tìm phim theo thể loại, xu hướng
- [ ] **Tìm kiếm**:
  - Tìm phim
  - Tìm người dùng
  - Tìm review theo #hashtag

#### **Quản Lý Phim**
- [ ] Catalog phim từ TMDB API (sẵn có)
- [ ] Xem chi tiết phim:
  - Thông tin: title, synopsis, poster, trailer
  - Tất cả review của phim
  - Rating trung bình
  - Thống kê: ratings phân bố (1 sao, 2 sao, ..., 5 sao)
- [ ] Bookmark/Watchlist phim (muốn xem sau)

### 3.2 Chức Năng Nâng Cao (Tùy Chọn Giai Đoạn 1)

#### **Gamification**
- [ ] Huy hiệu (badges): "Nhà phê bình sắc sảo", "Review được like >100 lần", v.v.
- [ ] Leaderboard: Top reviewers theo tháng/năm
- [ ] Điểm kinh nghiệm (XP): tăng level dựa trên hoạt động
- [ ] Thành tích (Achievements): nếu đạt milestone nào đó

#### **Nội Dung Chất Lượng**
- [ ] **Featured reviews**: đội moderator chọn các review xuất sắc
- [ ] **Editor's picks**: các review được đôi khi "highlight"
- [ ] **Best reviews**: sắp xếp theo engagement, helpfulness votes

#### **Tương Tác Nâng Cao**
- [ ] Helpful/Not Helpful votes (hữu ích cho việc sắp xếp)
- [ ] Quote từ review để share
- [ ] Sort comments theo: helpful, newest, oldest

#### **Cá Nhân Hóa**
- [ ] Khuyến nghị phim dựa trên review history
- [ ] Weekly digest email: phim phổ biến, review từ follow
- [ ] Preference settings: loại film yêu thích, ngôn ngữ, v.v.

### 3.3 Chức Năng Quản Trị (Admin/Moderator)

#### **Content Moderation**
- [ ] Báo cấo review/comment (spam, inappropriate)
- [ ] Review & approve báo cáo
- [ ] Xóa nội dung vi phạm
- [ ] Ban/mute người dùng

#### **Quản Lý Người Dùng**
- [ ] Xem thống kê người dùng
- [ ] Suspend/Ban tài khoản
- [ ] Reset password (support user)

#### **Thống Kê & Analytics**
- [ ] Số lượng review/user/engagement hàng ngày
- [ ] Top trending phim/reviews
- [ ] User retention rate
- [ ] Content moderation dashboard

---

## 4. MODELS CẦN CẬP NHẬT/XÓA

### 4.1 Models Cần Xóa
```
- Booking (toàn bộ)
- BookingSeat (toàn bộ)
- Cinema (toàn bộ)
- Room (toàn bộ)
- Seat (toàn bộ)
- Showtime (toàn bộ)
```

### 4.2 Models Cần Mở Rộng

#### **User Model**
```
Thêm:
- FollowerCount, FollowingCount (cache)
- TotalReviews, TotalLikes (statistics)
- Reputation (liên quan gamification)
- IsBanned, MutedUsers (list of Guids)
- PreferredGenres, WatchlistItems
- LastActiveAt (timestamp)

Loại bỏ:
- Bookings (collection)
```

#### **Review Model**
```
Thêm:
- ReviewText (để phân biệt với Comment)
- HelpfulCount (votes hữu ích)
- IsFeatured (featured by moderator)
- ViewCount (số lần xem)

Giữ nguyên:
- Rating, Content, Spoiler flag, Timestamps
```

#### **Comment Model**
```
Giữ nguyên với improvement:
- Support nested structure (ParentId sẵn có rồi)

Thêm:
- HelpfulCount (votes hữu ích)
- IsDeleted (soft delete)
```

#### **New Models**
```csharp
// Watchlist - danh sách muốn xem
Watchlist {
  Id, UserId, MovieId, AddedAt, Priority
}

// Mute/Block - người dùng ẩn
MutedUser {
  Id, UserId (người mute), MutedUserId (bị mute), CreatedAt
}

// Notification - thông báo
Notification {
  Id, UserId, Type (Follow, Like, Comment), 
  RelatedUserId, ReviewId, CommentId, IsRead, CreatedAt
}

// Badge - huy hiệu (gamification)
UserBadge {
  Id, UserId, BadgeName, EarnedAt, Description
}

// Report - báo cấo nội dung
ContentReport {
  Id, ReportedById, ReviewId/CommentId, Reason, 
  Status (PENDING, RESOLVED, DISMISSED), CreatedAt
}
```

---

## 5. KIẾN TRÚC API MỚI

### 5.1 API Endpoints (Grouping)

#### **Auth**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### **Users**
```
GET    /api/users/{id}                    # Xem profile
PUT    /api/users/{id}                    # Cập nhật profile
GET    /api/users/{id}/reviews            # Reviews của user
GET    /api/users/{id}/followers
GET    /api/users/{id}/following
POST   /api/users/{id}/follow
POST   /api/users/{id}/unfollow
POST   /api/users/{id}/mute
POST   /api/users/{id}/unmute
GET    /api/users/me                      # Profile của riêng mình
GET    /api/users/leaderboard             # Top reviewers
```

#### **Movies**
```
GET    /api/movies                        # Danh sách phim (có pagination, filter)
GET    /api/movies/{id}                   # Chi tiết phim
GET    /api/movies/{id}/reviews           # Tất cả review của phim
GET    /api/movies/{id}/stats             # Rating statistics
GET    /api/movies/trending               # Phim trending
GET    /api/movies/search?q=...           # Tìm kiếm
```

#### **Reviews**
```
POST   /api/reviews                       # Tạo review
GET    /api/reviews/{id}                  # Xem review
PUT    /api/reviews/{id}                  # Chỉnh sửa review
DELETE /api/reviews/{id}                  # Xóa review
POST   /api/reviews/{id}/like             # Like review
DELETE /api/reviews/{id}/like             # Unlike review
GET    /api/reviews/{id}/comments         # Comments của review
GET    /api/me/reviews                    # Reviews của mình
```

#### **Comments**
```
POST   /api/comments                      # Tạo comment (reviewId trong body)
PUT    /api/comments/{id}                 # Chỉnh sửa comment
DELETE /api/comments/{id}                 # Xóa comment
POST   /api/comments/{id}/like            # Like comment
DELETE /api/comments/{id}/like            # Unlike comment
```

#### **Feed & Discovery**
```
GET    /api/feed                          # Personal feed
GET    /api/feed/trending                 # Trending reviews
GET    /api/discover/genres/{genre}       # Discover by genre
GET    /api/notifications                 # Thông báo của bạn
DELETE /api/notifications/{id}            # Clear notification
POST   /api/notifications/read/{id}       # Mark as read
```

#### **Watchlist**
```
GET    /api/me/watchlist                  # Danh sách muốn xem
POST   /api/me/watchlist                  # Thêm vào watchlist
DELETE /api/me/watchlist/{movieId}        # Xóa khỏi watchlist
```

#### **Reports (Admin)**
```
POST   /api/reports                       # Báo cấo nội dung
GET    /api/admin/reports                 # Danh sách báo cáo
PUT    /api/admin/reports/{id}            # Xử lý báo cáo
DELETE /api/admin/reports/{id}            # Đóng báo cáo
```

---

## 6. GÓP Ý HƯỚNG PHÁT TRIỂN TƯƠNG LAI

### 6.1 Hướng 1: Cộng Đồng Nội Dung (Community-Driven)
**Mô tả:** Tập trung xây dựng cộng đồng reviewer chất lượng cao

**Các tính năng bổ sung:**
- Creator Program: reviewer hàng đầu nhận hỗ trợ, độc quyền nội dung
- Collaborations: hợp tác review giữa reviewers
- Podcasts/Video Reviews: mở rộng sang video content
- Writer's Guild: tổ chức các nhà phê bình chuyên nghiệp
- Monetization: creator có thể kiếm tiền từ premium content

**Thích hợp cho:** Xây dựng thương hiệu dài hạn, engagement cao

---

### 6.2 Hướng 2: Entertainment Hub (Tổng hợp giải trí)
**Mô tả:** Mở rộng sang các nội dung giải trí khác

**Các tính năng bổ sung:**
- TV Series reviews (hiện dự phim được)
- Anime reviews (sử dụng MAL API)
- Games reviews (video game rating)
- Actors/Directors profiles: follow actors/directors yêu thích
- Podcast reviews: đánh giá podcast
- Book adaptations: so sánh sách vs bộ phim

**Thích hợp cho:** Mở rộng thị trường user base

---

### 6.3 Hướng 3: B2B Entertainment Platform
**Mô tả:** Cung cấp dịch vụ cho streamers, studios, cinemas

**Các tính năng bổ sung:**
- Integration với Netflix, Amazon Prime: review content từ các nền tảng
- Studio Tools: filmmakers upload trailer, nhận feedback từ community
- Cinema Partnerships: reviews được hiển thị trên website rạp
- Analytics API: cung cấp data cho studios về audience sentiment
- Press Kit: tạo review highlights cho PR studios
- Affiliate Links: kiếm tiền từ links đến streaming platforms

**Thích hợp cho:** Doanh thu B2B ổn định

---

### 6.4 Hướng 4: AI-Driven Personalization
**Mô tả:** Sử dụng AI/ML để tạo trải nghiệm cá nhân hóa

**Các tính năng bổ sung:**
- Recommendation engine: gợi ý phim dựa trên review history
- Personalized newsfeed: sắp xếp reviews theo relevance
- Review summarization: tóm tắt AI từ nhiều reviews
- Sentiment analysis: phân tích tâm trạng của reviews
- Duplicate detection: tìm reviews giống nhau để merge

**Thích hợp cho:** Giữ user engagement, retention

---

### 6.5 Hướng 5: Marketplace + Ticketing (Hybrid)
**Mô tả:** Giữ lại booking nhưng với hình thức khác

**Các tính năng bổ sung:**
- Affiliate Ticketing: link bán vé rạp/streaming, nhận commission
- Event Reviews: talkback sessions, premiere parties
- Fan Events: community watch parties (online/offline)
- Merchandise: shop đồ phim liên quan
- Ticketmaster Integration: bán vé chính thức, không quản lý rạp

**Lợi ích:** Vẫn có doanh thu booking nhưng không phức tạp quản lý rạp  
**Nhược điểm:** Tương tự booking, bị ràng buộc bởi ticket availability

---

### 6.6 Khuyến Nghị Hứng Tợi Giai Đoạn Tiếp Theo

| Giai Đoạn | Hướng Chọn | Lý Do |
|-----------|-----------|-------|
| **T1-T2** | Community-Driven | Xây dựng foundation cộng đồng mạnh |
| **T2-T3** | Entertainment Hub | Mở rộng content, đạt critical mass |
| **T3+** | AI-Driven + B2B | Tối ưu hóa engagement + monetization |

---

## 7. TIMELINE CHUYỂN ĐỔI ĐƯƠC TÍNH

### Phase 1: Core Features (8-12 tuần)
- [ ] Xóa toàn bộ code booking
- [ ] Mở rộng User, Review, Comment models
- [ ] Implement feed & discovery
- [ ] Deploy beta version (closed alpha)

### Phase 2: Community Features (4-6 tuần)
- [ ] Follow/Notification system
- [ ] Leaderboard & gamification v1
- [ ] Moderation tools
- [ ] Public beta launch

### Phase 3: Polish & Optimization (4-6 tuần)
- [ ] Performance optimization
- [ ] Mobile-responsive design
- [ ] Analytics dashboard
- [ ] Official launch v1.0

---

## 8. RESOURCE & RISK ASSESSMENT

### 8.1 Resources Needed
- **Backend:** 2-3 developers (C#/.NET)
- **Frontend:** 2 developers (React/Vue)
- **DevOps:** 1 engineer (database migration, deployment)
- **Design:** 1 UI/UX designer
- **QA:** 1-2 testers
- **Product:** 1 product manager

### 8.2 Risk & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **User base migration** | High | Giữ booking system 2-3 tháng parallel; incentivize reviews |
| **Content moderation** | High | Implement AI flagging + human review; community report system |
| **Cold start problem** | Medium | Seed initial reviews từ TMDB; partner reviewers invited |
| **Technical debt** | Medium | Refactor code incrementally; migrate database carefully |
| **Competition** IMDb | Low | Focus on niche (Asia), community-first approach |

---

## 9. KẾT LUẬN

Chuyển đổi từ **booking vé → social media review phim** là quyết định chiến lược dài hạn:

✅ **Ưu điểm:**
- Mở rộng toàn cầu không bị ràng buộc rạp chiếu
- User retention cao hơn
- Doanh thu đa dạng (quảng cáo, B2B, premium)
- Xây dựng cộng đồng gắn bó
- Cạnh tranh rõ ràng (IMDb, Letterboxd)

❌ **Thách thức:**
- Phải xây dựng lại toàn bộ logic business
- Cold start: cần seed content & users ban đầu
- Content moderation phức tạp
- Cạnh tranh với các giant (IMDb, Letterboxd)

🎯 **Khuyến nghị:** Bắt đầu với Phase 1 (core features), launch beta vào T1/T2 năm, testing feedback từ early users trước khi scale.

