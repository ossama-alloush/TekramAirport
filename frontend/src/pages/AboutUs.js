import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './pageCSS/AboutUs.css';
import { Link } from "react-router-dom";
const AboutUs = () => {
  const testimonials = [
    {
      id: 1,
      title: "Seamless Transitions",
      desc: "Fast-track through all airport formalities at Queen Alia International Airport to ensure your time is spent where it matters most.",
      date: "Jan 20, 2026"
    },
    {
      id: 2,
      title: "Jordanian Hospitality",
      desc: "Experience a warm, professional welcome from our expert team, dedicated to providing world-class service from the moment you arrive.",
      date: "Feb 05, 2026"
    },
    {
      id: 3,
      title: "Ultimate Comfort",
      desc: "Escape the airport hustle in a peaceful environment designed for relaxation, ensuring you start your journey feeling refreshed.",
      date: "Mar 12, 2026"
    },
    {
      id: 4,
      title: "24/7 Availability",
      desc: "Our dedicated staff is available at the airport around the clock, every day of the week, to assist with all your travel needs.",
      date: "Mar 12, 2026"
    },
    {
      id: 5,
      title: "Seamless Transitions",
      desc: "Fast-track through all airport formalities at Queen Alia International Airport to ensure your time is spent where it matters most.",
      date: "Jan 20, 2026"
    },
    {
      id: 6,
      title: "Jordanian Hospitality",
      desc: "Experience a warm, professional welcome from our expert team, dedicated to providing world-class service from the moment you arrive.",
      date: "Feb 05, 2026"
    },
    {
      id: 7,
      title: "Ultimate Comfort",
      desc: "Escape the airport hustle in a peaceful environment designed for relaxation, ensuring you start your journey feeling refreshed.",
      date: "Mar 12, 2026"
    },
    {
      id: 8,
      title: "24/7 Availability",
      desc: "Our dedicated staff is available at the airport around the clock, every day of the week, to assist with all your travel needs.",
      date: "Mar 12, 2026"
    },
    {
      id: 9,
      title: "Seamless Transitions",
      desc: "Fast-track through all airport formalities at Queen Alia International Airport to ensure your time is spent where it matters most.",
      date: "Jan 20, 2026"
    },
    {
      id: 10,
      title: "Jordanian Hospitality",
      desc: "Experience a warm, professional welcome from our expert team, dedicated to providing world-class service from the moment you arrive.",
      date: "Feb 05, 2026"
    }
  ];

  return (
    <div className="about-page">
      <Navbar />

      {/* Banner */}
      <div className="about-banner">
        <h2>About Us</h2>
        <p>Home / <span>About Us</span></p>
      </div>

      {/* Main Section */}
      <div className="about-section">
        <div className="about-content">
          <h3>About Us</h3>
          <h4>We Meet You with a Smile and Greet You with Tikram</h4>
          <p>
            Tekram, which is 100% owned by the Royal Jordanian Airline, provides many travel services at the airport.
            Providing a welcome to departing, arriving, and transit passengers at Queen Alia International Airport. Escorting travelers, completing immigration procedures, dedicate a fast track for them at the passport / immigration counter, assistance with the baggage, baggage wrapping, access to the "Crown" Lounge of the Royal Jordanian Airlines and Limousine & Bus cars that transport passengers between the airport terminal to and from the gates.
          </p>
          <p>
            Individual travelers, families, tour groups, multinational airlines, hotels, travel agencies, and others benefit from "Tekram" services, who can request any service through the counters.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
            alt="Airport Lounge"
          />
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="testimonial-section">
        <span className="subtitle">Testimonial</span>
        <h2>What People Have Said About Our Service</h2>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="card-header">
                <span className="user-icon">👤</span>
                <h5>{item.title}</h5>
              </div>
              <p>{item.desc}</p>
              <div className="card-footer">
                <span className="brand">TEKRAM</span>
                <span className="date">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;