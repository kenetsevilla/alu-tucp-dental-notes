import './MetadataForm.css';

export default function MetadataForm() {
  return (
    <div className="metadata-container">
      <div className="metadata-grid">
        <input name="lastName" placeholder="Last Name" />
        <input name="firstName" placeholder="First Name" />
        <input name="middleName" placeholder="Middle Name" />
        <input name="class" placeholder="Class" />
        <input name="contactNumber" placeholder="Contact Number" />
        <div className="split-row">
            <input name="age" placeholder="Age" type="number" className="age-input" />
            <select name="sex" className="sex-input" defaultValue="">
                <option value="" disabled>Sex</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </select>
        </div>
        <input name="dob" type="date" placeholder="Date of Birth" />
        <input name="agency" placeholder="Agency" />
      </div>
    </div>
  );
}