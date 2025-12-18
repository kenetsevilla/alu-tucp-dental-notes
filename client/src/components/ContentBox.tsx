import './ContentBox.css'
import Editor from './Editor.tsx'
import MetadataForm from './MetadataForm';

function ContentBox() {

  return (
    <>
      <div className="contentbox-canvas">
        <div className="contentbox-container">
          <div className="contentbox-header">
            <div className="contentbox-header-patientinfo">
              <MetadataForm />
            </div>
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
