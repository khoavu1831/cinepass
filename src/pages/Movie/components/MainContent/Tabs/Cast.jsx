import { TMDB_IMAGE_URL } from "../../../../../api/tmdb";

function Cast({ person }) {
  const imageSrc = person?.profile_path
    ? `${TMDB_IMAGE_URL}/w185${person.profile_path}`
    : "https://placehold.co/185x278/1b1d29/666?text=N%2FA";

  return (
    <>
      <div className="relative">
        <div className="cover-img relative w-full overflow-hidden rounded-xl">
          <img
            className="h-full w-full object-cover aspect-2/3"
            src={imageSrc}
            alt={person?.name}
          />
          <div className="absolute inset-0 bg-linear-0 from-[#1b1d29] to-30%"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center -mt-11 w-full gap-0.5">
          <div className="w-full line-clamp-1 text-center px-2 text-white font-light text-[14px]">
            <span>{person?.name ?? "--"}</span>
          </div>

          <div className="w-full bg-[#1b1d29] text-center line-clamp-1 text-mainblue font-light text-[12px] px-2">
            <span>{person?.character ?? ""}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cast