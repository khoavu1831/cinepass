import Collection from "./Collections/Collection"

function TopMovies({ koreanMovies, usukMovies, thaiMovies }) {
  const type = "top-movies";

  return (
    <>
      <div className="top-movies 
        flex flex-col 
        gap-6 rounded-t-2xl 
        sm:px-4 sm:mx-4 pt-5
        bg-linear-to-b from-[#2b3561]/80 to-[#1b1d29]/90"
      >
        <Collection movies={koreanMovies} titleCollection={"Phim hàn quốc mới"} variant={"horizontal"} type={type} />
        <Collection movies={usukMovies} titleCollection={"Phim USUK mới"} variant={"horizontal"} type={type} />
        <Collection movies={thaiMovies} titleCollection={"Phim thái mới"} variant={"horizontal"} type={type} />
      </div>
    </>
  )
}

export default TopMovies