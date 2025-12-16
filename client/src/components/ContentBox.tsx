import './ContentBox.css'
import Editor from './Editor.tsx'

function ContentBox() {

  return (
    <>
      <div className="contentbox-canvas">
        <div className="contentbox-container">
          <div className="contentbox-header">
            <div className="contentbox-header-patientinfo"></div>
          </div>
          <div className="contentbox-body">
            <Editor />
          </div>
        </div>
      </div>
    </>
  )
}

export default ContentBox
