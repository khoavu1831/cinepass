import avatarPng from "/messi.webp";

function CommentItem() {
  return (
    <>
      <div className="bg-black/60 rounded-xl py-3 px-5 cursor-pointer border border-transparent hover:border-gray-400 hover:border">
        <a
          href=""
          className="flex gap-4 text-[12px] w-full"
        >
          {/* Avatar */}
          <div className="cover-image h-10 w-10 shrink-0">
            <img
              className="w-full h-full object-cover rounded-full hover:opacity-80"
              src={avatarPng}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            {/* Heading content */}
            <div className="flex gap-2">
              {/* Name user */}
              <h4>Tuine</h4>

              {/* Gender icon */}
              <span>
                <i className="fa-solid fa-mars text-mainblue"></i>
              </span>

              {/* Comment */}
              <p className="line-clamp-1">hài quải chè bá bá ơiài quải chè bá bá ơiài quải chè bá bá ơiài quải chè bá bá ơi</p>
            </div>

            {/* Footer content */}
            <div className="flex gap-2 items-center">
              <span className="text-mainblue text-[8px]">
                <i className="fa-solid fa-play"></i>
              </span>

              {/* Name movie */}
              <span className="text-gray-500 hover:text-mainblue">Song Quỹ</span>
            </div>
          </div>
        </a>
      </div>
    </>
  )
}

export default CommentItem