import { fetchApi } from "../api/http";
import { TMDB_BASE_URL } from "../api/tmdb";

const discover = (params) =>
  fetchApi(`${TMDB_BASE_URL}/discover/movie?language=vi-VN&${params}`);

const trending = (params = "") =>
  fetchApi(`${TMDB_BASE_URL}/trending/movie/week?language=vi-VN&${params}`);

export const fetchSliderMovies = () =>
  trending();

export const fetchAnimeSlider = () =>
  discover("with_original_language=ja&sort_by=popularity.desc&page=1");

export const fetchKoreanMovies = () =>
  discover("with_origin_country=KR&sort_by=popularity.desc&page=1");

export const fetchUSUKMovies = () =>
  discover("with_origin_country=US|GB&sort_by=popularity.desc&page=1");

export const fetchThaiMovies = () =>
  discover("with_origin_country=TH&sort_by=popularity.desc&page=1");

export const fetchCinemaMovies = () =>
  discover("with_release_type=3|2&sort_by=popularity.desc&page=1&vote_count.gte=100");

export const fetchTopTodayMovies = () =>
  trending("page=1");

export const fetchThrillerMovies = () =>
  discover("with_genres=53&sort_by=popularity.desc&page=1");

export const fetchAnimeCollection = () =>
  discover("with_original_language=ja&sort_by=vote_average.desc&page=1&vote_count.gte=200");

export const fetchTopSeriesMovies = () =>
  fetchApi(`${TMDB_BASE_URL}/tv/top_rated?language=vi-VN&page=1`);

export const getHomeData = async () => {
  const [
    sliderRes,
    animeSliderRes,
    koreanRes,
    usukRes,
    thaiRes,
    cinemaRes,
    topTodayRes,
    thrillerRes,
    animeColRes,
  ] = await Promise.all([
    fetchSliderMovies(),
    fetchAnimeSlider(),
    fetchKoreanMovies(),
    fetchUSUKMovies(),
    fetchThaiMovies(),
    fetchCinemaMovies(),
    fetchTopTodayMovies(),
    fetchThrillerMovies(),
    fetchAnimeCollection(),
  ]);

  return {
    sliderMovies: sliderRes.results ?? [],
    animeSlider: animeSliderRes.results ?? [],
    koreanMovies: koreanRes.results ?? [],
    usukMovies: usukRes.results ?? [],
    thaiMovies: thaiRes.results ?? [],
    cinemaMovies: cinemaRes.results ?? [],
    topTodayMovies: topTodayRes.results ?? [],
    thrillerMovies: thrillerRes.results ?? [],
    animeCollection: animeColRes.results ?? [],
  };
};

export const getMovieDetails = (id) =>
  fetchApi(`${TMDB_BASE_URL}/movie/${id}?language=vi-VN&append_to_response=credits,videos,images`);
