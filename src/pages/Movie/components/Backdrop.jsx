import { TMDB_IMAGE_URL } from "../../../api/tmdb";

function Backdrop({ movie }) {
  const backdropUrl = movie?.backdrop_path
    ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}`
    : "https://static.nutscdn.com/vimg/1920-0/1d83e95bbd7b059d7e0886701bc81043.webp";

  return (
    <>
      <div
        className="bg-cover opacity-80 h-50 sm:h-75 xl:h-144 w-full relative z-0"
        style={{ backgroundImage: `url('${backdropUrl}')` }}
      >
        <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#1b1d29] max-lg:via-[#1b1d29]/80 lg:via-[#1b1d29]/30"></div>

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.9]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
                  `,
            backgroundSize: "3px 3px",
            mixBlendMode: "overlay"
          }}
        ></div>
      </div>
    </>
  )
}

export default Backdrop