import axiosClient from "../api/axiosClient";
import { mapSliderMovie } from "../mappers/sliderMovieMapper";

export const getMovies = (params) => axiosClient.get(`/movies?${params}`).then(res => res.data);

export const fetchSliderMovies = () => getMovies("sortBy=popularity&order=desc&pageSize=10");
export const fetchTopTodayMovies = () => getMovies("sortBy=releaseDate&order=desc&pageSize=10");
export const fetchTopSeriesMovies = () => getMovies("sortBy=voteAverage&order=desc&pageSize=10");

export const fetchAnimeSlider = () => getMovies("search=anime&sortBy=popularity&order=desc&pageSize=10");

export const fetchKoreanMovies = () => getMovies("search=korea&sortBy=popularity&order=desc&pageSize=10");

export const fetchUSUKMovies = () => getMovies("search=us&sortBy=popularity&order=desc&pageSize=10");

export const fetchThaiMovies = () => getMovies("search=thai&sortBy=popularity&order=desc&pageSize=10");

export const fetchCinemaMovies = () => getMovies("sortBy=releaseDate&order=desc&pageSize=10");

export const fetchThrillerMovies = () => getMovies("search=thriller&sortBy=popularity&order=desc&pageSize=10");

export const fetchAnimeCollection = () => getMovies("search=anime&sortBy=voteAverage&order=desc&pageSize=10");

export const fetchPublicCollections = () => axiosClient.get("/public/collections").then(res => res.data);

export const getHomeData = async () => {
  const [
    collectionsRes,
    sliderRes
  ] = await Promise.all([
    fetchPublicCollections(),
    fetchSliderMovies()
  ]);

  const collections = (collectionsRes || []).map(col => ({
    ...col,
    movies: (col.movies || []).map(mapSliderMovie)
  }));

  return {
    collections,
    rankingMovies: sliderRes.data || []
  };
};

export const getMovieDetails = (id) => axiosClient.get(`/movies/${id}`).then(res => res.data);
