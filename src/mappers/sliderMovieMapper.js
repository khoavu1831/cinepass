import { TMDB_IMAGE_URL } from "../api/tmdb";

const GENRE_MAP = {
  28: "Hành Động", 12: "Phiêu Lưu", 16: "Hoạt Hình", 35: "Hài",
  80: "Tội Phạm", 99: "Tài Liệu", 18: "Chính Kịch", 10751: "Gia Đình",
  14: "Giả Tưởng", 36: "Lịch Sử", 27: "Kinh Dị", 10402: "Âm Nhạc",
  9648: "Bí Ẩn", 10749: "Lãng Mạn", 878: "Khoa Học Viễn Tưởng",
  10770: "Phim Truyền Hình", 53: "Giật Gân", 10752: "Chiến Tranh", 37: "Cao Bồi",
};

const formatRuntime = (runtime) => {
  if (!runtime) return null;
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const mapSliderMovie = (m) => {
  const genreList = m.genres
    ? m.genres.map(g => ({ id: g.id, name: g.name.replace(/^Phim\s*/i, "") }))
    : (m.genre_ids ?? []).map(id => ({ id, name: GENRE_MAP[id] ?? "" }));

  return {
    id: m.id,
    poster: m.backdrop_path ? `${TMDB_IMAGE_URL}/original${m.backdrop_path}` : "vietnam.png",
    avatar: m.poster_path ? `${TMDB_IMAGE_URL}/w500${m.poster_path}` : "vietnam.png",
    title: m.title ?? m.name ?? "",
    subTitle: m.original_title ?? m.original_name ?? "",
    description: m.overview ?? "",
    subtitle: "0",
    dub: "0",
    info: {
      imdb: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
      year: m.release_date ? m.release_date.slice(0, 4) : (m.first_air_date?.slice(0, 4) ?? "--"),
      resolution: "HD",
      ageLimit: m.adult ? "18+" : "",
      duration: formatRuntime(m.runtime),
      genres: genreList,
    },
  };
};
