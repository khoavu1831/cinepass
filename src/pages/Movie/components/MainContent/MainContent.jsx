import Tabs from "./Tabs/Tabs"
import Info from "./Info/Info"
import PlaysBar from "./PlayBars/PlayBars"

function MainContent({ movie, loading }) {
  return (
    <>
      <div className="main-content px-4 max-xl:-mt-37.5">
        <div className="xl:flex xl:-mt-37.5 xl:z-100 xl:relative">
          <div className="xl:p-10 xl:max-w-110 xl:bg-[#1b1d29] rounded-4xl">
            <Info movie={movie} loading={loading} />
          </div>

          <div className="bg-[#1b1d29] xl:px-10 rounded-4xl">
            <PlaysBar movie={movie} />
            <Tabs movie={movie} />
          </div>
        </div>
      </div>
    </>
  )
}

export default MainContent