import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './pageCSS/Services.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services data');
        }
        const data = await response.json();
        setServicesData(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <Navbar />

      {/* Banner */}
      <div className="services-banner">
        <h2>Services</h2>
        <p>Home / <span>Services</span></p>
      </div>

      {/* Services Grid */}
      <div className="services-container">
        {loading ? (
          <div className="services-loading" style={{ textAlign: 'center', padding: '3rem' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#e52326" />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading services from server...</p>
          </div>
        ) : error ? (
          <div className="services-error" style={{ color: '#e52326', textAlign: 'center', padding: '2rem' }}>
            <p>Failed to load services: {error}</p>
          </div>
        ) : (
          <div className="services-grid">
            {servicesData.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="service-card-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href={`#service-${service.id}`} className="read-more">
                    Read more &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;