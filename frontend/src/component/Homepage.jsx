import React from "react";
import '../css/Homepage.css';

const features = [
  {
    icon: "📅",
    title: "Campus Events",
    description: "Discover and join exciting events happening around campus.",
    link: "/events",
  },
  {
    icon: "💬",
    title: "Discussion Forums",
    description: "Engage in discussions and get answers to your questions.",
    link: "/forums",
  },
  {
    icon: "🏆",
    title: "Recognition",
    description: "Earn awards and recognition for your contributions.",
    link: "/recognition",
  },
];

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="navbar">
        <div className="logo">🎓 StudentHub</div>
        <nav>
          <ul>
            <li><a href="/events">Events</a></li>
            <li><a href="/forums">Forums</a></li>
            <li><a href="/profiles">Profile</a></li>
            <li><a href="/login">Sign Up</a></li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <h1>Welcome to StudentHub</h1>
        <p>Connect with your peers, join events, and engage in meaningful discussions.</p>

        <div className="features">
          {features.map((feature, index) => (
            <a href={feature.link} key={index} className="card">
              <span className="icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Homepage;
