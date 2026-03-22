import Collections from "./Collections/Collections"
import Ranking from "./Ranking/Ranking"
import TopMovies from "./TopMovies"

function MainContent({ data }) {
  const { koreanMovies, usukMovies, thaiMovies, cinemaMovies, topTodayMovies, thrillerMovies, animeCollection, animeSlider, sliderMovies } = data;

  return (
    <>
      <div className="h-full max-sm:pb-20 md:pb-24 lg:pb-40 gap-4 flex flex-col">
        <div className="top-movies">
          <TopMovies koreanMovies={koreanMovies} usukMovies={usukMovies} thaiMovies={thaiMovies} />
        </div>

        <div className="ranking">
          <Ranking movies={sliderMovies} />
        </div>

        <div className="collections">
          <Collections
            animes={animeSlider}
            animeCollection={animeCollection}
            cinemaMovies={cinemaMovies}
            topTodayMovies={topTodayMovies}
            thrillerMovies={thrillerMovies}
            movies={sliderMovies}
          />
        </div>
      </div>
    </>
  )
}

export default MainContent