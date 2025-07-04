


// 2nd code 
// frontend/studentProfiles.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/studentprofiles.css';

export default function StudentProfiles() {
  const [formData, setFormData] = useState({
    name: '', // <--- NEW FIELD
    registration_id: '',
    application_number: '',
    email: '',
    phone: '',
    program: '',
    department: '',
    batch_year: '',
    academic_status: '',
    current_year: '',
    current_term: '',
    quota: '',
    admission_type: '',
    section: '',
    profile_photo: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'batch_year' && formData[key]) {
          data.append(key, parseInt(formData[key], 10));
      } else {
          data.append(key, formData[key]);
      }
    }

    try {
      await axios.post("http://localhost:8000/student_profiles/", data);
      alert("Profile Created Successfully");
      navigate('/registered-students');
    } catch (err) {
      console.error(err);
      alert("Error creating profile: " + (err.response?.data?.detail || err.message));
    }
  };

  // Exclude profile_photo from automatic input generation for better control
  const formFields = [
    'name', // <--- NEW FIELD POSITIONED FIRST
    'registration_id', 'application_number', 'email', 'phone',
    'program', 'department', 'batch_year', 'academic_status',
    'current_year', 'current_term', 'quota', 'admission_type', 'section'
  ];

  return (
    <div className="student-profile-container">
      <h2>Create Student Profile</h2>
      <form onSubmit={handleSubmit} className="student-profile-form">
        {formFields.map((key) => (
          <input
            key={key}
            type={key === 'batch_year' ? 'number' : 'text'}
            name={key}
            placeholder={key.replace(/_/g, ' ')}
            value={formData[key]}
            onChange={handleChange}
            required // Most fields should be required, especially name
          />
        ))}
        <label htmlFor="profile_photo">Profile Photo:</label>
        <input
          id="profile_photo"
          type="file"
          name="profile_photo"
          onChange={handleChange}
        />

        <button type="submit" className="student-profile-submit">Submit</button>
      </form>
    </div>
  );
}




