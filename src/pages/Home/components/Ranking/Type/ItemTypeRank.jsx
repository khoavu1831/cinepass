import { Link } from "react-router-dom";

function ItemTypeRank({ states, index, isModal, movie }) {
  let icon = "";
  let color = "";
  let state = states[index];

  if (state === "minus") {
    icon = "fa-minus"
    color = "text-gray-700"
  } else if (state === "up") {
    icon = "fa-arrow-trend-up"
    color = "text-green-400"
  } else {
    icon = "fa-arrow-trend-down"
    color = "text-red-500"
  }

  return (
    <>
      <div className="px-1">
        <div className="flex items-center gap-6">
          {/* Ordinal number */}
          <span className={`w-6 text-[16px] ${isModal ? "text-right" : ""} shrink-0 font-bold text-gray-500`}>{index}.</span>

          {/* Icon trend  */}
          <span className="max-sm:hidden">
            <i className={`fa-solid ${icon} ${color} text-[14px]`}></i>
          </span>

          {/* Image movie */}
          <div className={`cover-img shrink-0 ${isModal ? "h-14 w-10" : "h-8 w-7"} mb-2`}>
            <img
              className="w-full h-full object-cover"
              src={movie.poster}
            />
          </div>

          {/* Name movie */}
          <div className="line-clamp-1 max-sm:line-clamp-2 text-[14px]">
            <Link
              className="hover:text-mainblue"
              to={`/movie/${movie.id}`}
            >
              {movie.title}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default ItemTypeRank