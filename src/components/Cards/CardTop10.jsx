import { Link } from "react-router-dom";
import TopSliderAnime from "../../pages/Home/components/Slider/TopSliderAnime";
import ModalCardTop10 from "./ModalCardTop10";

function CardTop10({ movie, index }) {
  const isEven = index % 2 === 0;

  return (
    <>
      {/* Card */}
      <div className="w-full">
        <div className="flex flex-col">
          {/* Image */}

          {/* Thumbnail */}
          <div className="group relative w-full">

            {/* Cover image */}
            <div className="aspect-2/3 rounded-xl">
              <div className={`
                  ${isEven ? "skew-y-6 origin-top-left" : "-skew-y-6 origin-bottom-right"} 
                  overflow-hidden rounded-xl 
                  transition-all duration-400
                  group-hover:bg-mainblue
                  `}
              >
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={movie.avatar}
                    className={`
                      ${isEven ? "-skew-y-6 origin-top-left group-hover:skew-y-6" : "skew-y-6 origin-bottom-right group-hover:-skew-y-6"} 
                      h-full w-full object-cover rounded-xl
                      transition-all duration-400 
                      `}
                  />
                </Link>
              </div>

              {/* Modal hover */}
              <div
                className={`
                  absolute top-10 w-full
                  pointer-events-none
                  opacity-0 z-9999
                  group-hover:opacity-100
                  rounded-2xl overflow-hidden
                  ${isEven
                    ? "left-0 group-hover:animate-modal-right"
                    : "right-0 group-hover:animate-modal-left"
                  }  
                `}
              >
                <ModalCardTop10 m={movie} index={index} />
              </div>
            </div>

            {/* Subtitle & Dub */}
            <div className={`container-sub text-white absolute text-[9px] sm:text-[12px] flex sm:w-full max-sm:flex-col gap-1 bottom-0 max-sm:pl-2 max-sm:pb-2 justify-center`}>
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
          </div>

          {/* Context */}
          <div className="flex pt-4">
            <span className="
            text-[28px] pr-2 -mt-2 font-bold italic
            bg-linear-to-b from-white/70 to-mainblue bg-clip-text text-transparent"
            >
              {index + 1}
            </span>
            <div className="right-context flex flex-col max-w-[80%]">
              <span className="text-[13px] text-white truncate w-full">{movie.title}</span>
              <span className="text-[13px] text-gray-400 truncate">{movie.subTitle}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default CardTop10