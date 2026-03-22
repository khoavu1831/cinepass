import { useState } from "react";
import RowDetailsMovie from "../Info/RowMovieDetails";
import CastCol from "./CastCol";
import { TMDB_IMAGE_URL } from "../../../../../api/tmdb";

const formatRuntime = (runtime) => {
  if (!runtime) return "--";
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

function Info({ movie, loading }) {
  const [toggle, setToggle] = useState(false);

  if (loading) {
    return (
      <div className="container-info relative flex justify-center max-xl:px-4 z-10 xl:w-full">
        <div className="animate-pulse flex flex-col items-center gap-4 w-full">
          <div className="w-30 h-45 xl:w-40 xl:h-60 bg-gray-700 rounded-2xl"></div>
          <div className="h-6 w-48 bg-gray-700 rounded"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_URL}/w342${movie.poster_path}`
    : "vietnam.png";

  const year = movie.release_date?.slice(0, 4) ?? "--";
  const runtime = formatRuntime(movie.runtime);
  const genres = movie.genres ?? [];
  const cast = movie.credits?.cast?.slice(0, 7) ?? [];
  const productionCompanies = movie.production_companies?.map(c => c.name) ?? [];
  const countries = movie.production_countries?.map(c => c.name) ?? [];
  const directors = movie.credits?.crew?.filter(p => p.job === "Director").map(p => p.name) ?? [];

  return (
    <>
      <div className="container-info relative flex justify-center max-xl:px-4 z-10 xl:w-full">
        <div className="wrapper-info flex flex-col justify-center max-xl:items-center">

          <div className="cover-poster w-30 h-45 xl:w-40 xl:h-60">
            <img
              className="w-full h-full object-cover rounded-2xl"
              src={posterUrl}
              alt={movie.title}
            />
          </div>

          <div className="title text-white mt-4 text-xl xl:text-2xl xl:font-bold">
            <h1>{movie.title}</h1>
          </div>

          <div className="subTitle text-gray-400 xl:text-mainblue xl:mb-6 mt-1 text-[14px]">
            <h4>{movie.original_title}</h4>
          </div>

          <div className="btn-more xl:hidden text-mainblue text-[14px] my-4 cursor-pointer">
            <button onClick={() => setToggle(!toggle)}>
              <span>Thông tin phim</span>
              <i className="fa-solid fa-angle-down"></i>
            </button>
          </div>

          <div className={`min-w-full xl:block mb-8 ${toggle ? "block" : "hidden"}`}>

            <div className="tags xl:mb-3">
              <div className="flex text-[10px] gap-1.5 text-white md:text-[12px] items-center">
                <div className="rounded-md px-1.5 py-1 lg:px-1.5 lg:py-1.5 bg-mainblue text-white font-bold">
                  <span>HD</span>
                </div>
                {year && (
                  <div className="rounded-md px-1.5 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10] border">
                    <span>{year}</span>
                  </div>
                )}
                {runtime && (
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10]">
                    <span>{runtime}</span>
                  </div>
                )}
                {movie.vote_average > 0 && (
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10]">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap text-white gap-1.5 text-[12px] py-3">
                {genres.map(g => (
                  <span key={g.id} className="py-1 px-2 bg-[#ffffff10] rounded">{g.name}</span>
                ))}
              </div>
            )}

            {movie.overview && (
              <div className="flex flex-col text-[14px] mb-4">
                <h2 className="text-white font-semibold my-2">Giới thiệu:</h2>
                <span className="text-gray-500">{movie.overview}</span>
              </div>
            )}

            {runtime && <RowDetailsMovie label={"Thời lượng"} contents={[runtime]} />}
            {countries.length > 0 && <RowDetailsMovie label={"Quốc gia"} contents={countries} />}
            {productionCompanies.length > 0 && <RowDetailsMovie label={"Sản xuất"} contents={productionCompanies} />}
            {directors.length > 0 && <RowDetailsMovie label={"Đạo diễn"} contents={directors} />}
          </div>

          {cast.length > 0 && (
            <div className="max-xl:hidden flex flex-col">
              <div className="text-white text-xl font-bold mb-4">
                <h1>Diễn viên</h1>
              </div>
              <div className="grid grid-cols-3 justify-items-center gap-3 gap-y-6">
                {cast.map(person => (
                  <CastCol key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Info