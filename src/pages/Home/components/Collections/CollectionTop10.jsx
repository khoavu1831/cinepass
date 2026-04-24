import CardTop10 from "../../../../components/Cards/CardTop10"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useState, useRef } from "react"

function CollectionTop10({ movies, titleCollection, type }) {
  const isTopMovies = type === "top-movies";
  const preRef = useRef(null);
  const nextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false)

  return (
    <>
      <div className="px-4 relative">
        {/* Thumbnail */}
        <div className="flex w-full items-center max-sm:justify-between mb-4">
          {/* Title */}
          <div className="text-[22px] sm:text-[25px] xl:text-[32px] font-medium text-white max-w-[86%]">
            {titleCollection}
          </div>
        </div>

        {/* Slide nav */}
        <div className="max-md:hidden absolute w-full left-0 right-0 top-[40%] -translate-y-1/2 z-50 text-white text-4xl pointer-events-none">
          <button
            ref={preRef}
            className={`absolute cursor-pointer pointer-events-auto -left-4 md:-left-10
              ${isBeginning ? "opacity-0" : "opacity-40 hover:opacity-100"}`}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <button
            ref={nextRef}
            className={`absolute cursor-pointer pointer-events-auto -right-4 md:-right-10
              ${isEnd ? "opacity-0" : "opacity-40 hover:opacity-100"}`}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = preRef.current,
              swiper.params.navigation.nextEl = nextRef.current
          }}
          onSwiper={(swiper) => {
            requestAnimationFrame(() => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            })
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning)
            setIsEnd(swiper.isEnd)
          }}
          onResize={(swiper) => {
            setIsBeginning(swiper.isBeginning)
            setIsEnd(swiper.isEnd)
          }}
          spaceBetween={0}
          slidesPerView={1}
          breakpoints={{
            425: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            768:
            {
              slidesPerView: 3,
              spaceBetween: 10
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10
            },
            1440: {
              slidesPerView: 5,
              spaceBetween: 10
            }
          }}
          className="pb-40! -mb-40!"
        >
          {movies.map((m, index) => (
            <SwiperSlide key={m.id}>
              <CardTop10 movie={m} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}

export default CollectionTop10