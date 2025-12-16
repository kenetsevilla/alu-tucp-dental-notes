import './MainPage.css'
import Header from './components/Header.tsx'
import Sidebar from './components/Sidebar.tsx'
import ContentBox from './components/ContentBox.tsx'

function MainPage() {

  return (
    <>
      <div className="mainpage-canvas">
        <div className="mainpage-container">
          <div className="mainpage-header-container">
            <Header />
          </div>
          <div className="mainpage-body-container">
            <Sidebar />
            <ContentBox />
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage
