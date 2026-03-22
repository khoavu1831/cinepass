import { useNavigate } from "react-router-dom";
import ActionButtons from "./ActionsButton"
import movieSvg from "/movie.svg";

function PlaysBar({ movie }) {
  const navigate = useNavigate();

  const handleWatch = () => {
    if (movie?.id) {
      navigate(`/watch/${movie.id}`);
    }
  };

  return (
    <>
      <div className="container-bars py-4 lg:p-5 xl:py-8 xl:px-0">
        <div className="flex max-lg:flex-col w-full gap-2">
          <div className="btn-play flex justify-center lg:min-w-44">
            <button
              onClick={handleWatch}
              className="
                bg-linear-30 from-mainblue to-white 
                max-xl:max-w-[288px] w-full 
                flex justify-center items-center 
                rounded-4xl max-lg:py-4 text-[16px] cursor-pointer
                "
            >
              <i className="fa-solid fa-play"></i>
              <h4 className="ml-2 text-nowrap">Xem ngay</h4>
            </button>
          </div>

          <div className="flex justify-center lg:justify-between items-center max-lg:my-2 w-full">
            <div className="flex md:gap-4 lg:gap-6">
              <ActionButtons icon={"fa-heart"} label={"Yêu thích"} />
              <ActionButtons icon={"fa-plus"} label={"Thêm vào"} />
              <ActionButtons icon={"fa-share"} label={"Chia sẻ"} />
              <ActionButtons icon={"fa-comment"} label={"Bình luận"} isComment={true} />
            </div>

            <div className="md:pl-6 xl:min-w-40">
              <button className="bg-[#1a2c7e] w-full flex items-center gap-1 justify-around rounded-4xl px-3 py-1.5 lg:py-4 cursor-pointer">
                <img
                  src={movieSvg}
                  className="w-6 h-6 object-cover"
                />

                <span className="text-white font-semibold">
                  {movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>

                <a
                  href=""
                  className="max-sm:hidden text-white text-[12px] underline"
                >Đánh giá
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlaysBar