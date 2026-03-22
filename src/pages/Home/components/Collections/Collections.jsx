import Collection from "./Collection"
import CollectionTopMovie from "./CollectionTopMovie"
import { titleCollections } from "../../../../utils/seed"
import CollectionAnime from "./CollectionAnime"

function Collections({ animes, animeCollection, cinemaMovies, topTodayMovies, thrillerMovies, movies }) {
  return (
    <div className="collection gap-6 md:gap-12 flex flex-col">
      <Collection movies={cinemaMovies} titleCollection={titleCollections[0]} variant={"vertical"} />
      <CollectionAnime movies={animes} titleCollection={"Kho tàng Anime mới nhất"} variant={"vertical"} />
      <Collection movies={topTodayMovies} titleCollection={titleCollections[1]} variant={"vertical"} />
      <Collection movies={animeCollection} titleCollection={titleCollections[2]} variant={"horizontal"} />
      <CollectionTopMovie movies={topTodayMovies} titleCollection={"Top 10 phim bộ hôm nay"} />
      <Collection movies={thrillerMovies} titleCollection={titleCollections[3]} variant={"vertical"} />
      <CollectionTopMovie movies={movies} titleCollection={"Top 10 phim lẻ hôm nay"} />
      <Collection movies={cinemaMovies} titleCollection={titleCollections[4]} variant={"horizontal"} />
    </div>
  )
}

export default Collections