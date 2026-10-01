import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './pageCSS/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Top Banner Cards */}
      <div className="contact-info-banner">
        <div className="info-card">
          <span className="icon">📍</span>
          <div>
            <h4>Address</h4>
            <p>Amman, Jordan - Queen Alia International Airport</p>
          </div>
        </div>

        <div className="info-card">
          <span className="icon">✉️</span>
          <div>
            <h4>Email Address</h4>
            <p>Reservations@Tikram.jo</p>
          </div>
        </div>

        <div className="info-card">
          <span className="icon">📞</span>
          <div>
            <h4>Contact Info</h4>
            <p>07 9899 7000</p>
          </div>
        </div>

        <div className="info-card">
          <span className="icon">🎧</span>
          <div>
            <h4>Suggestions And Complaint</h4>
            <p>support@Tikram.jo</p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="contact-container">
        {/* Left Side: Map */}
        <div className="map-section">
          <iframe
    title="Rene Mouawad Air Base Map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13149.336142340533!2d35.98925825!3d34.588889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1521fa583a48e895%3A0x8670c53bd1b88e07!2sRene%20Mouawad%20Air%20Base!5e0!3m2!1sen!2slb!4v1700000000000!5m2!1sen!2slb"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
  ></iframe>
        </div>

        {/* Right Side: Contact Form */}
        <div className="form-section">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;