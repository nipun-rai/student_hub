import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, BookOpen, Users, Video, ClipboardList, LayoutDashboard } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import '../../css/dashboard.css';

// import Courses from './Courses.jsx';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
  { name: 'Overview', icon: <Home />, path: '/overview' },
  { name: 'Courses', icon: <BookOpen />, path: '/courses' },
  { name: 'Students', icon: <Users />, path: '/Student-Cards' },
  { name: 'Teachers', icon: <Users />, path: '/Teachers' },
  { name: 'Exam', icon: <ClipboardList />, path: '/exam' },
  // { name: 'Result', icon: <ClipboardList />, path: '/result' },
  // { name: 'Videos', icon: <Video />, path: '/videos' },
];

// this statistics vlaue should be dynamic 
const data = [
  { year: '2017', value: 200 },
  { year: '2018', value: 500 },
  { year: '2019', value: 450 },
  { year: '2020', value: 700 },
  { year: '2021', value: 600 },
];

// this piedata should also be dynamic
const pieData = [
  { name: 'Process', value: 75 },
  { name: 'In Process', value: 25 },
];

const COLORS = ['#4F46E5', '#CBD5E1'];

const DashboardHome = () => (
  <div className="grid-container">
    <div className="grid-cards">
      <div className="card">Total Students<br /><span className="card-value">1220</span></div>
      <div className="card">Total Teachers<br /><span className="card-value">120</span></div>
      <div className="card">Total Courses<br /><span className="card-value">15</span></div>
      <div className="card">Faculty Room<br /><span className="card-value">100</span></div>
    </div>
    <div className="bar-chart-container">
      <h2>Statistics</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="pie-chart-container">
      <h2>Course Activities</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={pieData} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const Dashboard = () => {
  return (
      <div className="main-layout">
        <aside className="sidebar">
          <div className="brand">EDUCATION</div>
          <nav>
            {menuItems.map((item) => (
              <NavLink key={item.name} to={item.path} className="nav-item">
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="content">
          <header className="topbar">
            <input type="text" placeholder="Search..." className="search" />
            <div className="profile">
              {/* <img src="https://i.pravatar.cc/40" alt="avatar" /> */}
              <span>Student HUB</span>
            </div>
          </header>
          <main className="dashboard-main">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              
              {/* Extendable routes here */}
            </Routes>
          </main>
        </div>
      </div>
  );
};

export default Dashboard;

