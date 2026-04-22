import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("standard_horizontal");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  // Inside Modal - Movies management
  const [collectionMovies, setCollectionMovies] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearchingLocal, setIsSearchingLocal] = useState(false);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/collections");
      setCollections(res.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách Collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCollection(null);
    setTitle("");
    setDescription("");
    setType("standard_horizontal");
    setThumbnailUrl("");
    setDisplayOrder(collections.length > 0 ? Math.max(...collections.map(c => c.displayOrder)) + 1 : 0);
    setCollectionMovies([]);
    setIsModalOpen(true);
  };

  const openEditModal = (collection) => {
    setEditingCollection(collection);
    setTitle(collection.title);
    setDescription(collection.description || "");
    setType(collection.type);
    setThumbnailUrl(collection.thumbnailUrl || "");
    setDisplayOrder(collection.displayOrder);
    setCollectionMovies(collection.movies || []);
    setIsModalOpen(true);
  };

  const handleSaveCollection = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Vui lòng nhập tên Collection");
      return;
    }

    try {
      const payload = { title, description, type, thumbnailUrl, displayOrder };
      if (editingCollection) {
        await axiosClient.put(`/admin/collections/${editingCollection.id}`, payload);
        toast.success("Cập nhật thành công");
      } else {
        await axiosClient.post("/admin/collections", payload);
        toast.success("Tạo mới thành công");
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu Collection");
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa Collection này?")) return;
    try {
      await axiosClient.delete(`/admin/collections/${id}`);
      toast.success("Xóa Collection thành công");
      fetchCollections();
    } catch (error) {
      toast.error("Lỗi khi xóa Collection");
    }
  };

  // Local Movie Search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!localSearchQuery.trim()) {
        setLocalSearchResults([]);
        return;
      }
      try {
        setIsSearchingLocal(true);
        const res = await axiosClient.get(`/movies?search=${localSearchQuery}&page=1&pageSize=10`);
        setLocalSearchResults(res.data.data || res.data || []);
      } catch (error) {
        toast.error("Lỗi khi tìm kiếm phim nội bộ");
      } finally {
        setIsSearchingLocal(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery]);

  const handleAddMovieToCollection = async (movie) => {
    if (!editingCollection) {
      toast.error("Vui lòng lưu Collection trước khi thêm phim");
      return;
    }

    if (collectionMovies.some(m => m.id === movie.id)) {
      toast.error("Phim đã có trong Collection");
      return;
    }

    try {
      await axiosClient.post(`/admin/collections/${editingCollection.id}/movies`, { movieId: movie.id });
      setCollectionMovies([...collectionMovies, movie]);
      toast.success("Thêm phim thành công");
      fetchCollections(); // Background update
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm phim");
    }
  };

  const handleRemoveMovieFromCollection = async (movieId) => {
    if (!editingCollection) return;

    try {
      await axiosClient.delete(`/admin/collections/${editingCollection.id}/movies/${movieId}`);
      setCollectionMovies(collectionMovies.filter(m => m.id !== movieId));
      toast.success("Xóa phim thành công");
      fetchCollections(); // Background update
    } catch (error) {
      toast.error("Lỗi khi xóa phim");
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination || !editingCollection) return;

    const items = Array.from(collectionMovies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCollectionMovies(items);

    try {
      const movieIds = items.map(item => item.id);
      await axiosClient.put(`/admin/collections/${editingCollection.id}/reorder`, { movieIds });
      toast.success("Cập nhật thứ tự thành công");
      fetchCollections(); // Background update
    } catch (error) {
      toast.error("Lỗi khi cập nhật thứ tự");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Collections</h1>
          <p className="text-gray-400 text-sm mt-1">Danh sách phim hiển thị ngoài trang chủ</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="bg-mainblue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Tạo Collection mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">
          <i className="fa-solid fa-circle-notch fa-spin text-4xl text-mainblue"></i>
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-10 text-center text-gray-500">
          Chưa có Collection nào. Hãy tạo mới để hiển thị trên trang chủ.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collections.map(collection => (
            <div key={collection.id} className="bg-[#0f111a] border border-[#2b3561] rounded-2xl overflow-hidden flex flex-col hover:border-[#3b4781] transition-colors shadow-lg">
              <div className="p-5 border-b border-[#2b3561] flex justify-between items-start bg-[#1b1d29]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{collection.title}</h3>
                    <span className="bg-mainblue/20 text-mainblue text-xs font-semibold px-2 py-0.5 rounded border border-mainblue/30">
                      {collection.type}
                    </span>
                  </div>
                  {collection.description && <p className="text-sm text-gray-400 line-clamp-1">{collection.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(collection)}
                    className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center"
                    title="Chỉnh sửa"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="w-8 h-8 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                    title="Xóa"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="text-sm font-medium text-gray-300 mb-3 flex justify-between">
                  <span>Phim trong Collection ({collection.movies?.length || 0})</span>
                  <span>Thứ tự: {collection.displayOrder}</span>
                </div>
                {collection.movies && collection.movies.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {collection.movies.map(movie => (
                      <div key={movie.id} className="min-w-[80px] w-[80px] flex flex-col gap-1">
                        <img 
                          src={movie.posterUrl || `https://image.tmdb.org/t/p/w154${movie.posterPath}`} 
                          alt={movie.title} 
                          className="w-full h-[120px] object-cover rounded bg-gray-800"
                          onError={(e) => e.target.src = '/movie.svg'}
                        />
                        <span className="text-[10px] text-gray-400 truncate text-center">{movie.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic py-4">Chưa có phim nào.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1b1d29] border border-[#2b3561] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#2b3561]">
              <h2 className="text-xl font-bold text-white">
                {editingCollection ? `Chỉnh sửa Collection: ${editingCollection.title}` : "Tạo Collection mới"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              {/* Left Column: Form Info */}
              <div className="lg:w-1/3 p-5 border-b lg:border-b-0 lg:border-r border-[#2b3561] overflow-y-auto bg-[#0f111a]">
                <form onSubmit={handleSaveCollection} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Tên Collection *</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-[#1b1d29] border border-[#2b3561] text-white rounded-lg py-2 px-3 focus:outline-none focus:border-mainblue transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Mô tả ngắn</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="bg-[#1b1d29] border border-[#2b3561] text-white rounded-lg py-2 px-3 focus:outline-none focus:border-mainblue transition-all resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Loại hiển thị</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="bg-[#1b1d29] border border-[#2b3561] text-white rounded-lg py-2 px-3 focus:outline-none focus:border-mainblue transition-all"
                    >
                      <option value="standard_horizontal">Standard Horizontal (Carousel)</option>
                      <option value="standard_vertical">Standard Vertical (List)</option>
                      <option value="top_movies">Top Movies (Numbered)</option>
                      <option value="hero_slider">Hero Slider (Banners)</option>
                      <option value="anime_slider">Anime Slider (2 Rows)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Thứ tự hiển thị (Homepage)</label>
                    <input 
                      type="number" 
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                      className="bg-[#1b1d29] border border-[#2b3561] text-white rounded-lg py-2 px-3 focus:outline-none focus:border-mainblue transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Banner / Thumbnail URL</label>
                    <input 
                      type="text" 
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="bg-[#1b1d29] border border-[#2b3561] text-white rounded-lg py-2 px-3 focus:outline-none focus:border-mainblue transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-mainblue hover:bg-blue-600 text-white font-semibold rounded-lg py-2.5 mt-2 transition-all shadow-lg shadow-blue-500/25"
                  >
                    Lưu cấu hình
                  </button>
                </form>
              </div>

              {/* Right Column: Movies Management */}
              <div className="lg:w-2/3 flex flex-col overflow-hidden relative">
                {!editingCollection ? (
                  <div className="absolute inset-0 bg-[#1b1d29]/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div className="bg-[#0f111a] border border-[#2b3561] p-6 rounded-xl text-center shadow-2xl">
                      <i className="fa-solid fa-lock text-3xl text-gray-500 mb-3"></i>
                      <h3 className="font-semibold text-white">Vui lòng lưu Collection trước</h3>
                      <p className="text-sm text-gray-400 mt-1">Sau khi tạo, bạn có thể thêm phim vào danh sách.</p>
                    </div>
                  </div>
                ) : null}

                {/* Local Search */}
                <div className="p-4 border-b border-[#2b3561] bg-[#1b1d29]">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-300">Thêm phim (Tìm kiếm trong kho)</label>
                    <div className="relative">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input 
                        type="text" 
                        placeholder="Tìm phim theo tên..." 
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        className="w-full bg-[#0f111a] border border-[#2b3561] text-white text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-mainblue transition-all"
                      />
                    </div>
                    {/* Search Results Dropdown */}
                    {localSearchQuery.trim() && (
                      <div className="absolute left-4 right-4 top-[80px] z-20 max-h-60 overflow-y-auto bg-[#2b3561] border border-gray-600 rounded-lg shadow-2xl">
                        {isSearchingLocal ? (
                          <div className="p-3 text-center text-sm text-gray-400">Đang tìm...</div>
                        ) : localSearchResults.length === 0 ? (
                          <div className="p-3 text-center text-sm text-gray-400">Không tìm thấy phim.</div>
                        ) : (
                          <div className="flex flex-col">
                            {localSearchResults.map(movie => {
                              const alreadyAdded = collectionMovies.some(m => m.id === movie.id);
                              return (
                                <div 
                                  key={movie.id} 
                                  className="flex items-center gap-3 p-2 hover:bg-[#3b4781] transition-colors border-b border-gray-700/50 last:border-0"
                                >
                                  <img 
                                    src={movie.posterUrl || `https://image.tmdb.org/t/p/w92${movie.posterPath}`} 
                                    className="w-8 h-12 object-cover rounded bg-gray-800"
                                    alt=""
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm text-white font-medium line-clamp-1">{movie.title}</div>
                                    <div className="text-xs text-gray-400">{movie.releaseDate?.substring(0,4)}</div>
                                  </div>
                                  <button
                                    disabled={alreadyAdded}
                                    onClick={() => handleAddMovieToCollection(movie)}
                                    className={`px-3 py-1 text-xs font-semibold rounded ${
                                      alreadyAdded ? "bg-gray-600 text-gray-400" : "bg-mainblue hover:bg-blue-600 text-white"
                                    }`}
                                  >
                                    {alreadyAdded ? "Đã thêm" : "Thêm"}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Draggable List */}
                <div className="flex-1 p-4 overflow-y-auto bg-[#1b1d29]">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    Danh sách phim ({collectionMovies.length}) <span className="text-xs text-gray-500 font-normal ml-2">Kéo thả để sắp xếp</span>
                  </h3>
                  
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="movies">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
                          {collectionMovies.map((movie, index) => (
                            <Draggable key={movie.id.toString()} draggableId={movie.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center gap-4 bg-[#0f111a] border border-[#2b3561] p-3 rounded-xl ${
                                    snapshot.isDragging ? "shadow-lg shadow-mainblue/20 border-mainblue" : ""
                                  }`}
                                >
                                  <div {...provided.dragHandleProps} className="text-gray-500 cursor-grab hover:text-white px-2">
                                    <i className="fa-solid fa-grip-vertical"></i>
                                  </div>
                                  <div className="w-6 text-center font-bold text-gray-500 text-sm">
                                    {index + 1}
                                  </div>
                                  <img 
                                    src={movie.posterUrl || `https://image.tmdb.org/t/p/w92${movie.posterPath}`} 
                                    className="w-10 h-14 object-cover rounded bg-gray-800"
                                    alt=""
                                  />
                                  <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">{movie.title}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">{movie.releaseDate?.substring(0,4)} • {movie.genres?.join(", ") || movie.genreNames}</p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveMovieFromCollection(movie.id)}
                                    className="w-8 h-8 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {collectionMovies.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                      Collection này chưa có phim. Sử dụng thanh tìm kiếm ở trên để thêm phim vào.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionManagement;
