import { useState, useRef } from "react";
import { Link } from "react-router-dom";

function TopSlider({ movies, active, setActive }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);

  // Min swipe distance (px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe left - go to next slide 
    if (isLeftSwipe) {
      if (active < movies.length - 1) {
        setActive(active + 1);
      } else {
        setActive(0);
      }
    }

    // Swipe right - go to previous slide
    if (isRightSwipe) {
      if (active > 0) {
        setActive(active - 1);
      } else {
        setActive(movies.length - 1);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-60 sm:h-105 lg:h-150 xl:h-190 2xl:h-215 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="h-full">
        {
          movies.slice(0, 6).map((m, i) => (
            <div
              key={m.id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0 z-0"}`}>
              <Link to={`/movie/${m.id}`}>
                <img
                  src={m.poster}
                  className="w-full h-full object-cover saturate-110 contrast-105"
                />
              </Link>

              {/* Effect shadow for image */}
              <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#1b1d29] via-[#1b1d29]/0 "></div>
              <div className="max-sm:hidden absolute inset-0 pointer-events-none bg-linear-to-r from-[#1b1d29] via-[#1b1d29]/0 to-transparent"></div>
              <div className="max-sm:hidden absolute inset-0 pointer-events-none bg-linear-to-l from-[#1b1d29] via-[#1b1d29]/0 to-transparent"></div>

              {/* Grid noise */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.56]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
                  `,
                  backgroundSize: "3px 3px",
                  mixBlendMode: "overlay"
                }}
              ></div>

              {/* Content */}
              <div className="absolute max-xl:bottom-0 bottom-30 flex flex-col max-sm:items-center sm:pl-8 sm:pb-8 w-full">

                {/* Title */}
                <div className="max-w-full">
                  <h1 className="text-white font-bold text-[20px] sm:text-3xl truncate max-sm:px-4">{m.title}</h1>
                </div>

                {/* Sub title */}
                <div className="max-w-full">
                  <p className="text-mainblue truncate text-[12px] sm:text-[16px] max-sm:px-8 sm:py-2">{m.subTitle}</p>
                </div>

                {/* Tags */}
                <div className="flex text-[10px] gap-2.5 text-white py-2 md:text-[12px] items-center">
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 font-bold">
                    <span className="text-mainblue text-[11px]">IMDb</span>
                    <span>{m.info.imdb ?? "--"}</span>

                  </div>
                  <div className="rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-mainblue text-white font-bold">
                    <span>{m.info.resolution ?? "--"}</span>
                  </div>
                  <div className="rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-white text-black font-bold">
                    <span>{m.info.ageLimit ?? "--"}</span>
                  </div>
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10]">
                    <span>{m.info.year ?? "--"}</span>
                  </div>
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10]">
                    <span>{m.info.duration ?? "--"}</span>
                  </div>
                </div>

                {/* Genres tags */}
                <div className="max-sm:hidden flex text-white gap-1.5 lg:mb-3">
                  {m.info.genres.map(g => (
                    <a key={g.id} href="" className="text-[12px] py-1 px-2 bg-[#ffffff10] rounded font-semibold">{g.name}</a>
                  ))}
                </div>

                {/* Description */}
                <div className="max-lg:hidden w-135 overflow-hidden">
                  <p className="line-clamp-3 text-white text-[14px]">{m.description}</p>
                </div>

                {/* Touches */}
                <div className="max-sm:hidden flex items-center gap-6 mt-6">

                  {/* Play */}
                  <Link to={`/watch/${m.id}`} className="flex justify-center items-center rounded-full bg-mainblue h-15 w-15 lg:h-17.5 lg:w-17.5 lg:p-6 shadow-[0px_4px_10px_5px_rgba(0,149,182,0.4)]">

                    <i className="fa-solid fa-play text-black text-[18px] lg:text-[26px]"></i>
                  </Link>

                  {/* Like + Info */}
                  <div className="flex items-center text-white bg-transparent text-[18px] rounded-l-full rounded-r-full h-12 border">
                    <a href="" className="px-5 border-r h-full leading-12">
                      <i className="fa-solid fa-heart"></i>
                    </a>

                    <a href="" className="px-5 h-full leading-12">
                      <i className="fa-solid fa-circle-info"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default TopSlider;
