import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSuitcase,
  faCircle,
  faPlane,
  faCalendarAlt,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import "./pageCSS/TransportationDetails.css";

// قائمة افتراضية احتياطية للسيارات
const DEFAULT_CARS = [
  {
    id: 1,
    title: "Mercedes Benz S-Class 320",
    price: 191.0,
    passengers: 3,
    baggages: 3,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "BMW 7 Series Sedan",
    price: 180.0,
    passengers: 3,
    baggages: 2,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Audi A8 Luxury",
    price: 175.0,
    passengers: 4,
    baggages: 3,
    image:
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Range Rover Vogue",
    price: 220.0,
    passengers: 5,
    baggages: 4,
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "IM LS7 Electric SUV",
    price: 210.0,
    passengers: 4,
    baggages: 3,
    image:
      "https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=800&q=80",
  },
];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TransportationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const passedState = location.state || {};
  const initialCar = passedState.car;

  const hasSearchDetails = Boolean(
    passedState.date ||
      passedState.arrivalDate ||
      passedState.departureDate ||
      passedState.locationCity ||
      passedState.flightNumber ||
      initialCar
  );

  const [isSearchDone, setIsSearchDone] = useState(hasSearchDetails);
  const [carsList, setCarsList] = useState(DEFAULT_CARS);
  const [loadingCars, setLoadingCars] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tripType, setTripType] = useState(passedState.tripType || "arrival");
  const [loading, setLoading] = useState(false);

  // التحكم بحالة فتح وإغلاق المودال
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    locationCity: passedState.locationCity || "",
    departureCity: passedState.departureCity || passedState.arrivalCity || "",
    airport: passedState.airport || "Queen Alia International Airport",
    date: passedState.date || passedState.arrivalDate || passedState.departureDate || "",
    airlineName: passedState.airlineName || passedState.arrivalAirline || "",
    flightNumber: passedState.flightNumber || passedState.arrivalFlightNumber || "",
    guests: passedState.guests || "Guests: 1, Baggage: 0",
  });

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      if (
        state.date ||
        state.arrivalDate ||
        state.departureDate ||
        state.locationCity ||
        state.flightNumber ||
        state.car
      ) {
        setIsSearchDone(true);
      }
      setFormData((prev) => ({
        ...prev,
        locationCity: state.locationCity || prev.locationCity,
        departureCity: state.departureCity || state.arrivalCity || prev.departureCity,
        airport: state.airport || prev.airport,
        date: state.date || state.arrivalDate || state.departureDate || prev.date,
        airlineName: state.airlineName || state.arrivalAirline || prev.airlineName,
        flightNumber: state.flightNumber || state.arrivalFlightNumber || prev.flightNumber,
        guests: state.guests || prev.guests,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTransportationData = async () => {
      try {
        setLoadingCars(true);
        const response = await fetch(`${API_BASE_URL}/api/transportation`);
        if (!response.ok) {
          throw new Error("Failed to fetch transportation data");
        }
        const data = await response.json();

        if (data && data.length > 0) {
          const formattedData = data.map((item) => {
            const rawItemPrice = item.price ?? item.cost ?? item.rate ?? item.vehiclePrice ?? 150;
            return {
              id: item.id,
              title: item.title || item.name || "Luxury Car",
              price: Number(rawItemPrice) || 0,
              passengers: item.passengers || item.capacity || 3,
              baggages: item.baggages || item.baggage || 3,
              image: item.image_url || item.image || DEFAULT_CARS[0].image,
            };
          });

          let list = formattedData;
          if (initialCar && !list.some((c) => c.id === initialCar.id)) {
            list = [{
              ...initialCar,
              price: Number(initialCar.price || initialCar.cost || 150)
            }, ...list];
          }

          setCarsList(list);

          if (initialCar) {
            const idx = list.findIndex(
              (c) => c.title === initialCar.title || c.id === initialCar.id
            );
            if (idx !== -1) setCurrentIndex(idx);
          }
        }
      } catch (err) {
        console.error("Error fetching cars:", err.message);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchTransportationData();
  }, [initialCar]);

  // التنقل بين السيارات
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carsList.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carsList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInitialFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.locationCity) {
      alert("Please fill in required trip details (Date & Drop-Off/Pick-Up Location).");
      return;
    }
    setIsSearchDone(true);
  };

const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.date) {
      alert("Please select a date for your transfer.");
      setIsSearchDone(false);
      setIsModalOpen(false);
      return;
    }

    setLoading(true);

    try {
      const currentCar = carsList[currentIndex] || DEFAULT_CARS[0];
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const guestMatch = formData.guests.match(/Guests:\s*(\d+)/) || formData.guests.match(/(\d+)-/);
      const guestCount = guestMatch ? parseInt(guestMatch[1], 10) : 1;

      // 🔍 1. استخراج السعر بجميع المسميات الممكنة
      let calculatedPrice = 
        currentCar.price ?? 
        currentCar.cost ?? 
        currentCar.rate ?? 
        currentCar.vehiclePrice ?? 
        0;

      calculatedPrice = Number(calculatedPrice);

      // 🔍 2. إذا كان السعر 0 أو NaN أو غير معرّف، خذ السعر الاحتياطي من القائمة الافتراضية
      if (!calculatedPrice || isNaN(calculatedPrice)) {
        const fallbackCar = DEFAULT_CARS.find(c => c.title === currentCar.title) || DEFAULT_CARS[0];
        calculatedPrice = fallbackCar.price || 150;
      }

      // إرسال الطلب بنفس الهيكلية تماماً للخدمات الأخرى
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          serviceType: "transportation",
          bookingType: currentCar.title || "Transportation",
          totalGuests: guestCount,
          totalPrice: calculatedPrice,
          total_price: calculatedPrice,
          amount: calculatedPrice,

          // البيانات التي تدخل داخل كائن details (jsonb) في Supabase
          formData: {
            car_id: currentCar.id,
            vehicle_name: currentCar.title,
            title: currentCar.title || "Transportation",
            price: calculatedPrice, // 👈 سينتقل دائماً برقم صحيح ولن يكون null أبداً
            vehiclePrice: calculatedPrice,
            totalPrice: calculatedPrice,

            trip_type: tripType,
            pickup_dropoff_location: formData.locationCity,
            city: formData.departureCity,
            airport: formData.airport,
            transfer_date: formData.date,
            airline: formData.airlineName,
            flight_number: formData.flightNumber,
            guests_and_baggage: formData.guests,
            totalGuests: guestCount,
          },
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit booking");
      }

      alert("Transportation booking created successfully!");
      setIsModalOpen(false);
      navigate("/cart");
    } catch (error) {
      console.error("Error creating transportation booking:", error);
      alert(`Booking Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentCar = carsList[currentIndex] || DEFAULT_CARS[0];
  const prevCar =
    carsList[(currentIndex - 1 + carsList.length) % carsList.length] || DEFAULT_CARS[0];
  const nextCar =
    carsList[(currentIndex + 1) % carsList.length] || DEFAULT_CARS[0];

  const formatPrice = (p) => {
    const num = Number(p) || 0;
    return `$${num.toFixed(2)}`;
  };

  if (loadingCars) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Loading Transportation Details...</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="transport-details-page">
        {/* ================= HERO ================= */}
        <section className="transport-details-hero">
          <div className="transport-details-container">
            <h1>Car Details</h1>
            <div className="transport-details-breadcrumb">
              <span>Home</span>
              <span className="breadcrumb-line">_</span>
              <span>Car Details</span>
            </div>
          </div>
        </section>

        {/* زر تجريبي لفتح المودال مباشرة إذا كنت تريده كـ Popup */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "10px 24px",
              background: "#0c3981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Open Car Selection Modal
          </button>
        </div>

        {/* 1. DIRECT ACCESS FORM */}
        {!isSearchDone ? (
          <section
            className="direct-transport-form"
            style={{
              maxWidth: "900px",
              margin: "30px auto",
              padding: "30px",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Enter Transportation Details to View Cars
            </h2>

            <div
              className="trip-type-buttons"
              style={{ justifyContent: "center", marginBottom: "20px" }}
            >
              <button
                type="button"
                className={tripType === "arrival" ? "trip-btn active" : "trip-btn"}
                onClick={() => setTripType("arrival")}
              >
                <FontAwesomeIcon icon={faCircle} /> Arrival
              </button>
              <button
                type="button"
                className={tripType === "departure" ? "trip-btn active" : "trip-btn departure"}
                onClick={() => setTripType("departure")}
              >
                <FontAwesomeIcon icon={faCircle} /> Departure
              </button>
            </div>

            <form onSubmit={handleInitialFormSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                }}
              >
                {tripType === "arrival" ? (
                  <>
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Pick-Up Location
                      </label>
                      <input
                        type="text"
                        value={formData.airport}
                        disabled
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          background: "#e9ecef",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Select Drop-Off Location *
                      </label>
                      <select
                        name="locationCity"
                        value={formData.locationCity}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                      >
                        <option value="">Select Drop-Off Location</option>
                        <option value="Amman">Amman</option>
                        <option value="Dead Sea">Dead Sea</option>
                        <option value="Hotel">Hotel</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Select Pick-Up Location *
                      </label>
                      <select
                        name="locationCity"
                        value={formData.locationCity}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                      >
                        <option value="">Select Pick-Up Location</option>
                        <option value="Amman">Amman</option>
                        <option value="Dead Sea">Dead Sea</option>
                        <option value="Hotel">Hotel</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Drop-Off Location
                      </label>
                      <input
                        type="text"
                        value={formData.airport}
                        disabled
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          background: "#e9ecef",
                        }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    {tripType === "arrival" ? "Departure City" : "Destination City"}
                  </label>
                  <select
                    name="departureCity"
                    value={formData.departureCity}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="">Select City</option>
                    <option value="Amman">Amman</option>
                    <option value="Beirut">Beirut</option>
                    <option value="Aqaba">Aqaba</option>
                    <option value="Dubai">Dubai</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Transfer Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Airline Name
                  </label>
                  <select
                    name="airlineName"
                    value={formData.airlineName}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="">Select Airline</option>
                    <option value="MEA">MEA</option>
                    <option value="Royal Jordanian">Royal Jordanian</option>
                    <option value="Emirates">Emirates</option>
                    <option value="Qatar Airways">Qatar Airways</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Flight Number
                  </label>
                  <input
                    type="text"
                    name="flightNumber"
                    placeholder="e.g. RJ182"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "25px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 30px",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Find Available Cars
                </button>
              </div>
            </form>
          </section>
        ) : (
          /* 2. CARS SLIDER AND BOOKING SECTIONS */
          <>
            {/* ================= CAR SLIDER ================= */}
            <section className="car-slider-section">
              <button className="car-slider-arrow left" onClick={handlePrev}>
                ‹
              </button>

              <div
                className="car-side-card left-card"
                onClick={handlePrev}
                style={{ cursor: "pointer" }}
              >
                <img src={prevCar.image} alt={prevCar.title} />
                <div className="car-side-overlay"></div>
                <div className="car-side-content">
                  <h3>{prevCar.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                  >
                    Select
                  </button>
                  <div className="side-price">
                    <span>Starting From</span>
                    <strong>{formatPrice(prevCar.price)}</strong>
                  </div>
                </div>
              </div>

              <div className="car-main-card">
                <img src={currentCar.image} alt={currentCar.title} />
                <div className="car-main-overlay"></div>
                <div className="car-main-content">
                  <h3>{currentCar.title}</h3>
                  <button onClick={handleBookingSubmit} disabled={loading}>
                    {loading ? "Processing..." : "Book Now"}
                  </button>
                  <div className="main-image-price">
                    <span>Starting From</span>
                    <strong>{formatPrice(currentCar.price)}</strong>
                  </div>
                </div>
              </div>

              <div
                className="car-side-card right-card"
                onClick={handleNext}
                style={{ cursor: "pointer" }}
              >
                <img src={nextCar.image} alt={nextCar.title} />
                <div className="car-side-overlay"></div>
                <div className="car-side-content">
                  <h3>{nextCar.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                  >
                    Select
                  </button>
                  <div className="side-price">
                    <span>Starting From</span>
                    <strong>{formatPrice(nextCar.price)}</strong>
                  </div>
                </div>
              </div>

              <button className="car-slider-arrow right" onClick={handleNext}>
                ›
              </button>
            </section>

            {/* ================= CAR TITLE & INFO ================= */}
            <section className="car-information">
              <div className="car-title-row">
                <h2>Car - {currentCar.title}</h2>
                <div className="car-starting-price">
                  <span>Starting From</span>
                  <strong>{formatPrice(currentCar.price)}</strong>
                </div>
              </div>

              <div
                className="car-features"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <div className="car-feature">
                    <FontAwesomeIcon icon={faUser} />
                    <span>{currentCar.passengers || 3} Passengers</span>
                  </div>

                  <div className="car-feature">
                    <FontAwesomeIcon icon={faSuitcase} />
                    <span>{currentCar.baggages || 3} Baggages</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSearchDone(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid #007bff",
                    color: "#007bff",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit Details
                </button>
              </div>
            </section>

            {/* ================= BOOKING BOX ================= */}
            <section className="car-booking-box">
              <div className="trip-type-buttons">
                <button
                  className={
                    tripType === "arrival" ? "trip-btn active" : "trip-btn"
                  }
                  onClick={() => setTripType("arrival")}
                >
                  <FontAwesomeIcon icon={faCircle} />
                  Arrival
                </button>

                <button
                  className={
                    tripType === "departure"
                      ? "trip-btn active"
                      : "trip-btn departure"
                  }
                  onClick={() => setTripType("departure")}
                >
                  <FontAwesomeIcon icon={faCircle} />
                  Departure
                </button>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div className="car-booking-grid">
                  {tripType === "arrival" ? (
                    <>
                      <div className="car-field disabled">
                        <label>Pick-Up Location (Airport)</label>
                        <div className="field-input">
                          <span>Queen Alia International Airport</span>
                          <FontAwesomeIcon icon={faPlane} />
                        </div>
                      </div>

                      <div className="car-field">
                        <label>Select Drop-Off Location</label>
                        <select
                          name="locationCity"
                          value={formData.locationCity}
                          onChange={handleChange}
                        >
                          <option value="">Select Drop-Off Location</option>
                          <option value="Amman">Amman</option>
                          <option value="Dead Sea">Dead Sea</option>
                          <option value="Hotel">Hotel</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="car-field">
                        <label>Select Pick-Up Location</label>
                        <select
                          name="locationCity"
                          value={formData.locationCity}
                          onChange={handleChange}
                        >
                          <option value="">Select Pick-Up Location</option>
                          <option value="Amman">Amman</option>
                          <option value="Dead Sea">Dead Sea</option>
                          <option value="Hotel">Hotel</option>
                        </select>
                      </div>

                      <div className="car-field disabled">
                        <label>Drop-Off Location (Airport)</label>
                        <div className="field-input">
                          <span>Queen Alia International Airport</span>
                          <FontAwesomeIcon icon={faPlane} />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="car-field">
                    <label>
                      {tripType === "arrival"
                        ? "Departure City"
                        : "Destination City"}
                    </label>
                    <select
                      name="departureCity"
                      value={formData.departureCity}
                      onChange={handleChange}
                    >
                      <option value="">
                        {tripType === "arrival"
                          ? "Departure City"
                          : "Destination City"}
                      </option>
                      <option value="Amman">Amman</option>
                      <option value="Beirut">Beirut</option>
                      <option value="Aqaba">Aqaba</option>
                      <option value="Dubai">Dubai</option>
                    </select>
                  </div>

                  <div className="car-field">
                    <label>
                      {tripType === "arrival" ? "Arrival Date" : "Departure Date"}
                    </label>
                    <div className="date-input">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                      />
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                  </div>

                  <div className="car-field">
                    <label>Airline Name</label>
                    <select
                      name="airlineName"
                      value={formData.airlineName}
                      onChange={handleChange}
                    >
                      <option value="">Airline Name</option>
                      <option value="MEA">MEA</option>
                      <option value="Royal Jordanian">Royal Jordanian</option>
                      <option value="Emirates">Emirates</option>
                      <option value="Qatar Airways">Qatar Airways</option>
                      <option value="Turkish Airlines">Turkish Airlines</option>
                    </select>
                  </div>

                  <div className="car-field">
                    <label>Flight Number</label>
                    <input
                      type="text"
                      name="flightNumber"
                      placeholder="Flight Number (e.g. RJ182)"
                      value={formData.flightNumber}
                      onChange={handleChange}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                      }}
                    />
                  </div>

                  <div className="car-field">
                    <label>Guests & Baggage</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                    >
                      <option value="Guests: 1, Baggage: 0">Guests: 1, Baggage: 0</option>
                      <option value="Guests: 2, Baggage: 1">Guests: 2, Baggage: 1</option>
                      <option value="Guests: 3, Baggage: 2">Guests: 3, Baggage: 2</option>
                      <option value="Guests: 4, Baggage: 3">Guests: 4, Baggage: 3</option>
                    </select>
                  </div>
                </div>

                <div className="car-book-button-container">
                  <button
                    type="submit"
                    className="car-final-book-btn"
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                    {loading ? "Processing..." : "Book Now"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}

        {/* ================= MODAL WITH CAR SLIDER ================= */}
        {isModalOpen && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              className="modal-content"
              style={{
                background: "#ffffff",
                width: "90%",
                maxWidth: "950px",
                borderRadius: "16px",
                padding: "30px",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  border: "none",
                  background: "transparent",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#666",
                  zIndex: 10,
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {/* 1. MODAL SLIDER (SHOWING MULTIPLE CARS) */}
              <div className="modal-car-slider">
                <button className="modal-nav left" onClick={handlePrev}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {/* Left side preview car */}
                <div className="car-card-side" onClick={handlePrev}>
                  <img src={prevCar.image} alt={prevCar.title} />
                  <h3>{prevCar.title}</h3>
                </div>

                {/* Main Active car */}
                <div className="car-card-active">
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "#0c3981",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      zIndex: 6,
                    }}
                  >
                    Included
                  </span>
                  <img src={currentCar.image} alt={currentCar.title} />
                  <h3>{currentCar.title}</h3>
                </div>

                {/* Right side preview car */}
                <div className="car-card-side" onClick={handleNext}>
                  <img src={nextCar.image} alt={nextCar.title} />
                  <h3>{nextCar.title}</h3>
                </div>

                <button className="modal-nav right" onClick={handleNext}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>

              {/* 2. CAR DETAILS */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: "10px 0 5px", fontSize: "24px" }}>
                  {currentCar.title}
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  <span>
                    <FontAwesomeIcon icon={faUser} /> {currentCar.passengers} Passengers
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faSuitcase} /> {currentCar.baggages} Baggage
                  </span>
                </div>
                <p style={{ color: "#777", fontSize: "14px", marginTop: "10px" }}>
                  Travel in style with the {currentCar.title}, a premium vehicle combining luxury, comfort, and advanced technology.
                </p>
              </div>

              {/* 3. QUICK FORM INSIDE MODAL */}
              <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
                    Pick-Up / Drop-Off Location
                  </label>
                  <select
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="">Choose location</option>
                    <option value="Amman">Amman</option>
                    <option value="Dead Sea">Dead Sea</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Number of cars</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#0c3981",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span>1</span>
                    <button
                      type="button"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#0c3981",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. MODAL FOOTER BUTTONS */}
              <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
                <button
                  onClick={handleBookingSubmit}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#0c3981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Processing..." : "Add"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#e2e8f0",
                    color: "#333",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default TransportationDetails;