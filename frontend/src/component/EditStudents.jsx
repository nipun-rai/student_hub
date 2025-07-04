// frontend/EditStudent.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditStudents.css'; // Re-use the same CSS for the form

export default function EditStudents() { // <--- The component is named EditStudents
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
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
    current_photo_path: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/student_profiles/${studentId}`);
        const studentData = response.data;
        setFormData({
          name: studentData.name || '',
          registration_id: studentData.registration_id || '',
          application_number: studentData.application_number || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          program: studentData.program || '',
          department: studentData.department || '',
          batch_year: studentData.batch_year ? String(studentData.batch_year) : '',
          academic_status: studentData.academic_status || '',
          current_year: studentData.current_year || '',
          current_term: studentData.current_term || '',
          quota: studentData.quota || '',
          admission_type: studentData.admission_type || '',
          section: studentData.section || '',
          profile_photo: null,
          current_photo_path: studentData.profile_photo
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student for edit:", err);
        setError("Failed to load student profile for editing.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

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
      if (key !== 'profile_photo' && key !== 'current_photo_path') {
        if (key === 'batch_year' && formData[key]) {
            data.append(key, parseInt(formData[key], 10));
        } else {
            data.append(key, formData[key]);
        }
      }
    }
    if (formData.profile_photo) {
      data.append('profile_photo', formData.profile_photo);
    }

    try {
      await axios.put(`http://localhost:8000/student_profiles/${studentId}`, data);
      alert("Profile Updated Successfully!");
      navigate('/registered-students');
    } catch (err) {
      console.error(err);
      alert("Error updating profile: " + (err.response?.data?.detail || err.message));
    }
  };

  const formFields = [
    'name',
    'registration_id', 'application_number', 'email', 'phone',
    'program', 'department', 'batch_year', 'academic_status',
    'current_year', 'current_term', 'quota', 'admission_type', 'section'
  ];

  if (loading) {
    return <div className="container">Loading student data for editing...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="student-profile-container">
      <h2>Edit Student Profile</h2>
      <form onSubmit={handleSubmit} className="student-profile-form">
        {formFields.map((key) => (
          <input
            key={key}
            type={key === 'batch_year' ? 'number' : 'text'}
            name={key}
            placeholder={key.replace(/_/g, ' ')}
            value={formData[key]}
            onChange={handleChange}
            required
          />
        ))}

        {formData.current_photo_path && (
          <div className="current-photo-preview">
            <label>Current Profile Photo:</label>
            <img
              src={`http://localhost:8000/${formData.current_photo_path}`}
              alt="Current Profile"
              style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
            />
          </div>
        )}

        <label htmlFor="profile_photo">Upload New Profile Photo (Optional):</label>
        <input
          id="profile_photo"
          type="file"
          name="profile_photo"
          onChange={handleChange}
        />

        <button type="submit" className="student-profile-submit">Update Profile</button>
      </form>
    </div>
  );
}
