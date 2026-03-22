import { TMDB_IMAGE_URL } from "../../../../../api/tmdb";

function CastCol({ person }) {
  const avatarUrl = person?.profile_path
    ? `${TMDB_IMAGE_URL}/w185${person.profile_path}`
    : "https://via.placeholder.com/185x185?text=N%2FA";

  return (
    <div className="flex flex-col justify-items items-center gap-1">
      <div className="h-20 w-20">
        <img
          className="h-full w-full object-cover rounded-full"
          src={avatarUrl}
          alt={person?.name ?? "cast"}
        />
      </div>

      <div className="text-center">
        <span className="text-[12px] text-white">{person?.name ?? ""}</span>
      </div>
    </div>
  )
}

export default CastCol