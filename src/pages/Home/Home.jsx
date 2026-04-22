import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import MainContent from "./components/MainContent";
import Slider from "./components/Slider/Slider";
import { getHomeData } from "../../services/movieService";
import { mapSliderMovie } from "../../mappers/sliderMovieMapper";

function Home() {
  const [homeData, setHomeData] = useState({
    collections: [],
    rankingMovies: [],
  });

  useEffect(() => {
    getHomeData().then((data) => {
      setHomeData({
        collections: data.collections,
        rankingMovies: data.rankingMovies.map(mapSliderMovie),
      });
    });
  }, []);

  const heroSliderMovies = homeData.collections.find(c => c.type === 'hero_slider')?.movies || [];
  const otherCollections = homeData.collections.filter(c => c.type !== 'hero_slider');

  return (
    <div className="h-full bg-[#1b1d29] xl:px-6">
      <Header />
      <Slider movies={heroSliderMovies} />
      <MainContent collections={otherCollections} rankingMovies={homeData.rankingMovies} />
      <Footer />
    </div>
  );
}

export default Home;
