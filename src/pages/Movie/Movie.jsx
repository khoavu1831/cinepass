import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import Main from "./components/Main";
import { getMovieDetails } from "../../services/movieService";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetails(id)
      .then((data) => setMovie(data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <Main movie={movie} loading={loading} />
      <Footer />
    </>
  );
}

export default Movie;