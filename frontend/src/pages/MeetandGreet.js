import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Estaghlal useNavigate
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./pageCSS/MeetandGreet.css";
import gold from "../assets/gold.jpg"; 
import transit from "../assets/Transit.jpg";
import silver from "../assets/silver.jpg";
import platinum from "../assets/platinum.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";

// خريطة صور محلية للاستعانة بها في حال كان الرابط قادماً باسم الصورة أو مسار نسبي
const imageMap = {
  gold,
  transit,
  silver,
  platinum,
};

const MeetandGreet = () => {
  const navigate = useNavigate(); // Hook lal-tanaghol bain al-safahat
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    car: false,
    lounge: false,
    arrival: false,
    departure: false,
    transfer: false,
  });

  // Fetch Data from Backend API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/meet-and-greet");
        if (!response.ok) {
          throw new Error("Failed to fetch Meet & Greet services");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleFilterChange = (name) => {
    setFilters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // دالة المساعدة للحصول على مصدر الصورة المناسب
  const getImageSource = (img) => {
    if (!img) return gold;
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    return imageMap[img] || gold;
  };

  // دالة الفلترة الشاملة
  const filteredServices = services.filter((service) => {
    if (filters.car && !service.car) return false;
    if (filters.lounge && !service.lounge) return false;

    const isTripTypeSelected =
      filters.arrival || filters.departure || filters.transfer;

    if (isTripTypeSelected) {
      const matchesArrival = filters.arrival && service.tripType === "arrival";
      const matchesDeparture = filters.departure && service.tripType === "departure";
      const matchesTransfer = filters.transfer && service.tripType === "transfer";

      if (!matchesArrival && !matchesDeparture && !matchesTransfer) {
        return false;
      }
    }

    return true;
  });

  // Function la-tahweel al-mukhdim 3ala safhet al-details ma3 el-ID w al-Data
  const handleBookNow = (service) => {
    navigate(`/heroSection`, { state: { service } });
  };

  return (
    <>
      <Navbar />

      <div className="meet-greet-page">
        {/* HERO SECTION */}
        <section className="meet-greet-hero">
          <div className="meet-greet-container">
            <h1>Meet & Greet</h1>
            <div className="meet-greet-breadcrumb">
              <span>Home</span> / <span>Meet & Greet</span>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="meet-greet-content meet-greet-container">
          {/* FILTER SIDEBAR */}
          <aside className="meet-greet-filter">
            <div className="meet-greet-filter-title">
              <span><FontAwesomeIcon icon={faExchangeAlt} /></span>
              <h3>Filter</h3>
            </div>

            <div className="meet-greet-line"></div>

            <div className="meet-greet-filter-section">
              <h4>Included Services</h4>

              <label className="meet-greet-checkbox">
                <input
                  type="checkbox"
                  checked={filters.car}
                  onChange={() => handleFilterChange("car")}
                />
                <span>Car included</span>
              </label>

              <label className="meet-greet-checkbox">
                <input
                  type="checkbox"
                  checked={filters.lounge}
                  onChange={() => handleFilterChange("lounge")}
                />
                <span>Lounge included</span>
              </label>
            </div>

            <div className="meet-greet-line"></div>

            <div className="meet-greet-filter-section">
              <h4>Trip Type</h4>

              <label className="meet-greet-checkbox">
                <input
                  type="checkbox"
                  checked={filters.arrival}
                  onChange={() => handleFilterChange("arrival")}
                />
                <span>Arrival</span>
              </label>

              <label className="meet-greet-checkbox">
                <input
                  type="checkbox"
                  checked={filters.departure}
                  onChange={() => handleFilterChange("departure")}
                />
                <span>Departure</span>
              </label>

              <label className="meet-greet-checkbox">
                <input
                  type="checkbox"
                  checked={filters.transfer}
                  onChange={() => handleFilterChange("transfer")}
                />
                <span>Transfer</span>
              </label>
            </div>
          </aside>

          {/* SERVICES LIST */}
          <div className="meet-greet-services">
            {loading ? (
              <div className="meet-greet-loading" style={{ textAlign: "center", padding: "3rem" }}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#e52326" />
                <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading services from server...</p>
              </div>
            ) : error ? (
              <div className="meet-greet-error" style={{ color: "#e52326", textAlign: "center", padding: "2rem" }}>
                <p>Failed to load data: {error}</p>
              </div>
            ) : (
              <>
                <div className="meet-greet-grid">
                  {filteredServices.map((service) => (
                    <div className="meet-greet-card" key={service.id}>
                      <div className="meet-greet-image">
                        <img src={getImageSource(service.image)} alt={service.title} />
                        <span className="meet-greet-service-type">
                          {service.type}
                        </span>
                      </div>

                      <div className="meet-greet-card-content">
                        <h3>{service.title}</h3>

                        <div className="meet-greet-tags">
                          <span
                            className={
                              service.car
                                ? "meet-greet-tag included"
                                : "meet-greet-tag not-included"
                            }
                          >
                            {service.car ? "✓ Car Included" : "✕ Car Not Included"}
                          </span>

                          <span
                            className={
                              service.lounge
                                ? "meet-greet-tag included"
                                : "meet-greet-tag not-included"
                            }
                          >
                            {service.lounge
                              ? "✓ Lounge Included"
                              : "✕ Lounge Not Included"}
                          </span>
                        </div>

                        <div className="meet-greet-card-bottom">
                          <div className="meet-greet-price">
                            <span>Starting From</span>
                            <strong>
                              {typeof service.price === "number"
                                ? `$${service.price.toFixed(2)}`
                                : service.price}
                            </strong>
                          </div>

                          <button 
                            className="meet-greet-book-btn"
                            onClick={() => handleBookNow(service)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="meet-greet-no-results">
                    No services found matching your filters.
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

export default MeetandGreet;