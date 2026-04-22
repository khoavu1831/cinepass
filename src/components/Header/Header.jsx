import { useEffect, useRef, useState } from "react"
import { labels } from "../../utils/seed";
import NavItem from "./NavItem";
import { Link } from "react-router-dom";
import movieSvg from "/movie.svg";
import Logo from "../Logo";
import AuthModal from "../AuthModal/AuthModal";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

function Header() {
  const headerRef = useRef(null);
  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);
  const [isTop, setIsTop] = useState(true);
  const [activeNav, setActiveNav] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
  };

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
            <Logo movieSvg={movieSvg} />
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
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3 text-white">
                  <span className="text-sm font-medium">{user.displayName}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 rounded-3xl px-3 py-1.5 text-[12px] font-medium cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white flex items-center rounded-3xl px-3 py-2.5 w-auto text-[13px] font-medium opacity-90 cursor-pointer hover:opacity-100"
                >
                  <i className="fa-solid fa-user"></i>
                  <h4 className="ml-1.5">Thành viên</h4>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* MenuItems <= 1280px */}
        {showMenuItems && (
          <div
            ref={mobileNavRef}
            className="xl:hidden absolute top-full left-0 mt-1 w-full md:max-w-[320px] px-1.5 z-50"
          >
            <div className="bg-[#2b3561] rounded-[14px] flex flex-col py p-4">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <span className="text-white text-center text-sm font-medium">Xin chào, {user.displayName}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-3xl px-3 py-2 text-[13px] font-medium cursor-pointer w-full"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white flex justify-center items-center rounded-3xl px-3 text-[13px] font-medium opacity-90 cursor-pointer hover:opacity-100 w-full h-9.5 "
                >
                  <i className="fa-solid fa-user"></i>
                  <h4 className="ml-1.5">Thành viên</h4>
                </button>
              )}

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

        {showAuthModal && (
          <AuthModal setShowAuthModal={setShowAuthModal} showAuthModal={showAuthModal} />
        )}
      </header>
    </>
  )
}

export default Header