import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import loungeImg from "../assets/lounge.webp";
import { createClient } from "@supabase/supabase-js";
import "./pageCSS/LoungeDetails.css";

const supabaseUrl = "https://jujiylsufgygferkchhn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aml5bHN1Zmd5Z2ZlcmtjaGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjQ1OTYsImV4cCI6MjEwNjI0MDU5Nn0.n9hHtuBKbtStt_ZzozOwglugUIocCJ-QpmHtKBIR1hw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoungeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Unpack state passed either from Lounges or HeroSection
  const passedState = location.state || {};
  const initialLounge = passedState.lounge || {
    title: "VIP Lounge Standard",
    price: 50,
    image: loungeImg,
  };

  const [lounge, setLounge] = useState(initialLounge);

  // If passedState has search/hero parameters, consider search done
  const hasHeroData = Boolean(
    passedState.arrivalCity || passedState.arrivalDate || passedState.arrivalAirline
  );
  const [isSearchDone, setIsSearchDone] = useState(hasHeroData);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    departureAirport:
      passedState.departureAirport || "Queen Alia International Airport",
    arrivalCity: passedState.arrivalCity || "",
    departureDate: passedState.arrivalDate || passedState.departureDate || "",
    airlineName:
      passedState.arrivalAirline || passedState.airlineName || "",
    flightNumber:
      passedState.arrivalFlightNumber || passedState.flightNumber || "",
    loungeHours: passedState.loungeHours || "3",
    guests: passedState.totalGuests
      ? String(passedState.totalGuests)
      : "1",
  });

  // Keep form updated if state changes
  useEffect(() => {
    if (location.state) {
      const state = location.state;
      if (state.lounge) {
        setLounge(state.lounge);
      }
      if (state.arrivalCity || state.arrivalDate || state.arrivalAirline) {
        setIsSearchDone(true);
      }
      setFormData((prev) => ({
        ...prev,
        departureAirport:
          state.departureAirport || prev.departureAirport,
        arrivalCity: state.arrivalCity || prev.arrivalCity,
        departureDate:
          state.arrivalDate || state.departureDate || prev.departureDate,
        airlineName:
          state.arrivalAirline || state.airlineName || prev.airlineName,
        flightNumber:
          state.arrivalFlightNumber || state.flightNumber || prev.flightNumber,
        loungeHours: state.loungeHours || prev.loungeHours,
        guests: state.totalGuests ? String(state.totalGuests) : prev.guests,
      }));
    }
  }, [location.state]);

  const getImageSource = (img) => {
    if (!img) return loungeImg;
    if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
      return img;
    }
    return img;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Trigger search / show options
  const handleSearchAndShowDetails = (e) => {
    e.preventDefault();
    if (!formData.arrivalCity || !formData.departureDate || !formData.flightNumber) {
      alert("Please fill in all required fields before searching.");
      return;
    }
    setIsSearchDone(true);
  };

  const handleBooking = async () => {
    if (!formData.arrivalCity || !formData.departureDate || !formData.flightNumber) {
      alert("يرجى تعبئة كافة الحقول المطلوبة قبل الحجز.");
      return;
    }

    setLoading(true);

    try {
      // Parse numeric price without currency symbols
      const numericPrice = typeof lounge.price === "number" 
        ? lounge.price 
        : parseFloat(lounge.price) || 0;

      const { data, error } = await supabase.from("bookings").insert([
        {
          service_type: "lounge",
          booking_type: lounge?.title || "Lounge Booking",
          details: {
            price: numericPrice,
            lounge_title: lounge?.title,
            lounge_price: numericPrice,
            departure_airport: formData.departureAirport,
            arrival_city: formData.arrivalCity,
            departure_date: formData.departureDate,
            airline_name: formData.airlineName,
            flight_number: formData.flightNumber,
            lounge_hours: formData.loungeHours,
            totalGuests: Number(formData.guests),
            guests: formData.guests,
          },
        },
      ]);

      if (error) throw error;

      alert("تم الحجز بنجاح وحفظ البيانات في Supabase!");
      navigate("/cart");
    } catch (error) {
      console.error("Error booking lounge:", error);
      alert(`حدث خطأ أثناء الحجز: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const displayPrice =
    typeof lounge.price === "number"
      ? `${lounge.price.toFixed(2)}$`
      : lounge.price;

  return (
    <>
      <Navbar />

      <main className="lounge-details-page">
        {/* Header */}
        <div className="details-header">
          <h2>Lounges Details</h2>
          <p>Home _ Lounges Details</p>
        </div>

        {/* ALWAYS SHOW LOUNGE IMAGE SLIDER */}
        <section className="lounge-detail-slider">
          <div className="detail-slider-card">
            <img
              src={getImageSource(lounge.image)}
              alt={lounge.title || "Lounge Image"}
            />
            <div className="detail-slider-overlay"></div>
            <div className="detail-slider-content">
              <h3>{lounge.title}</h3>
              <div className="slider-price">
                <span>Starting From</span>
                <strong>{displayPrice}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="lounge-detail-header">
          <h1>Lounge - {lounge.title}</h1>
          <div className="lounge-detail-price">
            <span>Starting From</span>
            <strong>{displayPrice}</strong>
          </div>
        </section>

        {/* 1. DIRECT FORM (WHEN USER HAS NOT SUBMITTED FLIGHT DETAILS YET) */}
        {!isSearchDone ? (
          <section className="lounge-booking-box direct-form-section">
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Enter Flight Details to View Lounge Services
            </h2>

            <form onSubmit={handleSearchAndShowDetails}>
              <div className="lounge-booking-grid">
                <div className="booking-field disabled-field">
                  <label>Departure Airport</label>
                  <input
                    type="text"
                    value={formData.departureAirport}
                    disabled
                  />
                </div>

                <div className="booking-field">
                  <label>Arrival City</label>
                  <select
                    name="arrivalCity"
                    value={formData.arrivalCity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Arrival City</option>
                    <option value="Beirut">Beirut</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Istanbul">Istanbul</option>
                    <option value="Paris">Paris</option>
                  </select>
                </div>

                <div className="booking-field">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Airline Name</label>
                  <select
                    name="airlineName"
                    value={formData.airlineName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Airline Name</option>
                    <option value="MEA">MEA</option>
                    <option value="Emirates">Emirates</option>
                    <option value="Turkish Airlines">Turkish Airlines</option>
                    <option value="Qatar Airways">Qatar Airways</option>
                  </select>
                </div>

                <div className="booking-field">
                  <label>Flight Number</label>
                  <input
                    type="text"
                    name="flightNumber"
                    placeholder="Flight Number"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Select Lounge Hours</label>
                  <select
                    name="loungeHours"
                    value={formData.loungeHours}
                    onChange={handleChange}
                  >
                    <option value="3">3 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="9">9 Hours</option>
                  </select>
                </div>
              </div>

              <div className="booking-button-row" style={{ marginTop: "20px" }}>
                <button type="submit" className="lounge-final-book-btn">
                  ⌕ Search Lounge Packages
                </button>
              </div>
            </form>
          </section>
        ) : (
          /* 2. SUMMARY & FINAL BOOKING CONFIRMATION */
          <>
            <div
              className="booking-summary-bar"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                background: "#f8f9fa",
                borderRadius: "8px",
                margin: "20px auto",
                maxWidth: "1100px",
              }}
            >
              <div>
                <strong>Trip Details: </strong>
                {formData.arrivalCity} | {formData.departureDate} |{" "}
                {formData.airlineName} ({formData.flightNumber}) |{" "}
                {formData.loungeHours} Hours | {formData.guests} Guest(s)
              </div>
              <button
                type="button"
                onClick={() => setIsSearchDone(false)}
                style={{
                  background: "transparent",
                  color: "#007bff",
                  border: "1px solid #007bff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit Details
              </button>
            </div>

            <section className="lounge-booking-box">
              <div className="booking-button-row">
                <button
                  className="lounge-final-book-btn"
                  onClick={handleBooking}
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Confirm & Book Now"}
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default LoungeDetails;