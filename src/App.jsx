import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Movie from "./pages/Movie/Movie"
import WatchMovie from "./pages/WatchMovie/WatchMovie"
import Search from "./pages/Search/Search"
import { Toaster } from "react-hot-toast"

// Admin imports
import AdminLogin from "./admin/pages/Login"
import AdminDashboard from "./admin/pages/Dashboard"
import AdminLayout from "./admin/components/AdminLayout"
import AdminGuard from "./admin/components/AdminGuard"
import UserManagement from "./admin/pages/UserManagement"
import MovieManagement from "./admin/pages/MovieManagement"
import CollectionManagement from "./admin/pages/CollectionManagement"

function App() {

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter basename="/cinepass">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/watch/:id" element={<WatchMovie />} />
          <Route path="/search" element={<Search />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/movies" element={<MovieManagement />} />
              <Route path="/admin/collections" element={<CollectionManagement />} />
              {/* <Route path="/admin/settings" element={<Settings />} /> */}
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
