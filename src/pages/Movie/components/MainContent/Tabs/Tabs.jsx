import { useEffect, useState } from "react"
import Tab from "./Tab"
import ItemVersion from "./ItemVersion"
import Cast from "./Cast"
import Card from "../../../../../components/Cards/Card"
import { fetchTopTodayMovies } from "../../../../../services/movieService"
import { mapSliderMovie } from "../../../../../mappers/sliderMovieMapper"
import { Link } from "react-router-dom"
import ItemComment from "./ItemComment"
import { TMDB_IMAGE_URL } from "../../../../../api/tmdb"

function Tabs({ movie, isWatch }) {
  const [active, setActive] = useState("episodes");
  const [suggestMovies, setSuggestMovies] = useState([]);
  const [isPlayVideo, setIsPlayVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isActiveCommentBtn, setIsActiveCommentBtn] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [text, setText] = useState("");

  const MAX_TEXT_LENGTH = 1000;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_TEXT_LENGTH) {
      setText(value);
    }
  };

  useEffect(() => {
    fetchTopTodayMovies().then(data => {
      const mapped = (data.results ?? []).map(mapSliderMovie);
      setSuggestMovies(mapped);
    });
  }, []);

  const cast = movie?.credits?.cast ?? [];
  const trailers = (movie?.videos?.results ?? []).filter(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")).slice(0, 8);
  const backdrops = (movie?.images?.backdrops ?? []).slice(0, 12);
  const posters = (movie?.images?.posters ?? []).slice(0, 6);

  return (
    <>
      <div className={`${isWatch ? "hidden" : ""} tabs max-xl:bg-linear-0 from-gray-400/18 to-90% -mx-4 px-4 xl:px-10`}>
        <div className="flex justify-start max-xl:justify-center gap-6 text-[13px] text-white">
          <Tab id="episodes" active={active} setActive={setActive} />
          <Tab id="gallery" active={active} setActive={setActive} />
          <Tab id="cast" active={active} setActive={setActive} />
          <Tab id="suggest" active={active} setActive={setActive} />
        </div>
      </div>

      {active === "episodes" && (
        <div className="versions mb-15">
          <div className="heading py-6">
            <h1 className="text-white text-xl font-bold">Các bản chiếu</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ItemVersion movie={movie} subTitle={"Phụ đề"} icon={"fa-closed-captioning"} hexColor={"#726d6d"} />
            <ItemVersion movie={movie} subTitle={"Thuyết minh giọng Nam"} icon={"fa-microphone"} hexColor={"#297447"} />
          </div>
        </div>
      )}

      {active === "gallery" && (
        <div className="versions mb-15">

          <div className="videos">
            <div className="heading py-6">
              <h1 className="text-white text-[18px] font-medium">Videos</h1>
            </div>

            {trailers.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {trailers.map(video => (
                  <div key={video.id} className="wrapper-video">
                    <div
                      className="video flex justify-center items-center w-full aspect-video border border-gray-400 cursor-pointer relative overflow-hidden rounded-lg"
                      onClick={() => { setActiveVideo(video.key); setIsPlayVideo(true); }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        alt={video.name}
                      />
                      <button className="relative w-10 h-10 rounded-full border-gray-400 border bg-black/50">
                        <i className="fa-solid fa-play text-white"></i>
                      </button>
                    </div>

                    <div className="context-video py-2 text-white text-[13px] line-clamp-1">
                      <span>{video.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-[14px]">Chưa có video nào.</p>
            )}

            {isPlayVideo && activeVideo && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#1b1d29]/80 px-4">
                <div className="relative flex justify-center items-center w-full md:max-w-180 bg-mainblue p-2 rounded-2xl aspect-video">
                  <button
                    onClick={() => { setIsPlayVideo(false); setActiveVideo(null); }}
                    className="cursor-pointer absolute -top-4 -right-4 flex justify-center items-center text-black text-[16px] h-9 w-9 rounded-full bg-white z-10"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                      title="Movie Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="images xl:max-w-280 mt-6">
            <div className="heading py-1">
              <h1 className="text-white text-[18px] font-medium">Hình ảnh</h1>
            </div>

            {backdrops.length > 0 ? (
              <div className="columns-2 md:columns-3 gap-2 w-full space-y-2">
                {backdrops.map(img => (
                  <div key={img.file_path} className="break-inside-avoid">
                    <img
                      className="w-full h-full rounded-sm"
                      src={`${TMDB_IMAGE_URL}/w780${img.file_path}`}
                      alt=""
                    />
                  </div>
                ))}
                {posters.map(img => (
                  <div key={img.file_path} className="break-inside-avoid">
                    <img
                      className="w-full h-full rounded-sm"
                      src={`${TMDB_IMAGE_URL}/w342${img.file_path}`}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-[14px]">Chưa có hình ảnh.</p>
            )}
          </div>
        </div>
      )}

      {active === "cast" && (
        <div className="versions mb-15">
          <div className="heading py-6">
            <h1 className="text-white text-xl font-bold">Diễn viên</h1>
          </div>

          {cast.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
              {cast.slice(0, 15).map(person => (
                <Cast key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-[14px]">Chưa có thông tin diễn viên.</p>
          )}
        </div>
      )}

      {active === "suggest" && (
        <div className="versions mb-15 xl:max-w-280">
          <div className="heading py-6">
            <h1 className="text-white text-xl font-bold">Có thể bạn sẽ thích</h1>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
            {suggestMovies.slice(0, 12).map((m) => (
              <Card key={m.id} movie={m} variant={"vertical"} />
            ))}
          </div>
        </div>
      )}

      <div className="comment-section grid grid-cols-1 text-white">

        <div className="heading flex justify-between items-center">

          <div className="flex justify-center items-center">
            <i className="fa-solid fa-comment-dots "></i>
            <h1 className="pl-2 pr-0.75">Bình luận</h1>
            <span>(0)</span>
          </div>

          <div className="flex border border-gray-400 rounded-[10px]">
            <div className="text-[12px] py-1 px-0.75">
              <button
                onClick={() => setIsActiveCommentBtn(true)}
                className={`py-1 px-1.75 rounded-md ${isActiveCommentBtn ? "text-black bg-white" : "text-white"}`}>
                Bình luận
              </button>

              <button
                onClick={() => setIsActiveCommentBtn(false)}
                className={`py-1 px-1.75 rounded-sm ${!isActiveCommentBtn ? "text-black bg-white" : ""}`}>
                Đánh giá
              </button>
            </div>
          </div>
        </div>

        <div className="warning my-4">
          <span className="text-gray-400 text-[13px]">
            Vui lòng
            <Link className="text-mainblue"> đăng nhập </Link>
            để tham gia bình luận.
          </span>
        </div>

        <div
          id="comment"
          className="flex flex-col bg-[#ffffff10] rounded-2xl p-[8px_8px_0_8px] w-full"
        >
          <div className="relative rounded-2xl bg-[#1b1d29] border-transparent border focus-within:border focus-within:border-mainblue overflow-hidden">
            <div className="absolute top-0 right-1 text-[12px] text-gray-400 p-1 overflow-hidden">
              {text.length}/{MAX_TEXT_LENGTH}
            </div>
            <textarea
              value={text}
              onChange={handleChange}
              className="text-[12px] px-5 py-4 w-full h-full min-h-25 outline-none"
              placeholder="Viết bình luận"
            />
          </div>

          <div className="flex justify-between py-4">

            <div className="flex justify-center items-center gap-1.5 text-[12px]">
              <button
                onClick={() => setToggle(!toggle)}
                className={`relative flex border rounded-2xl w-8 py-1 px-1 transition-all duration-700 ease-in-out
                ${!toggle ? "border-gray-400/40" : "border border-mainblue"}
                `}
              >
                <div
                  className={`rounded-full w-2.5 h-2.5 transition-all duration-700 ease-in-out transform 
                  ${!toggle ? "translate-x-0 bg-gray-400" : "translate-x-3 bg-mainblue"}`}>
                </div>
              </button>
              <span>Tiết lộ?</span>
            </div>

            <div className="flex gap-2 items-center text-mainblue text-[16px] pr-2">
              <span>Gửi</span>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col mt-12 pb-20 gap-6">
        <ItemComment />
        <ItemComment />
        <ItemComment />
      </div>
    </>
  )
}

export default Tabs