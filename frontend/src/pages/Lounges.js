import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./pageCSS/Lounges.css";
import loungeImg from "../assets/lounge.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const Lounges = () => {
  const [loungesData, setLoungesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
const navigate = useNavigate();
  // Fetch Lounges Data from Backend API
  useEffect(() => {
    const fetchLounges = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/lounges");
        if (!response.ok) {
          throw new Error("Failed to fetch lounges data");
        }
        const data = await response.json();
        setLoungesData(data);
      } catch (err) {
        console.error("Error fetching lounges:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLounges();
  }, []);

  const handleCheckboxChange = (hours) => {
    if (selectedHours.includes(hours)) {
      setSelectedHours(selectedHours.filter((h) => h !== hours));
    } else {
      setSelectedHours([...selectedHours, hours]);
    }
  };

  // Helper function handling image sources (Database URL or fallback local asset)
  const getImageSource = (img) => {
    if (!img) return loungeImg;
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    return loungeImg;
  };

  // Filter Lounges
  const filteredLounges =
    selectedHours.length === 0
      ? loungesData
      : loungesData.filter((lounge) => selectedHours.includes(Number(lounge.hours)));

  return (
    <>
      <Navbar />

      <div className="lounges-page">
        {/* HERO SECTION */}
        <section className="lounges-hero">
          <div className="lounges-container">
            <h1>Lounges</h1>
            <div className="lounges-breadcrumb">
              <span>Home</span> / <span>Lounges List</span>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="lounges-content lounges-container">
          {/* SIDEBAR FILTER */}
          <aside className="lounges-filter">
            <div className="lounges-filter-title">
              <span>
                <FontAwesomeIcon icon={faSlidersH} />
              </span>
              <h3>Filter</h3>
            </div>

            <div className="lounges-line"></div>

            <div className="lounges-filter-section">
              <h4>Hour</h4>

              {[3, 6, 9].map((hours) => (
                <label className="lounges-checkbox" key={hours}>
                  <input
                    type="checkbox"
                    checked={selectedHours.includes(hours)}
                    onChange={() => handleCheckboxChange(hours)}
                  />
                  <span>{hours} Hours</span>
                </label>
              ))}
            </div>
          </aside>

          {/* LOUNGES LIST */}
          <div className="lounges-services">
            {loading ? (
              <div className="lounges-loading" style={{ textAlign: "center", padding: "3rem" }}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#e52326" />
                <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading lounges from server...</p>
              </div>
            ) : error ? (
              <div className="lounges-error" style={{ color: "#e52326", textAlign: "center", padding: "2rem" }}>
                <p>Failed to load data: {error}</p>
              </div>
            ) : (
              <>
                <div className="lounges-grid">
                  {filteredLounges.map((lounge) => (
                    <div className="lounges-card" key={lounge.id}>
                      <div className="lounges-image">
                        <img src={getImageSource(lounge.image)} alt={lounge.title} />
                      </div>

                      <div className="lounges-card-content">
                        <h3>{lounge.title}</h3>

                        <div className="lounges-card-bottom">
                          <div className="lounges-price">
                            <span>Starting From</span>
                            <strong>
                              {typeof lounge.price === "number"
                                ? `$${lounge.price.toFixed(2)}`
                                : lounge.price}
                            </strong>
                          </div>

                          <button
  className="lounges-book-btn"
  onClick={() => navigate(`/lounge-details`, { state: { lounge } })}
>
  Book Now
</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredLounges.length === 0 && (
                  <div className="lounges-no-results">
                    No lounges found matching your filters.
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

export default Lounges;