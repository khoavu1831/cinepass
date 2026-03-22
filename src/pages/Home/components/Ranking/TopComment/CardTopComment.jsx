import avatarPng from "/messi.webp";

function CardTopComment() {
  return (
    <>
      <div className="card-container">
        <div className="group wrapper relative rounded-lg overflow-hidden">
          {/* Background image */}
          <img
            className="absolute blur-sm brightness-50 group-hover:brightness-70 inset-0 aspect-2/1 w-full h-full object-cover"
            src="https://static.nutscdn.com/vimg/300-0/5afae857d493f298886cff86b0fae07a.webp"
          />

          <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#1b1d29] via-[#1b1d29]/1 to-transparent"></div>

          {/* Content */}
          <div className="relative p-4 flex flex-col h-full gap-2">
            {/* Header */}
            <div className="header-card flex justify-between">
              {/* Left section */}
              <div className="avatar-left flex flex-col">
                {/* Avatar */}
                <div className="cover-avatar h-12 w-12">
                  <img
                    className="w-full h-full object-cover rounded-full group-hover:border-2 border-white hover:opacity-80"
                    src={avatarPng}
                  />
                </div>

                {/* Name user  */}
                <div className="name-header flex mt-2">
                  {/* Name */}
                  <h2 className="text-white">MIumiu</h2>
                  
                  {/* Gender */}
                  <span className="gender">
                    <i className="fa-solid fa-mars text-mainblue ml-2"></i>
                  </span>
                </div>
              </div>

              {/* Right section */}
              <div className="cover-img-right h-full w-14">
                <img
                  className="h-full w-full object-cover cursor-pointer"
                  src="https://static.nutscdn.com/vimg/300-0/5afae857d493f298886cff86b0fae07a.webp"
                />
              </div>
            </div>

            {/* Context */}
            <div className="context-card text-gray-400">
              <p className="text-[12px] line-clamp-2">Hello xin chào các bạn, comment nè Hello xin chào các bạn, comment nè</p>
            </div>

            {/* Footer */}
            <div className="flex gap-4 mt-2 text-gray-400 text-[12px]">
              {/* Like */}
              <div className="flex justify-between items-center">
                <i className="fa-solid fa-circle-up"></i>
                <span>12</span>
              </div>

              {/* Dislike */}
              <div className="flex justify-between items-center">
                <i className="fa-solid fa-circle-arrow-down"></i>
                <span>2</span>
              </div>

              {/* Comment */}
              <div className="flex justify-between items-center">
                <i className="fa-solid fa-message"></i>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardTopComment