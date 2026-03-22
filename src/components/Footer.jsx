import movieSvg from "/movie.svg";
import vietnamPng from "/vietnam.png";

function Footer() {
  return (
    <>
      <div className="bg-[#0f111a] font-poppins">
        <div className="px-4 xl:px-5">
          <div className="flex flex-col py-8 max-xl:items-center xl:p-8">
            <button className="font-light bg-red-500 px-3 text-white flex justify-center items-center rounded-3xl max-sm:text-[12px] text-[15px] cursor-pointer w-full h-9.5 max-w-90 ">
              <img src={vietnamPng} alt="vietnam logo" />
              <h4 className="ml-1.5">Hoàng Sa & Trường Sa là của <span className="text-yellow-400">Việt Nam</span>!</h4>
            </button>

            <div className="mt-4 flex max-xl:flex-col items-center">
              <div className="xl:pr-12">
                <div className="flex items-center">
                  <img className="h-13 xl:h-18" src={movieSvg} alt="logo" />
                  <h3 className="font-semibold text-white text-[18px] xl:text-[28px]">RoPhim</h3>
                  <span className="font-mono text-gray-400 text-[12px] xl:text-[16px]">Fake</span>
                </div>
              </div>

              {/* Icons */}
              <div className="flex gap-2 md:gap-4 text-white max-xl:mt-4 xl:pl-12 xl:border-l border-gray-400">
                <a className="flex justify-center items-center w-10 h-10 rounded-full bg-mainblue" href="">
                  <i className="fa-brands fa-telegram text-xl"></i>
                </a>
                <a className="flex justify-center items-center w-10 h-10 rounded-full bg-mainblue" href="">
                  <i className="fa-brands fa-discord"></i>
                </a>
                <a className="flex justify-center items-center w-10 h-10 rounded-full bg-mainblue" href="">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a className="flex justify-center items-center w-10 h-10 rounded-full bg-mainblue" href="">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a className="flex justify-center items-center w-10 h-10 rounded-full bg-mainblue" href="">
                  <i className="fa-brands fa-tiktok"></i>
                </a>
                <a className="flex justify-center items-center w-10 h-10 rounded-full bg-mainblue" href="">
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-wrap justify-around mt-4 text-white max-sm:text-[12px] text-[13px] gap-2 xl:grid xl:grid-cols-3 xl:max-w-[50%]">
              <a href="">Hỏi-Đáp</a>
              <a href="">Chính sách bảo mật</a>
              <a href="">Điều khoản sử dụng</a>
              <a href="">Giới thiệu</a>
              <a href="">Liên hệ</a>
              <a href="">Dongphim</a>
              <a href="">Ghienphim</a>
              <a href="">Motphim</a>
              <a href="">Subnhanh</a>
            </div>

            {/* Quotes */}
            <div className="mt-4 text-white max-sm:text-[11px] max-sm:font-extralight text-[14px] max-xl:text-center xl:max-w-[50%]">
              <p>RoPhim – Phim hay cả rổ - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại. Khám phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!</p>
            </div>

            {/* Copyright */}
            <div className="flex items-center mt-4 text-mainblue">
              <i className="fa-regular fa-copyright"></i>
              <p className="font-semibold max-sm:text-[12px]">2025 Rophim<span className="text-gray-400 font-light">Fake</span> - kaiwu</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer