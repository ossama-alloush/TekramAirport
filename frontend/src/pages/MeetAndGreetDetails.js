import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gold from "../assets/gold.jpg";
import transit from "../assets/Transit.jpg";
import silver from "../assets/silver.jpg";
import platinum from "../assets/platinum.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlaneDeparture,
  faCalendarAlt,
  faUser,
  faCouch,
  faCar,
  faChevronLeft,
  faChevronRight,
  faShoppingCart,
  faSuitcase,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./pageCSS/MeetAndGreetDetails.css";

const LOCAL_IMAGES = {
  silver: silver,
  gold: gold,
  transit: transit,
  platinum: platinum,
};

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
];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper function la-nesthsel image URL sa7ih mn Database
const getCarImageUrl = (item) => {
  const imgPath =
    item.image_url ||
    item.image ||
    item.car_image ||
    item.img ||
    item.photo ||
    "";

  if (!imgPath) return DEFAULT_CARS[0].image;
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  return `${API_BASE_URL}/${imgPath.replace(/^\//, "")}`;
};

function MeetAndGreetDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const passedState = location.state || {};

  // Check if user came from HeroSection with valid search data
  const hasFlightData = Boolean(
    passedState.arrivalCity || passedState.arrivalDate || passedState.arrivalFlightNumber
  );

  const [isSearchDone, setIsSearchDone] = useState(hasFlightData);

  // Form State for flight details
  const [flightForm, setFlightForm] = useState({
    departureAirport: passedState.departureAirport || "Queen Alia International Airport",
    arrivalCity: passedState.arrivalCity || "",
    arrivalDate: passedState.arrivalDate || passedState.departureDate || "",
    arrivalAirline: passedState.arrivalAirline || passedState.airlineName || "",
    arrivalFlightNumber: passedState.arrivalFlightNumber || passedState.flightNumber || "",
    totalGuests: passedState.totalGuests || 1,
  });

  const [tiers, setTiers] = useState([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCarModal, setShowCarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");

  // DB Cars States
  const [carsList, setCarsList] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carIndex, setCarIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carCount, setCarCount] = useState(1);

  // Sync state if location.state changes
  useEffect(() => {
    if (location.state) {
      const state = location.state;
      if (state.arrivalCity || state.arrivalDate || state.arrivalFlightNumber) {
        setIsSearchDone(true);
      }
      setFlightForm((prev) => ({
        ...prev,
        departureAirport: state.departureAirport || prev.departureAirport,
        arrivalCity: state.arrivalCity || prev.arrivalCity,
        arrivalDate: state.arrivalDate || state.departureDate || prev.arrivalDate,
        arrivalAirline: state.arrivalAirline || state.airlineName || prev.arrivalAirline,
        arrivalFlightNumber: state.arrivalFlightNumber || state.flightNumber || prev.arrivalFlightNumber,
        totalGuests: state.totalGuests || prev.totalGuests,
      }));
    }
  }, [location.state]);

  // Fetch Meet & Greet services from Express API
  useEffect(() => {
    const fetchMeetAndGreet = async () => {
      try {
        setLoadingTiers(true);
        const response = await fetch(`${API_BASE_URL}/api/meet-and-greet`);

        if (!response.ok) {
          throw new Error("فشل في جلب البيانات من السيرفر");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const formattedTiers = data.map((item) => ({
            id: item.id,
            key: item.key || item.name?.toLowerCase().split(" ")[0] || "silver",
            name: item.name || item.title || "Meet & Greet Service",
            price: Number(item.price || 0),
            loungeIncluded: item.lounge_included ?? item.loungeIncluded ?? false,
            carIncluded: item.car_included ?? item.carIncluded ?? true,
            image: item.image_url || item.image
              ? (item.image_url || item.image).startsWith("http")
                ? (item.image_url || item.image)
                : LOCAL_IMAGES[item.image_url || item.image] || gold
              : gold,
          }));

          setTiers(formattedTiers);
        }
      } catch (err) {
        console.error("Error fetching meet_and_greet from API:", err.message);
      } finally {
        setLoadingTiers(false);
      }
    };

    fetchMeetAndGreet();
  }, []);

  // Fetch ALL Cars from Database for the Car Selection Modal
  useEffect(() => {
    const fetchCarsFromDB = async () => {
      try {
        setLoadingCars(true);
        const response = await fetch(`${API_BASE_URL}/api/transportation`);
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();

        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id || item._id,
            title: item.title || item.name || item.car_name || "Luxury Car",
            price: Number(item.price || item.cost || 0),
            passengers: item.passengers || item.capacity || 3,
            baggages: item.baggages || item.baggage || 3,
            image: getCarImageUrl(item),
          }));
          setCarsList(formatted);
          setSelectedCar(formatted[0]);
        } else {
          setCarsList(DEFAULT_CARS);
          setSelectedCar(DEFAULT_CARS[0]);
        }
      } catch (err) {
        console.error("Error fetching cars from DB:", err.message);
        setCarsList(DEFAULT_CARS);
        setSelectedCar(DEFAULT_CARS[0]);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCarsFromDB();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFlightForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFlightSubmit = (e) => {
    e.preventDefault();
    if (!flightForm.arrivalCity || !flightForm.arrivalDate || !flightForm.arrivalFlightNumber) {
      alert("Please fill in all required flight details.");
      return;
    }
    setIsSearchDone(true);
  };

  // Tier Carousel Controls
  const handlePrev = () => {
    if (tiers.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? tiers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (tiers.length === 0) return;
    setCurrentIndex((prev) => (prev === tiers.length - 1 ? 0 : prev + 1));
  };

  // Car Modal Carousel Controls
  const handlePrevCar = () => {
    if (!carsList.length) return;
    setCarIndex((prev) => (prev === 0 ? carsList.length - 1 : prev - 1));
  };

  const handleNextCar = () => {
    if (!carsList.length) return;
    setCarIndex((prev) => (prev === carsList.length - 1 ? 0 : prev + 1));
  };

  const handleCarCountChange = (operation) => {
    setCarCount((prev) => (operation === "inc" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleConfirmCarSelection = () => {
    const activeCar = carsList[carIndex] || DEFAULT_CARS[0];
    setSelectedCar(activeCar);
    setShowCarModal(false);
  };

  const handleBooking = async () => {
    if (tiers.length === 0) return;
    if (!flightForm.arrivalCity || !flightForm.arrivalDate || !flightForm.arrivalFlightNumber) {
      alert("يرجى تعبئة تفاصيل الرحلة قبل الحجز.");
      setIsSearchDone(false);
      return;
    }

    setLoading(true);

    try {
      const currentTier = tiers[currentIndex];
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          serviceType: "meet_and_greet",
          bookingType: currentTier.name,
          totalGuests: flightForm.totalGuests,
          counts: carCount,
          formData: {
            service_id: currentTier.id,
            tier_key: currentTier.key,
            tier_name: currentTier.name,
            price: currentTier.price,
            lounge_included: currentTier.loungeIncluded,
            car_included: currentTier.carIncluded,
            departure_airport: flightForm.departureAirport,
            arrival_city: flightForm.arrivalCity,
            arrival_date: flightForm.arrivalDate,
            airline: flightForm.arrivalAirline,
            flight_number: flightForm.arrivalFlightNumber,
            car_details: {
              car_id: selectedCar?.id,
              car_name: selectedCar?.title || "Standard Limo",
              car_count: carCount,
              pickup_location: pickupLocation || "Not Specified",
            },
          },
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit booking");
      }

      alert("تم إنشاء الحجز بنجاح!");
      navigate("/");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(`حدث خطأ أثناء الحجز: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingTiers) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>جاري تحميل بيانات الـ Meet & Greet...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (tiers.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>لا توجد باقات متوفرة حالياً.</h2>
        </div>
        <Footer />
      </>
    );
  }

  const currentTier = tiers[currentIndex];
  const prevTier = tiers[(currentIndex - 1 + tiers.length) % tiers.length];
  const nextTier = tiers[(currentIndex + 1) % tiers.length];

  // Car Slider Indexing
  const safeCarsList = carsList.length > 0 ? carsList : DEFAULT_CARS;
  const currentModalCar = safeCarsList[carIndex] || safeCarsList[0];
  const prevModalCar = safeCarsList[(carIndex - 1 + safeCarsList.length) % safeCarsList.length];
  const nextModalCar = safeCarsList[(carIndex + 1) % safeCarsList.length];

  return (
    <>
      <Navbar />
      <div className="details-container">
        {/* Top Banner Header */}
        <div className="details-header">
          <h2>Meet & Greet Details</h2>
          <p>Home _ Meet & Greet Details</p>
        </div>

        {/* 1. DIRECT ACCESS FORM (IF NOT SEARCHED YET) */}
        {!isSearchDone ? (
          <section
            className="direct-flight-form"
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
              Enter Flight Details to Continue
            </h2>

            <form onSubmit={handleFlightSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Departure Airport
                  </label>
                  <input
                    type="text"
                    value={flightForm.departureAirport}
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
                    Arrival City
                  </label>
                  <select
                    name="arrivalCity"
                    value={flightForm.arrivalCity}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="">Select Arrival City</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Beirut">Beirut</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Istanbul">Istanbul</option>
                    <option value="Amman">Amman</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={flightForm.arrivalDate}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Airline
                  </label>
                  <select
                    name="arrivalAirline"
                    value={flightForm.arrivalAirline}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="">Select Airline</option>
                    <option value="Ethiopian Airlines">Ethiopian Airlines</option>
                    <option value="Royal Jordanian">Royal Jordanian</option>
                    <option value="Emirates">Emirates</option>
                    <option value="MEA">MEA</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Flight Number
                  </label>
                  <input
                    type="text"
                    name="arrivalFlightNumber"
                    placeholder="e.g. ET429"
                    value={flightForm.arrivalFlightNumber}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Guests Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="totalGuests"
                    value={flightForm.totalGuests}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
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
                  View Meet & Greet Packages
                </button>
              </div>
            </form>
          </section>
        ) : (
          /* 2. MAIN PACKAGES CAROUSEL AND DETAILS */
          <>
            {/* Package Slider Section */}
            <div className="package-carousel">
              <button className="nav-arrow left" onClick={handlePrev}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <div className="card-grid">
                {/* Left Side Tier Card */}
                <div
                  className="tier-card side-card"
                  onClick={handlePrev}
                  style={{ cursor: "pointer" }}
                >
                  <img src={prevTier.image} alt={prevTier.name} className="tier-card-img" />
                  <div className="card-overlay"></div>
                  <div className="card-content">
                    <h3>{prevTier.name}</h3>
                    <button
                      className="card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                  <div className="price-tag">
                    Starting From <span>{prevTier.price.toFixed(2)}$</span>
                  </div>
                </div>

                {/* Main Center Active Tier Card */}
                <div className="tier-card gold-card active">
                  <img src={currentTier.image} alt={currentTier.name} className="tier-card-img" />
                  <div className="card-overlay main-overlay"></div>
                  <div className="card-content">
                    <h3>{currentTier.name}</h3>
                    <button
                      className="card-btn red"
                      onClick={handleBooking}
                      disabled={loading}
                    >
                      {loading ? "Booking..." : "Book Now"}
                    </button>
                  </div>
                  <div className="price-tag">
                    Starting From <span>{currentTier.price.toFixed(2)}$</span>
                  </div>
                </div>

                {/* Right Side Tier Card */}
                <div
                  className="tier-card side-card"
                  onClick={handleNext}
                  style={{ cursor: "pointer" }}
                >
                  <img src={nextTier.image} alt={nextTier.name} className="tier-card-img" />
                  <div className="card-overlay"></div>
                  <div className="card-content">
                    <h3>{nextTier.name}</h3>
                    <button
                      className="card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                  <div className="price-tag">
                    Starting From <span>{nextTier.price.toFixed(2)}$</span>
                  </div>
                </div>
              </div>

              <button className="nav-arrow right" onClick={handleNext}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            {/* Package Summary Header */}
            <div className="package-info-section">
              <h2>Meet & Greet - {currentTier.name}</h2>
              <span className="main-price">
                Starting From <strong>{currentTier.price.toFixed(2)}$</strong>
              </span>

              <div className="inclusions-row">
                <span className={currentTier.loungeIncluded ? "included" : "not-included"}>
                  <FontAwesomeIcon icon={faCouch} />{" "}
                  {currentTier.loungeIncluded ? "Lounge Included" : "Lounge Not Included"}
                </span>
                <span className={currentTier.carIncluded ? "included" : "not-included"}>
                  <FontAwesomeIcon icon={faCar} />{" "}
                  {currentTier.carIncluded ? "Car Included" : "Car Not Included"}
                </span>
              </div>

              {/* Flight & Guest Meta Details with Edit Option */}
              <div
                className="meta-details-bar"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <span>
                    <FontAwesomeIcon icon={faPlaneDeparture} /> {flightForm.arrivalCity}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} /> {flightForm.arrivalDate}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faPlaneDeparture} /> {flightForm.arrivalAirline}
                  </span>
                  <span># {flightForm.arrivalFlightNumber}</span>
                  <span>
                    <FontAwesomeIcon icon={faUser} /> {flightForm.totalGuests} Person
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchDone(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid #007bff",
                    color: "#007bff",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit Details
                </button>
              </div>
            </div>

            {/* Details & Action Section */}
            <div className="details-body">
              <div className="about-service">
                <h3>About Service</h3>
                <ul>
                  <li>Pick up: from hotel/residence in Amman in a limo car.</li>
                  <li>Meet and Greet: upon arrival at the airport by a Representative.</li>
                  <li>Porter service: to check-in counter.</li>
                  <li>Fast-track: through Immigration and Security.</li>
                  <li>Escort: to Duty Free.</li>
                  <li>Buggy car: transfer to the Boarding Gate (if available).</li>
                  <li>For any Child (From 2 up to 12 years) 10 JDs.</li>
                </ul>
                <p className="notice">
                  Note: Wheelchair service is not provided directly. Kindly request assistance through your airline.
                </p>
              </div>

              {/* Purchase Card */}
              <div className="checkout-card">
                <p className="label">Starting From</p>
                <div className="price">{currentTier.price.toFixed(2)}$</div>

                <button
                  className="car-select-trigger"
                  onClick={() => setShowCarModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 15px",
                    backgroundColor: "#f0f4f9",
                    border: "1px solid #0c3981",
                    borderRadius: "6px",
                    color: "#0c3981",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                    marginBottom: "15px",
                  }}
                >
                  <FontAwesomeIcon icon={faCar} />
                  {selectedCar
                    ? `Selected Car: ${selectedCar.title}`
                    : "Includes car. Click to select"}
                </button>

                <button
                  className="add-to-cart-btn"
                  onClick={handleBooking}
                  disabled={loading}
                >
                  <span>
                    <FontAwesomeIcon icon={faShoppingCart} /> {loading ? "Processing..." : "Add to Cart"}
                  </span>
                  <span className="subtotal">
                    SUBTOTAL {currentTier.price.toFixed(2)}$
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Database Car Selection Modal */}
        {showCarModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              className="modal-container"
              style={{
                background: "#ffffff",
                width: "90%",
                maxWidth: "850px",
                borderRadius: "14px",
                padding: "25px",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                type="button"
                onClick={() => setShowCarModal(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "transparent",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
                Select Vehicle from Database
              </h2>

              {loadingCars ? (
                <p style={{ textAlign: "center", padding: "30px 0" }}>
                  Loading cars from Database...
                </p>
              ) : (
                <>
                  {/* Modal Slider Carousel */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      margin: "20px 0",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handlePrevCar}
                      style={{
                        border: "none",
                        background: "#f0f0f0",
                        padding: "12px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    {/* Previous Car Side View */}
                    <div
                      onClick={handlePrevCar}
                      style={{
                        flex: 1,
                        opacity: 0.5,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={prevModalCar.image}
                        alt={prevModalCar.title}
                        style={{
                          width: "100%",
                          height: "110px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <h4 style={{ fontSize: "13px", marginTop: "5px" }}>
                        {prevModalCar.title}
                      </h4>
                    </div>

                    {/* Current Active Selected Car */}
                    <div
                      style={{
                        flex: 1.5,
                        border: "2px solid #0c3981",
                        borderRadius: "12px",
                        padding: "15px",
                        textAlign: "center",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background: "#0c3981",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        Included
                      </span>
                      <img
                        src={currentModalCar.image}
                        alt={currentModalCar.title}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <h3 style={{ margin: "10px 0 5px" }}>
                        {currentModalCar.title}
                      </h3>
                      <p style={{ margin: "0 0 10px", fontWeight: "bold" }}>
                        ${currentModalCar.price}
                      </p>
                    </div>

                    {/* Next Car Side View */}
                    <div
                      onClick={handleNextCar}
                      style={{
                        flex: 1,
                        opacity: 0.5,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={nextModalCar.image}
                        alt={nextModalCar.title}
                        style={{
                          width: "100%",
                          height: "110px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <h4 style={{ fontSize: "13px", marginTop: "5px" }}>
                        {nextModalCar.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextCar}
                      style={{
                        border: "none",
                        background: "#f0f0f0",
                        padding: "12px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>

                  {/* Car Specs & Selection Actions */}
                  <div className="car-details" style={{ marginTop: "15px" }}>
                    <div
                      className="car-specs"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        marginBottom: "15px",
                        color: "#666",
                      }}
                    >
                      <span>
                        <FontAwesomeIcon icon={faUser} />{" "}
                        {currentModalCar.passengers} Passengers
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faSuitcase} />{" "}
                        {currentModalCar.baggages} Baggage
                      </span>
                    </div>

                    <div
                      className="location-picker"
                      style={{ marginBottom: "15px" }}
                    >
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Pick-up Location
                      </label>
                      <select
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <option value="">Choose pick-up location</option>
                        <option value="hotel">Hotel / Residence</option>
                        <option value="city">City Center</option>
                        <option value="airport">Airport</option>
                      </select>
                    </div>

                    <div
                      className="car-count-row"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Number of cars</span>
                      <div
                        className="qty-controls"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleCarCountChange("dec")}
                          style={{
                            padding: "5px 12px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {carCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCarCountChange("inc")}
                          style={{
                            padding: "5px 12px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      className="modal-actions"
                      style={{ display: "flex", gap: "10px" }}
                    >
                      <button
                        type="button"
                        className="btn-add"
                        onClick={handleConfirmCarSelection}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "#0c3981",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Select {currentModalCar.title}
                      </button>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowCarModal(false)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "#e2e8f0",
                          color: "#333",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default MeetAndGreetDetails;