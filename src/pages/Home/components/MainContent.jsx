import Collection from "./Collections/Collection"
import CollectionTop10 from "./Collections/CollectionTop10"
import CollectionAnime from "./Collections/CollectionAnime"
import Ranking from "./Ranking/Ranking"

function MainContent({ collections, rankingMovies }) {
  // Group consecutive 'top_movies' collections
  const groupedCollections = [];
  let currentTopMoviesGroup = [];

  collections.forEach((collection) => {
    if (collection.type === "top_movies") {
      currentTopMoviesGroup.push(collection);
    } else {
      if (currentTopMoviesGroup.length > 0) {
        groupedCollections.push({ isTopMoviesGroup: true, items: currentTopMoviesGroup });
        currentTopMoviesGroup = [];
      }
      groupedCollections.push({ isTopMoviesGroup: false, item: collection });
    }
  });

  if (currentTopMoviesGroup.length > 0) {
    groupedCollections.push({ isTopMoviesGroup: true, items: currentTopMoviesGroup });
  }

  let globalIndex = 0; // to keep track of the first collection for inserting ranking

  return (
    <>
      <div className="h-full max-sm:pb-20 md:pb-24 lg:pb-40 gap-4 flex flex-col pt-5">
        
        {/* Loop through grouped dynamic collections */}
        {groupedCollections.map((group, groupIdx) => {
          if (group.isTopMoviesGroup) {
            const firstIndexInGroup = globalIndex;
            globalIndex += group.items.length;
            
            return (
              <div key={`group-${groupIdx}`} className="collection-wrapper flex flex-col gap-6">
                <div className="top-movies flex flex-col gap-6 rounded-t-2xl sm:px-4 sm:mx-4 pt-5 bg-linear-to-b from-[#2b3561]/80 to-[#1b1d29]/90 pb-8">
                  {group.items.map(collection => (
                    <Collection 
                      key={collection.id}
                      movies={collection.movies} 
                      titleCollection={collection.title} 
                      variant="horizontal"
                      type="top-movies" 
                    />
                  ))}
                </div>
                
                {/* Insert Ranking after the first collection if available */}
                {firstIndexInGroup === 0 && rankingMovies && rankingMovies.length > 0 && (
                  <div className="ranking mt-6">
                    <Ranking movies={rankingMovies} />
                  </div>
                )}
              </div>
            );
          } else {
            const collection = group.item;
            const currentIndex = globalIndex;
            globalIndex += 1;

            let ComponentToRender = null;

            if (collection.type === "top_10") {
              ComponentToRender = (
                <div className="top-10-movies pt-5">
                  <CollectionTop10 
                    movies={collection.movies} 
                    titleCollection={collection.title} 
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
                {currentIndex === 0 && rankingMovies && rankingMovies.length > 0 && (
                  <div className="ranking mt-6">
                    <Ranking movies={rankingMovies} />
                  </div>
                )}
              </div>
            );
          }
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