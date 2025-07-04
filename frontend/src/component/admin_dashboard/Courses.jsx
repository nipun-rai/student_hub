// // courses.jsx
// import React, { useState, useEffect } from 'react';
// import '../../css/courses.css';

// const API_BASE_URL = 'http://localhost:8000';

// function Courses() {
//   const [courses, setCourses] = useState([]);
//   const [formData, setFormData] = useState({
//     id: null,
//     program_name: '',
//     course_name: '',
//     duration: '',
//     course_level: ''
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/courses/`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       setCourses(data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       setMessage(`Error fetching courses: ${error.message}`);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     const method = isEditing ? 'PUT' : 'POST';
//     const url = isEditing ? `${API_BASE_URL}/courses/${formData.id}` : `${API_BASE_URL}/courses/`;

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           program_name: formData.program_name,
//           course_name: formData.course_name,
//           duration: formData.duration,
//           course_level: formData.course_level,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
//       }

//       await response.json();
//       setMessage(`Course ${isEditing ? 'updated' : 'added'} successfully!`);
//       resetForm();
//       fetchCourses();
//     } catch (error) {
//       console.error("Error submitting course:", error);
//       setMessage(`Error ${isEditing ? 'updating' : 'adding'} course: ${error.message}`);
//     }
//   };

//   const handleEdit = (course) => {
//     setFormData({ ...course });
//     setIsEditing(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this course?")) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/courses/${id}`, { method: 'DELETE' });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
//       }
//       setMessage('Course deleted successfully!');
//       fetchCourses();
//     } catch (error) {
//       console.error("Error deleting course:", error);
//       setMessage(`Error deleting course: ${error.message}`);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       id: null,
//       program_name: '',
//       course_name: '',
//       duration: '',
//       course_level: ''
//     });
//     setIsEditing(false);
//   };

//   return (
//     <div className="courses-container">
//       <div className="courses-box">
//         <h1 className="courses-title">Course Management System</h1>

//         {message && (
//           <div className={`courses-message ${message.includes('Error') ? 'error' : 'success'}`}>
//             {message}
//           </div>
//         )}

//         <div className="form-section">
//           <h2>{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Program Name</label>
//               <input type="text" name="program_name" value={formData.program_name} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Course Name</label>
//               <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Duration</label>
//               <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Course Level</label>
//               <input type="text" name="course_level" value={formData.course_level} onChange={handleChange} required />
//             </div>
//             <div className="button-group">
//               <button type="submit">{isEditing ? 'Update Course' : 'Add Course'}</button>
//               {isEditing && <button type="button" className="cancel" onClick={resetForm}>Cancel Edit</button>}
//             </div>
//           </form>
//         </div>

//         <h2 className="section-title">Existing Courses</h2>
//         {courses.length === 0 ? (
//           <p className="empty-message">No courses available. Add one above!</p>
//         ) : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th> 
//                   <th>Program Name</th>
//                   <th>Course Name</th>
//                   <th>Duration</th>
//                   <th>Level</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {courses.map((course) => (
//                   <tr key={course.id}>
//                     <td>{course.id}</td>
//                     <td>{course.program_name}</td>
//                     <td>{course.course_name}</td>
//                     <td>{course.duration}</td>
//                     <td>{course.course_level}</td>
//                     <td>
//                       <button className="edit-btn" onClick={() => handleEdit(course)}>Edit</button>
//                       <button className="delete-btn" onClick={() => handleDelete(course.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Courses;





// === Frontend: React (Vite) with Modal ===
// File: src/pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import '../../css/courses.css';

const API_BASE_URL = 'http://localhost:8000';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    program_name: '',
    course_name: '',
    duration: '',
    course_level: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage(`Error fetching courses: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_BASE_URL}/courses/${formData.id}` : `${API_BASE_URL}/courses/`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_name: formData.program_name,
          course_name: formData.course_name,
          duration: formData.duration,
          course_level: formData.course_level,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      await response.json();
      setMessage(`Course ${isEditing ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting course:", error);
      setMessage(`Error ${isEditing ? 'updating' : 'adding'} course: ${error.message}`);
    }
  };

  const handleEdit = (course) => {
    setFormData({ ...course });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      setMessage('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      setMessage(`Error deleting course: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      program_name: '',
      course_name: '',
      duration: '',
      course_level: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="courses-container">
      <div className="courses-box">
        <h1 className="courses-title">Course Management System</h1>

        {message && (
          <div className={`courses-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button className="add-course-btn" onClick={() => setIsModalOpen(true)}>+ Add New Course</button>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Program Name</label>
                  <input type="text" name="program_name" value={formData.program_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Course Name</label>
                  <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Course Level</label>
                  <input type="text" name="course_level" value={formData.course_level} onChange={handleChange} required />
                </div>
                <div className="button-group">
                  <button type="submit">{isEditing ? 'Update Course' : 'Add Course'}</button>
                  <button type="button" className="cancel" onClick={() => { resetForm(); setIsModalOpen(false); }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 className="section-title">Existing Courses</h2>
        {courses.length === 0 ? (
          <p className="empty-message">No courses available. Add one above!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Program Name</th>
                  <th>Course Name</th>
                  <th>Duration</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.program_name}</td>
                    <td>{course.course_name}</td>
                    <td>{course.duration}</td>
                    <td>{course.course_level}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(course)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(course.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
