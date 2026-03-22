import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import MainContent from "./components/MainContent";
import Slider from "./components/Slider/Slider";
import { getHomeData } from "../../services/movieService";
import { mapSliderMovie } from "../../mappers/sliderMovieMapper";

function Home() {
  const [homeData, setHomeData] = useState({
    sliderMovies: [],
    animeSlider: [],
    koreanMovies: [],
    usukMovies: [],
    thaiMovies: [],
    cinemaMovies: [],
    topTodayMovies: [],
    thrillerMovies: [],
    animeCollection: [],
  });

  useEffect(() => {
    getHomeData().then((data) => {
      setHomeData({
        sliderMovies: data.sliderMovies.map(mapSliderMovie),
        animeSlider: data.animeSlider.map(mapSliderMovie),
        koreanMovies: data.koreanMovies.map(mapSliderMovie),
        usukMovies: data.usukMovies.map(mapSliderMovie),
        thaiMovies: data.thaiMovies.map(mapSliderMovie),
        cinemaMovies: data.cinemaMovies.map(mapSliderMovie),
        topTodayMovies: data.topTodayMovies.map(mapSliderMovie),
        thrillerMovies: data.thrillerMovies.map(mapSliderMovie),
        animeCollection: data.animeCollection.map(mapSliderMovie),
      });
    });
  }, []);

  return (
    <div className="h-full bg-[#1b1d29] xl:px-6">
      <Header />
      <Slider movies={homeData.sliderMovies} />
      <MainContent data={homeData} />
      <Footer />
    </div>
  );
}

export default Home;
