// frontend/component/StudentCards.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/StudentCards.css'; // Import the external CSS (renamed)

const StudentCards = () => { // Component name changed
  return (
    <div className="navigation-container"> {/* Class names kept for consistency with CSS */}
      <h1 className="navigation-title">Student Hub Sections</h1> {/* Class names kept for consistency with CSS */}

      <div className="cards-grid"> {/* Class names kept for consistency with CSS */}

        {/* Card 1: Create Student Profile */}
         {/* Use Link for navigation */}
          <div className="card"> {/* Class names kept for consistency with CSS */}
            <div className="card-icon text-blue"> {/* Class names kept for consistency with CSS */}
              🎓 {/* Emoji icon */}
            </div>
            <h2 className="card-title">Create Student Profile</h2> {/* Class names kept for consistency with CSS */}
            <p className="card-description">Add new student records to the system.</p> {/* Class names kept for consistency with CSS */}
            {/* Button text is part of the Link */}
            <Link to="/students" className="card-link">
            <span className="card-button"> {/* Class names kept for consistency with CSS */}
              Go to Form
            </span>
             </Link>
          </div>
       

        {/* Card 2: View Registered Students */}
         {/* Use Link for navigation */}
          <div className="card"> {/* Class names kept for consistency with CSS */}
            <div className="card-icon text-green"> {/* Class names kept for consistency with CSS */}
              📋 {/* Emoji icon */}
            </div>
            <h2 className="card-title">View Registered Students</h2> {/* Class names kept for consistency with CSS */}
            <p className="card-description">Browse, edit, or delete existing student profiles.</p> {/* Class names kept for consistency with CSS */}
            <Link to="/registered-students" className="card-link">
             <span className="card-button"> {/* Class names kept for consistency with CSS */}
              View Profiles
            </span>
            </Link>
          </div>
        

        {/* Card 3: Manage Events */}
         {/* Use Link for navigation */}
          <div className="card"> {/* Class names kept for consistency with CSS */}
            <div className="card-icon text-purple"> {/* Class names kept for consistency with CSS */}
              📅 {/* Emoji icon */}
            </div>
            <h2 className="card-title">Manage Events</h2> {/* Class names kept for consistency with CSS */}
            <p className="card-description">Add, update, or delete upcoming events.</p> {/* Class names kept for consistency with CSS */}
            <Link to="/events" className="card-link">
             <span className="card-button"> {/* Class names kept for consistency with CSS */}
              Go to Events
            </span>
            </Link>
          </div>
        

        {/* Card 4: Admin Dashboard (Example) */}
        {/* Use Link for navigation */}
          <div className="card"> {/* Class names kept for consistency with CSS */}
            <div className="card-icon text-yellow"> {/* Class names kept for consistency with CSS */}
              📊 {/* Emoji icon */}
            </div>
            <h2 className="card-title">Admin Dashboard</h2> {/* Class names kept for consistency with CSS */}
            <p className="card-description">Access the administration overview.</p> {/* Class names kept for consistency with CSS */}
            <Link to="/" className="card-link"> 
            <span className="card-button"> {/* Class names kept for consistency with CSS */}
              View Dashboard
            </span>
             </Link>
          </div>
       

      </div>
    </div>
  );
};

export default StudentCards; // Exporting the new component name


