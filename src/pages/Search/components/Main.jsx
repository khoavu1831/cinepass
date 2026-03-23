import { useState } from "react"
import Button from "./Button";
import Fieldset from "./Fieldset";

function Main() {
  const [type, setType] = useState("phim");

  return (
    <div className="search-container py-28 h-full bg-[#1b1d29]">
      <div className="content px-5">
        {/* header */}
        <div className="rows-header text-3xl font-medium text-white flex items-center gap-2">
          <i class="fa-solid fa-sliders"></i>
          <h1>Kết quả tìm kiếm "phim"</h1>
        </div>

        {/* main content */}
        <div className="main-content">
          <div className="toggle-btns flex gap-2 py-5">
            <Button
              active={type === "phim"}
              onClick={() => setType("phim")}
              label={"Phim"}
            />
            <Button
              active={type === "dv"}
              onClick={() => setType("dv")}
              label={"Diễn viên"}
            />
          </div>

          <div className="filter">
            <Fieldset />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main