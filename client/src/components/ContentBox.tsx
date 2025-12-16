import './ContentBox.css'

function ContentBox() {

  return (
    <>
      <div className="contentbox-canvas">
        <div className="contentbox-container">
          <div className="contentbox-header">
            <div className="contentbox-header-patientinfo"></div>
          </div>
          <div className="contentbox-body">
            <div className="contentbox-toolbar"></div>
            <div className="contentbox-textbox">
              <p>Content Box</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContentBox
