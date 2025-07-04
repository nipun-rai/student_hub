
// // frontend/RegisteredStudents.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import '../css/registeredstudents.css';

// const api = "http://localhost:8000"; // Adjust if your backend is on a different port

// export default function RegisteredStudents() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get(`${api}/student_profiles/`); // Fetch all students
//       setStudents(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       setError("Failed to load student profiles.");
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (studentId) => {
//     if (window.confirm("Are you sure you want to delete this student profile?")) {
//       try {
//         await axios.delete(`${api}/student_profiles/${studentId}`);
//         alert("Profile deleted successfully");
//         fetchStudents(); // Refresh the list after deletion
//       } catch (err) {
//         console.error("Error deleting student:", err);
//         alert("Error deleting profile: " + (err.response?.data?.detail || err.message));
//       }
//     }
//   };

//   if (loading) {
//     return <div className="container">Loading student profiles...</div>;
//   }

//   if (error) {
//     return <div className="container error">{error}</div>;
//   }

//   return (
//     <div className="registered-students-container">
//       <h2>Registered Student Profiles</h2>
//       {students.length === 0 ? (
//         <p>No student profiles found.</p>
//       ) : (
//         <div className="student-list">
//           {students.map(student => (
//             <div key={student.id} className="student-card">
//               <div className="profile-photo">
//                 {/* Display photo if path is available and accessible from frontend */}
//                 {/* Note: You need your backend to serve static files from the 'uploads' directory */}
//                 {student.profile_photo ? (
//                   <img src={`${api}/${student.profile_photo}`} alt={`${student.registration_id}'s photo`} />
//                 ) : (
//                   <div className="placeholder-photo">No Photo</div>
//                 )}
//               </div>
//               <div className="student-details">
//                 <h3>{student.registration_id}</h3> {/* Or student's name if you add it */}
//                 <p><strong>Application Number:</strong> {student.application_number}</p>
//                 <p><strong>Email:</strong> {student.email}</p>
//                 <p><strong>Phone:</strong> {student.phone}</p>
//                 <p><strong>Program:</strong> {student.program}</p>
//                 <p><strong>Department:</strong> {student.department}</p>
//                 <p><strong>Batch Year:</strong> {student.batch_year}</p>
//                 <p><strong>Academic Status:</strong> {student.academic_status}</p>
//                 <p><strong>Current Year:</strong> {student.current_year}</p>
//                 <p><strong>Current Term:</strong> {student.current_term}</p>
//                 <p><strong>Quota:</strong> {student.quota}</p>
//                 <p><strong>Admission Type:</strong> {student.admission_type}</p>
//                 <p><strong>Section:</strong> {student.section}</p>
//               </div>
//               <div className="button-group">
//                 {/* Link to an edit page. We'll need to create this later (e.g., EditStudent.jsx) */}
//                 <Link to={`/edit-student/${student.id}`} className="edit-button">Edit</Link>
//                 <button className="delete-button" onClick={() => handleDelete(student.id)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// 2nd code 
// frontend/RegisteredStudents.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/registeredstudents.css';

const api = "http://localhost:8000";

export default function RegisteredStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${api}/student_profiles/`);
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load student profiles.");
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student profile?")) {
      try {
        await axios.delete(`${api}/student_profiles/${studentId}`);
        alert("Profile deleted successfully");
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err);
        alert("Error deleting profile: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (loading) {
    return <div className="container">Loading student profiles...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="registered-students-container">
      <h2>Registered Student Profiles</h2>
      {students.length === 0 ? (
        <p>No student profiles found.</p>
      ) : (
        <div className="student-list">
          {students.map(student => (
            <div key={student.id} className="student-card">
              <div className="profile-photo">
                {student.profile_photo ? (
                   <img src={`${api}/${student.profile_photo}`} alt={`${student.registration_id}'s photo`} />
                 ) : (
                   <div className="placeholder-photo">No Photo</div>
                 )}
              </div>
              <div className="student-details">
                <h3>{student.name}</h3> {/* <--- NEW: Display student name */}
                <p><strong>Registration ID:</strong> {student.registration_id}</p> {/* Changed from h3 to p */}
                <p><strong>Application Number:</strong> {student.application_number}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>Program:</strong> {student.program}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Batch Year:</strong> {student.batch_year}</p>
                <p><strong>Academic Status:</strong> {student.academic_status}</p>
                <p><strong>Current Year:</strong> {student.current_year}</p>
                <p><strong>Current Term:</strong> {student.current_term}</p>
                <p><strong>Quota:</strong> {student.quota}</p>
                <p><strong>Admission Type:</strong> {student.admission_type}</p>
                <p><strong>Section:</strong> {student.section}</p>
              </div>
              <div className="button-group">
                <Link to={`/edit-student/${student.id}`} className="edit-button">Edit</Link>
                <button className="delete-button" onClick={() => handleDelete(student.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

