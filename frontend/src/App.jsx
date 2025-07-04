
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Homepage from './component/Homepage.jsx';
import Events from './component/Events.jsx';
import Dashboard from './component/admin_dashboard/Dashboard.jsx';
import Courses from './component/admin_dashboard/Courses.jsx';
import StudentProfiles from './component/StudentProfiles.jsx';
import StudentCards from './component/StudentCards.jsx'; // Component for creating profiles
import RegisteredStudents from './component/Registeredstudents.jsx'; // Component for viewing registered students
import EditStudents from './component/EditStudents.jsx'; // Component for editing profiles (uncomment when created)
import Teacher from './component/Teacher.jsx';
import QnA from './component/QnA.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes from the first App.jsx */}
        <Route path="/" element={<Dashboard/>} /> {/* Default route */}
        <Route path="/homepage" element={<Homepage/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/events" element={<Events />} />
        <Route path="/qna" element={<QnA />} />

        {/* Student Profile Routes - using paths from the first App.jsx */}
        {/* This route is for the form to create a new student profile */}
        <Route path="/students" element={<StudentProfiles/>} />
        <Route path="/Student-Cards" element={<StudentCards />} />
        <Route path="/Teachers" element={<Teacher />} />
        {/* This route is for displaying the list of registered students */}
        <Route path="/registered-students" element={<RegisteredStudents/>} />

        {/* Route for editing a specific student profile */}
        {/* Uncomment and ensure EditStudentProfile component exists when ready */}
        <Route path="/edit-student/:studentId" element={<EditStudents />} />

        {/* You can add more routes here as needed */}

      </Routes>
    </Router>
  );
};

export default App;


