import Backdrop from "./Backdrop"
import MainContent from "./MainContent/MainContent"

function Main({ movie, loading }) {
  return (
    <>
      <div className="relative bg-[#1b1d29]">
        <div className="flex flex-col">
          <Backdrop movie={movie} />
          <MainContent movie={movie} loading={loading} />
        </div>
      </div>
    </>
  )
}

export default Main