import { useState, useEffect, useRef } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [importingId, setImportingId] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/movies?search=${search}&page=1&pageSize=50`);
      setMovies(res.data.data || res.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // TMDB Search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!tmdbSearchQuery.trim()) {
        setTmdbResults([]);
        return;
      }
      try {
        setIsSearchingTmdb(true);
        const res = await axiosClient.get(`/admin/tmdb/search?query=${tmdbSearchQuery}`);
        setTmdbResults(res.data.data || []);
      } catch (error) {
        toast.error("Lỗi khi tìm kiếm TMDB");
      } finally {
        setIsSearchingTmdb(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [tmdbSearchQuery]);

  const handleImport = async (tmdbId) => {
    if (!tmdbId) return;

    try {
      setImportingId(tmdbId);
      await axiosClient.post(`/admin/movies/${tmdbId}/import`);
      toast.success("Import phim thành công!");
      fetchMovies(); // refresh local list
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi import phim");
    } finally {
      setImportingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phim này?")) return;
    try {
      await axiosClient.delete(`/admin/movies/${id}`);
      toast.success("Đã xóa phim");
      fetchMovies();
    } catch (error) {
      toast.error("Lỗi khi xóa phim");
    }
  };

  // Check if a TMDB movie is already in our local list (for the current page)
  const isMovieImported = (tmdbId) => {
    return movies.some(m => m.tmdbId === tmdbId);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Phim</h1>
          <p className="text-gray-400 text-sm mt-1">Danh sách phim trong hệ thống</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-mainblue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-cloud-arrow-down"></i>
          Tìm từ TMDB
        </button>
      </div>

      <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2b3561] flex items-center justify-between">
          <div className="relative w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm phim nội bộ..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1b1d29] border border-[#2b3561] text-white text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-mainblue transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-[#1b1d29] border-b border-[#2b3561]">
              <tr>
                <th className="px-6 py-4 font-medium">Phim</th>
                <th className="px-6 py-4 font-medium">Năm</th>
                <th className="px-6 py-4 font-medium">Thể loại</th>
                <th className="px-6 py-4 font-medium text-center">Đánh giá</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                    <p>Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy phim nào.
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id} className="border-b border-[#2b3561] hover:bg-[#1b1d29] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={movie.posterUrl || `https://image.tmdb.org/t/p/w92${movie.posterPath}`} 
                          alt={movie.title} 
                          className="w-10 h-14 object-cover rounded shadow-sm bg-gray-800"
                          onError={(e) => e.target.src = '/movie.svg'}
                        />
                        <div>
                          <div className="font-semibold text-white truncate max-w-xs" title={movie.title}>{movie.title}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{movie.localTitle || movie.originalTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</td>
                    <td className="px-6 py-4 truncate max-w-xs" title={movie.genres?.join(", ") || movie.genreNames}>{movie.genres?.join(", ") || movie.genreNames}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-amber-500/20 text-amber-400 py-1 px-2 rounded-md font-semibold text-xs border border-amber-500/30">
                        <i className="fa-solid fa-star mr-1"></i> {movie.ratingAvg > 0 ? movie.ratingAvg : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(movie.id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Xóa"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-[#2b3561] flex items-center justify-between text-sm text-gray-400">
          <span>Hiển thị 50 phim</span>
        </div>
      </div>

      {/* TMDB Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1b1d29] border border-[#2b3561] rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-[#2b3561]">
              <h2 className="text-xl font-bold text-white">Tìm kiếm từ TMDB</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-5">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Nhập tên phim (tiếng Anh hoặc tiếng Việt)..." 
                  value={tmdbSearchQuery}
                  onChange={(e) => setTmdbSearchQuery(e.target.value)}
                  className="w-full bg-[#0f111a] border border-[#2b3561] text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-mainblue transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pt-0">
              {isSearchingTmdb ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-4 text-mainblue"></i>
                  <p>Đang tìm kiếm...</p>
                </div>
              ) : tmdbResults.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {tmdbSearchQuery ? "Không tìm thấy kết quả nào." : "Hãy gõ tên phim để bắt đầu tìm kiếm."}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tmdbResults.map((result) => {
                    const isImported = isMovieImported(result.tmdbId);
                    const isImportingThis = importingId === result.tmdbId;

                    return (
                      <div key={result.tmdbId} className="bg-[#0f111a] border border-[#2b3561] rounded-xl p-3 flex gap-4 hover:border-[#3b4781] transition-colors">
                        <img 
                          src={result.posterUrl || '/movie.svg'} 
                          alt={result.title} 
                          className="w-16 h-24 object-cover rounded shadow-md bg-gray-800"
                          onError={(e) => e.target.src = '/movie.svg'}
                        />
                        <div className="flex flex-col flex-1 justify-center">
                          <h3 className="font-bold text-white text-sm line-clamp-2" title={result.title}>{result.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 mb-3">
                            <span>{result.year || 'N/A'}</span>
                            <span className="flex items-center gap-1 text-amber-400">
                              <i className="fa-solid fa-star"></i> {result.rating ? result.rating.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleImport(result.tmdbId)}
                            disabled={isImported || isImportingThis}
                            className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                              isImported 
                                ? "bg-[#2b3561]/50 text-gray-400 cursor-not-allowed" 
                                : "bg-mainblue hover:bg-blue-600 text-white"
                            }`}
                          >
                            {isImportingThis ? (
                              <><i className="fa-solid fa-spinner fa-spin"></i> Đang tải...</>
                            ) : isImported ? (
                              <><i className="fa-solid fa-check"></i> Đã thêm</>
                            ) : (
                              <><i className="fa-solid fa-download"></i> Import vào kho</>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManagement;
