import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./pageCSS/Transportation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSuitcase,
  faExchangeAlt,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Transportation = () => {
  const [carsData, setCarsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
const navigate = useNavigate();
  // 1. Fetching Data from Backend API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/transportation");
        if (!response.ok) {
          throw new Error("Failed to fetch transportation data");
        }
        const data = await response.json();
        setCarsData(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const carTypes = [
    "Convertibles",
    "Coupes",
    "Hatchbacks",
    "Minivans",
    "Sedan",
    "SUVs",
    "Trucks",
    "Wagons",
  ];

  const carFeatures = [
    "Airbag",
    "FM Radio",
    "Power Windows",
    "Sensor",
    "Speed Km",
    "Steering Wheel",
  ];

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleFeatureChange = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  // Filter Cars based on frontend state
  const filteredCars = carsData.filter((car) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(car.type);
    
    // Ensure features exist in database object (handling arrays or fallback)
    const featuresList = Array.isArray(car.features) ? car.features : [];
    const matchesFeature =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((f) => featuresList.includes(f));

    return matchesType && matchesFeature;
  });

  return (
    <>
      <Navbar />

      <div className="trans-page">
        {/* HERO SECTION */}
        <section className="trans-hero">
          <div className="trans-container">
            <h1>Transportation</h1>
            <div className="trans-breadcrumb">
              <span>Home</span> / <span>Transportation</span>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="trans-content trans-container">
          {/* SIDEBAR FILTER */}
          <aside className="trans-filter">
            <div className="trans-filter-title">
              <span>
                <FontAwesomeIcon icon={faExchangeAlt} />
              </span>
              <h3>Filter</h3>
            </div>

            <div className="trans-line"></div>

            {/* CAR TYPE */}
            <div className="trans-filter-section">
              <h4>Car Type</h4>
              {carTypes.map((type) => (
                <label className="trans-checkbox" key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <div className="trans-line"></div>

            {/* CAR FEATURES */}
            <div className="trans-filter-section">
              <h4>Car Features</h4>
              {carFeatures.map((feature) => (
                <label className="trans-checkbox" key={feature}>
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* CARS GRID */}
          <div className="trans-services">
            {loading ? (
              <div className="trans-loading" style={{ textAlign: "center", padding: "3rem" }}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#e52326" />
                <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading cars from server...</p>
              </div>
            ) : error ? (
              <div className="trans-error" style={{ color: "#e52326", textAlign: "center", padding: "2rem" }}>
                <p>Failed to load data: {error}</p>
              </div>
            ) : (
              <>
                <div className="trans-grid">
                  {filteredCars.map((car) => (
                    <div className="trans-card" key={car.id}>
                      <div className="trans-image">
                        <img src={car.image} alt={car.title} />
                      </div>

                      <div className="trans-card-content">
                        <h3>{car.title}</h3>

                        <div className="trans-info-row">
                          <span className="trans-info-item">
                            <FontAwesomeIcon icon={faUser} /> {car.passengers} Passengers
                          </span>
                          <span className="trans-info-item">
                            <FontAwesomeIcon icon={faSuitcase} /> {car.baggages} Baggages
                          </span>
                        </div>

                        <div className="trans-card-bottom">
                          <div className="trans-price">
                            <span>Starting From</span>
                            <strong>
                              {typeof car.price === "number" ? `$${car.price.toFixed(2)}` : car.price}
                            </strong>
                          </div>

                          <button
  className="trans-book-btn"
  onClick={() =>
    navigate("/transportation-details", {
      state: { car }
    })
  }
>
  Book Now
</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredCars.length === 0 && (
                  <div className="trans-no-results">
                    No cars found matching your selected filters.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Transportation;