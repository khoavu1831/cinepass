function ModalCardTop10({ m }) {
  return (
    <>
      {/* Wrapper */}
      <div className="flex flex-col h-full w-full">

        {/* Cover image */}
        <div className="h-full w-full relative overflow-hidden">
          <img
            src={m.poster}
            className="h-full w-full object-cover mask-b-from-90"
          />

          <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#2b3561] via-[#2b3561]/30 to-transparent" />

          {/* Grid noise */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.12]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: "3px 3px",
              mixBlendMode: "overlay"
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col h-full bg-[#2b3561] p-[0_0_16px_16px] pt-2 px-2">

          {/* Title */}
          <div className="max-w-full">
            <h1 className="text-white font-bold text-[20px] sm:text-[16px] truncate max-sm:px-4">{m.title}</h1>
          </div>

          {/* Sub title */}
          <div className="max-w-full">
            <p className="text-mainblue truncate text-[12px] sm:text-[14px] max-sm:px-8">{m.subTitle}</p>
          </div>

          {/* PlaysBar */}
          <div className="flex w-full gap-2 text-white text-[11px] py-2">

            <div className="flex-2 flex items-center justify-center py-3 gap-1 bg-mainblue text-black rounded">
              <i className="fa-solid fa-play"></i>
              <span className="whitespace-nowrap">Xem ngay</span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-1 px-2 border border-gray-500 rounded">
              <i className="fa-solid fa-heart"></i>
              <span className="whitespace-nowrap">Thích</span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-1 px-2 border border-gray-500 rounded">
              <i className="fa-solid fa-circle-info"></i>
              <span className="whitespace-nowrap">Chi tiết</span>
            </div>

          </div>




          {/* Tags */}
          <div className="flex text-[8px] xl:text-[10px] gap-1.5 text-white py-2 items-center">
            <div className="border rounded-md px-1 py-1 xl:px-1.5 xl:py-1.5 font-bold">
              <span className="text-mainblue text-[11px]">IMDb</span>
              <span>{m.info.imdb ?? "--"}</span>
            </div>

            <div className="rounded-md px-1 py-1 bg-mainblue text-white font-bold">
              <span>{m.info.resolution ?? "--"}</span>
            </div>

            <div className="rounded-md px-1 py-1 bg-white text-black font-bold">
              <span>{m.info.ageLimit ?? "--"}</span>
            </div>

            <div className="border rounded-md px-1 py-1 bg-[#ffffff10]">
              <span>{m.info.year ?? "--"}</span>
            </div>

            <div className="border rounded-md px-1 py-1 bg-[#ffffff10]">
              <span>{m.info.duration ?? "--"}</span>
            </div>
          </div>

          {/* Genres tags */}
          <div className="max-sm:hidden flex flex-wrap text-white gap-1.5 p-1.75">
            {m.info.genres.map((g, index) => (
              <a key={g.id} href="" className="flex items-center gap-1 text-[8px] xl:text-[12px] rounded font-semibold">
                {g.name}
                {index !== m.info.genres.length - 1 && (
                  <span className="rounded-full h-0.5 w-0.5 bg-white"></span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalCardTop10