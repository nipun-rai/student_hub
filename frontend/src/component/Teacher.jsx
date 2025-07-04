
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Teacher.css";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", role: "", rating: "", program: "", course: "", status: "Active"
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await axios.get("http://localhost:8000/teachers/");
    setTeachers(res.data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rating validation
    const ratingValue = parseFloat(formData.rating);
    if (ratingValue > 10) {
      alert("Rating cannot be more than 10.");
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (profileImage) form.append("profile_image", profileImage);

    if (isEditMode) {
      await axios.put(`http://localhost:8000/teachers/${editingId}`, form);
    } else {
      await axios.post("http://localhost:8000/teachers/", form);
    }

    setIsModalOpen(false);
    setFormData({ name: "", role: "", rating: "", program: "", course: "", status: "Active" });
    setProfileImage(null);
    setIsEditMode(false);
    setEditingId(null);
    fetchTeachers();
  };

  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      role: teacher.role,
      rating: teacher.rating,
      program: teacher.program,
      course: teacher.course,
      status: teacher.status,
    });
    setEditingId(teacher.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/teachers/${id}`);
    fetchTeachers();
  };

  const getImageUrl = (filename) => {
    return filename
      ? `http://localhost:8000/uploads/${filename}`
      : "https://via.placeholder.com/60";
  };

  return (
    <div className="teacher-container">
      <div className="header-bar">
        <h2>All Teachers</h2>
        <button
          className="add-btn"
          onClick={() => {
            setFormData({ name: "", role: "", rating: "", program: "", course: "", status: "Active" });
            setProfileImage(null);
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          + Add new Teachers
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close-btn" onClick={() => setIsModalOpen(false)}>×</span>
            <h3>{isEditMode ? "Update Teacher" : "Add New Teacher"}</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
              <input
                name="rating"
                type="number"
                step="0.1"
                max="10"
                placeholder="Rating (max 10)"
                value={formData.rating}
                onChange={handleChange}
                required
              />
              <input name="program" placeholder="Program" value={formData.program} onChange={handleChange} required />
              <input name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
              <button type="submit">{isEditMode ? "Update" : "Save"}</button>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>User Role</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Program</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td className="user-cell">
                <img src={getImageUrl(t.profile_image)} alt="profile" className="user-img" />
                <span>{t.name}</span>
              </td>
              <td>{t.role}</td>
              <td className={t.status === "Active" ? "status-active" : "status-inactive"}>{t.status}</td>
              <td>{t.rating}</td>
              <td>{t.program}</td>
              <td>{t.course}</td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(t)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teacher;
