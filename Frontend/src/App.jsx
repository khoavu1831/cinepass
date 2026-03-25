import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Movie from "./pages/Movie/Movie"
import WatchMovie from "./pages/WatchMovie/WatchMovie"
import Search from "./pages/Search/Search"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
function App() {

  return (
    <>
      <BrowserRouter basename="/cinepass">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/watch/:id" element={<WatchMovie />} />
          <Route path="/timkiem" element={<Search />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
