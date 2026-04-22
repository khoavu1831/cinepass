import Collection from "./Collections/Collection"
import CollectionTopMovie from "./Collections/CollectionTopMovie"
import CollectionAnime from "./Collections/CollectionAnime"
import Ranking from "./Ranking/Ranking"

function MainContent({ collections, rankingMovies }) {
  return (
    <>
      <div className="h-full max-sm:pb-20 md:pb-24 lg:pb-40 gap-4 flex flex-col pt-5">
        
        {/* Loop through all dynamic collections */}
        {collections.map((collection, index) => {
          let ComponentToRender = null;

          if (collection.type === "top_movies") {
            ComponentToRender = (
              <div className="top-movies flex flex-col gap-6 sm:px-4 sm:mx-4 pt-5 bg-linear-to-b from-[#2b3561]/20 to-transparent rounded-t-2xl">
                <CollectionTopMovie 
                  movies={collection.movies} 
                  titleCollection={collection.title} 
                  type="top-movies" 
                />
              </div>
            );
          } else if (collection.type === "anime_slider") {
            ComponentToRender = (
              <CollectionAnime 
                movies={collection.movies} 
                titleCollection={collection.title} 
              />
            );
          } else {
            const variant = collection.type === "standard_vertical" ? "vertical" : "horizontal";
            ComponentToRender = (
              <Collection 
                movies={collection.movies} 
                titleCollection={collection.title} 
                variant={variant} 
              />
            );
          }

          return (
            <div key={collection.id} className="collection-wrapper flex flex-col gap-6">
              {ComponentToRender}
              
              {/* Insert Ranking after the first collection if available */}
              {index === 0 && rankingMovies && rankingMovies.length > 0 && (
                <div className="ranking mt-6">
                  <Ranking movies={rankingMovies} />
                </div>
              )}
            </div>
          );
        })}

        {/* Fallback if collections is empty but we still have ranking */}
        {collections.length === 0 && rankingMovies && rankingMovies.length > 0 && (
           <div className="ranking mt-6">
             <Ranking movies={rankingMovies} />
           </div>
        )}
      </div>
    </>
  )
}

export default MainContent