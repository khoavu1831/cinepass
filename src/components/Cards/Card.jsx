import { Link } from "react-router-dom";
import ModalCard from "./ModalCard";

function Card({ movie, variant, type }) {
  const isVertical = variant === "vertical";
  const isTopMovies = type === "top-movies";

  return (
    <>
      {/* Card */}
      <div className="w-full cursor-pointer">
        <div className="flex flex-col">

          {/* Image */}
          <div className="group relative">
            <Link
              to={`/movie/${movie.id}`}
              className={`relative block transistion duration-700 lg:group-hover:blur-[2px] ${isVertical ? "aspect-2/3" : "aspect-2/1"} `}>
              <img
                src={`${isVertical ? movie.avatar : movie.poster}`}
                className="h-full w-full object-cover rounded-xl"
              />
              {/* Subtitle & Dub */}
              <div
                className={`
                  container-sub text-white absolute text-[9px] sm:text-[12px] flex sm:w-full max-sm:flex-col gap-1 bottom-0 max-sm:pl-2 max-sm:pb-2 
                  ${isVertical ? "justify-center" : "pl-5"}
                  ${isTopMovies ? "lg:group-hover:hidden" : ""}`
                }
              >
                <span className="max-sm:p-[1px_8px] p-[3px_8px] rounded-xl sm:rounded bg-gray-500">
                  PĐ.
                  <strong>{movie.subtitle}</strong>
                </span>
                <span className="max-sm:p-[1px_8px] p-[3px_8px] rounded-xl sm:rounded bg-blue-400">
                  TM.
                  <strong>{movie.dub}</strong>
                </span>
                {/* <span className="max-sm:p-[1px_8px] p-[3px_8px] rounded-xl sm:rounded bg-gray-500">
                  P.Đề
                  <strong>{movie.dub}</strong>
                </span>
                <span className="max-sm:p-[1px_8px] p-[3px_8px] rounded-xl sm:rounded bg-blue-400">
                  L.Tiếng
                  <strong>{movie.dub}</strong>
                </span> */}
              </div>
            </Link>

            {/* Modal hover */}
            <div
              className={`
                hidden lg:block
                absolute w-full h-full
                pointer-events-nones
                opacity-0 z-9999
                transition-opacity duration-1000 ease-in-out
                group-hover:opacity-100
                lg:group-hover:animate-modal-fadein
                rounded-xl overflow-hidden
                left-0 top-0
              `}
            >
              <ModalCard m={movie} isVertical={isVertical} isTopMovies={isTopMovies} />
            </div>

            {/* Content */}
            <div className={`content flex flex-col text-white pt-4 ${isVertical ? "text-center" : "max-md:text-center"}`}>
              <h4 className="text-[13px] truncate">{movie.title}</h4>
              <h4 className="text-[13px] text-gray-400 truncate">{movie.subTitle}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Card