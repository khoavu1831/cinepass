import { Link } from "react-router-dom"
import { TMDB_IMAGE_URL } from "../../../../../api/tmdb"

function ItemVersion({ movie, subTitle, icon, hexColor }) {
  const posterSrc = movie?.poster_path
    ? `${TMDB_IMAGE_URL}/w342${movie.poster_path}`
    : null;

  return (
    <>
      <Link
        to={`/watch/${movie?.id ?? ""}`}
        className={`relative item flex max-h-72 rounded-xl overflow-hidden`}
        style={{ backgroundColor: hexColor }}
      >
        <div className="flex flex-col p-4 text-white gap-2 z-10 relative">
          <div className="flex items-center text-[14px]">
            <i className={`fa-solid ${icon} mr-2`}></i>
            <span>{subTitle}</span>
          </div>

          <div className="title text-[18px] font-semibold mb-2">
            <span>{movie?.title ?? "--"}</span>
          </div>

          <div className="btn">
            <button className="text-[12px] text-black bg-white py-1.25 px-2.5 rounded">Xem bản này</button>
          </div>
        </div>

        {posterSrc && (
          <div className="cover-img absolute top-0 right-0 h-full object-fit">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(to right, ${hexColor}, transparent)` }}
            ></div>
            <img
              src={posterSrc}
              className="w-full h-full object-cover"
              alt={movie?.title}
            />
          </div>
        )}
      </Link>
    </>
  )
}

export default ItemVersion