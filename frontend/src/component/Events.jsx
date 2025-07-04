import { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Events.css";

const api = "http://localhost:8000"; // Adjust if your backend is on a different port

function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", time: "", venue: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(`${api}/events`).then(res => setEvents(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (editId) {
      axios.put(`${api}/events/${editId}`, form).then(res => {
        setEvents(events.map(e => (e.id === editId ? res.data : e)));
        resetForm();
      });
    } else {
      axios.post(`${api}/events`, form).then(res => {
        setEvents([...events, res.data]);
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setForm({ name: "", date: "", time: "", venue: "" });
    setEditId(null);
  };

  const handleEdit = (event) => {
    setForm(event);
    setEditId(event.id);
  };

  const handleDelete = (id) => {
    axios.delete(`${api}/events/${id}`).then(() => {
      setEvents(events.filter(e => e.id !== id));
    });
  };

  return (
    <div className="container">
      <h1 className="heading">Event Manager 🎓</h1>
      <div className="form-container">
        {["name", "date", "time", "venue"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="input"
          />
        ))}
        <button onClick={handleSubmit} className="submit-button">
          {editId ? "Update Event" : "Add Event"}
        </button>
      </div>

      <div className="event-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3 className="event-title">{event.name}</h3>
            <p>{event.date} at {event.time} - {event.venue}</p>
            <div className="button-group">
              <button className="edit-button" onClick={() => handleEdit(event)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
