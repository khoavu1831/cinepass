import avatarPng from "/messi.webp";

function ItemComment() {
  return (
    <>
      {/* Comment */}
      <div className="flex gap-4">

        {/* Left */}
        <div className="flex">
          {/* Avatar user */}
          <div className="h-10 w-10 rounded-full">
            <img
              className="h-full w-full object-cover rounded-full"
              src={avatarPng} alt="avatar logo" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-2">

          {/* Heading */}
          <div className="flex items-center gap-2.5">

            {/* Name + Gender */}
            <div className="flex items-center gap-1">
              <span className="text-white text-[14px]">Nguyen An</span>
              <i className="fa-solid fa-mars text-mainblue"></i>
            </div>

            {/* Time comment */}
            <div className="text-gray-400 text-[10px]">
              <span>2 giờ trước</span>
            </div>
          </div>

          {/* Context */}
          <div className="flex py-1">
            <div className="text-[13px] text-gray-400/90">
              <span>
                Lâu lắm rồi mới được coi một phim đã như vậy. Cốt truyện đơn giản thôi, nhưng cách thể hiện nó đỉnh ơi là đỉnh. Vô vấn đề rất trọng tâm, không dài dòng sến súa. Coi mà không muốn hết luôn. Visual đẹp nữa chứ. Đỉnh ơi là đỉnh ta nói nó sướng trong người j đâu á má ơi.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 text-[14px] text-gray-400">

            {/* Like */}
            <div className="like flex gap-1">
              <i className="fa-solid fa-thumbs-up text-[15px] text-gray-200"></i>
              <span className="text-[13px]">2</span>
            </div>

            {/* Dislike */}
            <div className="dislike flex gap-1">
              <i className="fa-solid fa-thumbs-down text-[15px] text-gray-200"></i>
              <span className="text-[13px]">10</span>
            </div>

            {/* Response */}
            <div className="response flex gap-1 text-[12px]">
              <i className="fa-solid fa-reply"></i>
              <span className="">Trả lời</span>
            </div>

            {/* More */}
            <div className="more flex items-center gap-1 text-[12px] ml-4">
              <i className="fa-solid fa-ellipsis"></i>
              <span>Thêm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ItemComment