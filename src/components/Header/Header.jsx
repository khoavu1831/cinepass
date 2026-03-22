import { useEffect, useRef, useState } from "react"
import { labels } from "../../utils/seed";
import NavItem from "./NavItem";
import { Link } from "react-router-dom";
import movieSvg from "/movie.svg";

function Header() {
  const headerRef = useRef(null);
  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);
  const [isTop, setIsTop] = useState(true);
  const [activeNav, setActiveNav] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);

  // Handle scroll header
  useEffect(() => {
    const headerHeight = headerRef.current.offsetHeight;

    const handleScroll = () => {
      (window.scrollY < headerHeight) ? setIsTop(true) : setIsTop(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside nav
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopNavRef.current && desktopNavRef.current.contains(e.target)) return;
      if (mobileNavRef.current && mobileNavRef.current.contains(e.target)) return;

      setActiveNav(null);
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Handle resize (responsive)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setShowSearch(false);
        setShowMenuItems(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      <header className="max-sm:relative max-sm:bg-[#0f111a] fixed top-0 left-0 font-poppins w-full z-999">
        <nav
          ref={headerRef}
          className={`h-17.5 flex justify-between items-center w-auto px-5 ${isTop ? "bg-transparent xl:h-22.5 " : "bg-[#0f111a] xl:h-17.5"} xl:relative`}
        >
          <div className={`flex items-center ${showSearch ? "max-xl:hidden!" : ""}`}>
            {/* BarsMenuIcon <= 1280px */}
            <i
              className={`fa-solid cursor-pointer ${showMenuItems ? "text-red-400! fa-xmark" : "fa-bars"} text-white text-2xl xl:hidden!`}
              onClick={() => setShowMenuItems(!showMenuItems)}
            ></i>


            {/* Logo */}
            <div className="cursor-pointer max-xl:ml-4">
              <Link to={"/"} className="flex items-center">
                <img className="h-13" src={movieSvg} alt="logo" />
                <h3 className="font-semibold text-white text-[18px]">RoPhim</h3>
                <span className="font-mono text-gray-400 text-[12px]">Fake</span>
              </Link>
            </div>
          </div>

          {/* SearchIcon <= 1280px */}
          {!showSearch && (
            <i
              className="fa-solid fa-magnifying-glass text-white xl:hidden! cursor-pointer"
              onClick={() => setShowSearch(true)}
            ></i>
          )}

          {/* SearchBar > 1280px */}
          <div className="max-xl:hidden flex grow ml-1.5">
            <search className="flex items-center bg-[#22242c]/30  px-4 py-3 rounded border focus-within:border-white max-w-110 w-full">
              <i className="fa-solid fa-magnifying-glass text-white"></i>
              <input
                className="text-white text-[13px] outline-0 ml-4 w-full placeholder:text-white"
                type="text"
                placeholder="Tìm kiếm phim, diễn viên"
              />
            </search>
          </div>

          {/* SearchBar <= 1280px */}
          {showSearch && (
            <div
              ref={headerRef}
              className={`fixed top-0 left-0 w-full px-2 h-17.5 ${isTop ? "bg-transparent" : "bg-[#0f111a]"}`}
            >
              <div className="flex items-center justify-between m-3">
                <search
                  ref={headerRef}
                  className={`flex items-center rounded-md border focus-within:border-white w-full py-1.5 ${isTop ? "bg-[#22242c]/30" : "bg-[#22242c]"}`}
                >
                  <div className="px-3">
                    <i className="fa-solid fa-magnifying-glass text-white"></i>
                  </div>
                  <input
                    className="focus-within: text-white text-[13px] outline-0 w-full placeholder:text-white h-7.5 pr-8"
                    type="text"
                    placeholder="Tìm kiếm phim, diễn viên"
                  />
                </search>
                <div className="pl-3 flex items-center">
                  <i className="fa-solid fa-xmark text-red-400 text-[20px] cursor-pointer pl-1" onClick={() => setShowSearch(false)}></i>
                </div>
              </div>
            </div>
          )}

          {/* MenuItems */}
          <div
            ref={desktopNavRef}
            className="max-xl:hidden flex justify-between grow ml-8"
          >
            <div className="flex items-center gap-8 text-white text-[13px]">
              <NavItem label={"Phim Lẻ"} href={"/phimle"} activeNav={activeNav} setActiveNav={setActiveNav} variant="desktop" />
              <NavItem label={"Phim Bộ"} href={"/phimbo"} activeNav={activeNav} setActiveNav={setActiveNav} variant="desktop" />
              <NavItem label={"Thể loại"} activeNav={activeNav} setActiveNav={setActiveNav} data={labels.genres} col={4} variant="desktop" />
              <NavItem label={"Quốc gia"} activeNav={activeNav} setActiveNav={setActiveNav} data={labels.countries} col={1} variant="desktop" />
              <NavItem label={"Xem Chung"} href={"/xemchung"} activeNav={activeNav} setActiveNav={setActiveNav} variant="desktop" />
              <NavItem label={"Thêm"} activeNav={activeNav} setActiveNav={setActiveNav} data={labels.others} col={1} variant="desktop" />
              <NavItem label={"Rổ Bóng"} href={"/robong"} activeNav={activeNav} setActiveNav={setActiveNav} variant="desktop" />
            </div>

            {/* Button - test link: /watch */}
            <Link to={"/"} className="bg-white flex items-center rounded-3xl px-3 py-2.5 w-auto text-[13px] font-medium opacity-90 cursor-pointer hover:opacity-100">
              <i className="fa-solid fa-user"></i>
              <h4 className="ml-1.5">Thành viên</h4>
            </Link>
          </div>
        </nav>

        {/* MenuItems <= 1280px */}
        {showMenuItems && (
          <div
            ref={mobileNavRef}
            className="xl:hidden absolute top-full left-0 mt-1 w-full md:max-w-[320px] px-1.5 z-50"
          >
            <div className="bg-[#2b3561] rounded-[14px] flex flex-col py p-4">
              <Link to={"/"} className="bg-white flex justify-center items-center rounded-3xl px-3 text-[13px] font-medium opacity-90 cursor-pointer hover:opacity-100 w-full h-9.5 ">
                <i className="fa-solid fa-user"></i>
                <h4 className="ml-1.5">Thành viên</h4>
              </Link>

              <div className="grid grid-cols-2 mt-4">
                <NavItem label={"Phim Lẻ"} href={"/phimle"} activeNav={activeNav} setActiveNav={setActiveNav} variant="mobile" />
                <NavItem label={"Phim Bộ"} href={"/phimbo"} activeNav={activeNav} setActiveNav={setActiveNav} variant="mobile" />
                <NavItem label={"Thể loại"} activeNav={activeNav} setActiveNav={setActiveNav} data={labels.genres} responsive col={6} variant="mobile" />
                <NavItem label={"Quốc gia"} activeNav={activeNav} setActiveNav={setActiveNav} data={labels.countries} col={1} variant="mobile" />
                <NavItem label={"Xem Chung"} href={"/xemchung"} activeNav={activeNav} setActiveNav={setActiveNav} variant="mobile" />
                <NavItem label={"Thêm"} activeNav={activeNav} setActiveNav={setActiveNav} data={labels.others} col={1} variant="mobile" />
                <NavItem label={"Rổ Bóng"} href={"/robong"} activeNav={activeNav} setActiveNav={setActiveNav} variant="mobile" />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header