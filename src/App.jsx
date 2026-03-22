import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Movie from "./pages/Movie/Movie"
import WatchMovie from "./pages/WatchMovie/WatchMovie"
function App() {

  return (
    <>
      <BrowserRouter basename="/rophim_fake">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/watch/:id" element={<WatchMovie />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
