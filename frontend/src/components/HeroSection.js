import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/pageCSS/HeroSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faCouch,
  faCar,
  faSearch,
  faPlaneArrival,
  faPlaneDeparture,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";

function HeroSection() {
  const navigate = useNavigate();
  const DEFAULT_AIRPORT = "Rene Mouawad Airport";

  const [serviceType, setServiceType] = useState("Meet & Greet");
  const [bookingType, setBookingType] = useState("Arrival");
  const [loading, setLoading] = useState(false);

  const [counts, setCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    baggage: 0,
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const [formData, setFormData] = useState({
    departureCity: "",
    arrivalCity: "",
    arrivalAirport: DEFAULT_AIRPORT,
    departureAirport: DEFAULT_AIRPORT,
    arrivalDate: "",
    departureDate: "",
    arrivalAirline: "",
    departureAirline: "",
    arrivalFlightNumber: "",
    departureFlightNumber: "",
    loungeHours: "",
    pickUpLocation: "",
  });

  const [message, setMessage] = useState({ text: "", isError: false });

  const cities = ["Beirut", "Tripoli", "Sidon", "Jounieh", "Zahle"];
  const airlines = [
    "Middle East Airlines",
    "Emirates",
    "Qatar Airways",
    "Turkish Airlines",
    "Air France",
    "Etihad Airways",
  ];
  const loungeHoursList = ["2 Hours", "3 Hours", "4 Hours", "6 Hours", "Full Day"];
  const pickUpLocations = [
    "Hotel / Residence",
    "City Center",
    "Airport Terminal",
    "Custom Address",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ text: "", isError: false });
  };

  const handleServiceTypeChange = (type) => {
    setServiceType(type);
    setBookingType("Arrival");
    setMessage({ text: "", isError: false });
  };

  const handleBookingType = (type) => {
    setBookingType(type);
    setMessage({ text: "", isError: false });
  };

  const handleCountChange = (type, operation) => {
    setCounts((prev) => {
      const current = prev[type];
      const updated = operation === "inc" ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [type]: updated };
    });
  };

  const getTotalGuests = () => counts.adults + counts.children + counts.infants;

  const handleBooking = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      serviceType,
      bookingType: serviceType === "Lounge" ? "N/A" : bookingType,
      arrivalCity: formData.arrivalCity || "Beirut",
      arrivalDate: formData.arrivalDate || "2026-10-03",
      arrivalAirline: formData.arrivalAirline || "Middle East Airlines",
      arrivalFlightNumber: formData.arrivalFlightNumber || "ME201",
      totalGuests: getTotalGuests(),
      counts,
      ...formData,
    };

    // Determine target route according to chosen service type
    let targetPath = "/meet-and-greet-details";

    if (serviceType === "Lounge") {
      targetPath = "/lounge-details";
    } else if (serviceType === "Chauffeur Service") {
      targetPath = "/transportation-details";
    }

    // Dynamic redirect passing the payload state
    navigate(targetPath, { state: payload });
    setLoading(false);
  };

  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="eyebrow">Airport International Services</p>
        <h1>
          Elevate Your Airport
          <br />
          Journey
        </h1>
        <p className="eyebrow1">
          Experience comfort, speed and premium services at every step of your journey.
        </p>
      </div>

      <div className="booking-box">
        {/* Main Service Tabs */}
        <div className="service-tabs">
          <button
            type="button"
            className={serviceType === "Meet & Greet" ? "active" : ""}
            onClick={() => handleServiceTypeChange("Meet & Greet")}
          >
            <span><FontAwesomeIcon icon={faPlane} /></span> Meet & Greet
          </button>
          <button
            type="button"
            className={serviceType === "Lounge" ? "active" : ""}
            onClick={() => handleServiceTypeChange("Lounge")}
          >
            <span><FontAwesomeIcon icon={faCouch} /></span> Lounge
          </button>
          <button
            type="button"
            className={serviceType === "Chauffeur Service" ? "active" : ""}
            onClick={() => handleServiceTypeChange("Chauffeur Service")}
          >
            <span><FontAwesomeIcon icon={faCar} /></span> Chauffeur Service
          </button>
        </div>

        {/* Sub Tabs */}
        {(serviceType === "Meet & Greet" || serviceType === "Chauffeur Service") && (
          <div className="booking-tabs">
            {[
              { label: "Arrival", icon: faPlaneArrival },
              { label: "Departure", icon: faPlaneDeparture },
              ...(serviceType === "Meet & Greet" ? [{ label: "Transfer", icon: faExchangeAlt }] : []),
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={bookingType === tab.label ? "active" : ""}
                onClick={() => handleBookingType(tab.label)}
              >
                <span className="radio-circle"></span>
                <FontAwesomeIcon icon={tab.icon} style={{ marginRight: "6px" }} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Form Grid */}
        <form className="booking-grid" onSubmit={handleBooking}>
          {serviceType === "Meet & Greet" && bookingType === "Transfer" ? (
            <>
              <label>
                Departure City
                <select name="departureCity" value={formData.departureCity} onChange={handleChange}>
                  <option value="">Departure City</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>

              <label>
                Arrival Airport
                <input type="text" value={DEFAULT_AIRPORT} disabled className="disabled-input" readOnly />
              </label>

              <label>
                Arrival Date
                <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
              </label>

              <label>
                Airline Name
                <select name="arrivalAirline" value={formData.arrivalAirline} onChange={handleChange}>
                  <option value="">Airline Name</option>
                  {airlines.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>

              <label>
                Flight Number
                <input type="text" name="arrivalFlightNumber" placeholder="Flight Number" value={formData.arrivalFlightNumber} onChange={handleChange} />
              </label>

              <label>
                Departure Airport
                <input type="text" value={DEFAULT_AIRPORT} disabled className="disabled-input" readOnly />
              </label>

              <label>
                Arrival City
                <select name="arrivalCity" value={formData.arrivalCity} onChange={handleChange}>
                  <option value="">Arrival City</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>

              <label>
                Departure Date
                <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} />
              </label>

              <label>
                Airline Name
                <select name="departureAirline" value={formData.departureAirline} onChange={handleChange}>
                  <option value="">Airline Name</option>
                  {airlines.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>

              <label>
                Flight Number
                <input type="text" name="departureFlightNumber" placeholder="Flight Number" value={formData.departureFlightNumber} onChange={handleChange} />
              </label>
            </>
          ) : (
            <>
              {serviceType === "Chauffeur Service" && (
                <label>
                  Select Pick-Up Location
                  <select name="pickUpLocation" value={formData.pickUpLocation} onChange={handleChange}>
                    <option value="">Select Pick-Up Location</option>
                    {pickUpLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </label>
              )}

              <label>
                {bookingType === "Arrival" ? "Arrival Airport" : "Departure Airport"}
                <input type="text" value={DEFAULT_AIRPORT} disabled className="disabled-input" readOnly />
              </label>

              <label>
                {bookingType === "Arrival" ? "Arrival City" : "Departure City"}
                <select name="arrivalCity" value={formData.arrivalCity} onChange={handleChange}>
                  <option value="">{bookingType === "Arrival" ? "Arrival City" : "Departure City"}</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>

              <label>
                {bookingType === "Departure" ? "Departure Date" : "Arrival Date"}
                <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
              </label>

              <label>
                Airline Name
                <select name="arrivalAirline" value={formData.arrivalAirline} onChange={handleChange}>
                  <option value="">Airline Name</option>
                  {airlines.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>

              <label>
                Flight Number
                <input type="text" name="arrivalFlightNumber" placeholder="Flight Number" value={formData.arrivalFlightNumber} onChange={handleChange} />
              </label>

              {serviceType === "Lounge" && (
                <label>
                  Select Lounge Hours
                  <select name="loungeHours" value={formData.loungeHours} onChange={handleChange}>
                    <option value="">Select Lounge Hours</option>
                    {loungeHoursList.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </label>
              )}
            </>
          )}

          {/* Guest selector */}
          <div className="guest-selector-container">
            <label>Guests & Baggage</label>
            <button
              type="button"
              className="guest-picker-btn"
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            >
              {`Guests: ${getTotalGuests()} , Baggage: ${counts.baggage}`}
            </button>

            {showGuestDropdown && (
              <div className="guest-dropdown-menu">
                {["adults", "children", "infants", "baggage"].map((type) => (
                  <div className="counter-row" key={type}>
                    <div className="counter-label">
                      <strong style={{ textTransform: "capitalize" }}>{type}</strong>
                      {type === "children" && <small>(Age 3-12)</small>}
                      {type === "infants" && <small>(Age 0-2)</small>}
                    </div>
                    <div className="counter-controls">
                      <button type="button" onClick={() => handleCountChange(type, "dec")}>-</button>
                      <span>{counts[type]}</span>
                      <button type="button" onClick={() => handleCountChange(type, "inc")}>+</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="apply-btn" onClick={() => setShowGuestDropdown(false)}>
                  Apply
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="book-btn" disabled={loading}>
            <span className="search-icon"><FontAwesomeIcon icon={faSearch} /></span>
            {loading ? " Processing..." : " Book Now"}
          </button>
        </form>

        {message.text && (
          <p className={message.isError ? "booking-error" : "booking-success"}>
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}

export default HeroSection;