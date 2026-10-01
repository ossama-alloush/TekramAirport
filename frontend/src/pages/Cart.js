import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './pageCSS/Cart.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items from database");
      }

      const data = await response.json();

      const formattedItems = (Array.isArray(data) ? data : data.bookings || []).map((item) => {
        const details = typeof item.details === "string" 
          ? JSON.parse(item.details) 
          : item.details || {};

        const formData = typeof item.form_data === "string" 
          ? JSON.parse(item.form_data) 
          : item.form_data || item.formData || details.formData || {};

        const rawPrice = 
          item.price ?? 
          item.totalPrice ?? 
          item.amount ?? 
          item.total_price ?? 
          details.price ?? 
          details.totalPrice ?? 
          details.vehiclePrice ?? 
          details.amount ?? 
          details.pricePerPerson ?? 
          details.tier_price ?? 
          formData.price ?? 
          formData.totalPrice ?? 
          formData.vehiclePrice ?? 
          formData.amount ?? 
          formData.pricePerPerson ?? 
          0;

        const extractedPrice = Number(rawPrice) || 0;

        const passengers = 
          item.total_guests || 
          item.totalGuests || 
          details.totalGuests || 
          details.total_guests ||
          details.passengers ||
          formData.totalGuests || 
          1;

        let serviceTitle = "Airport Service";
        const serviceType = item.service_type || item.serviceType || "";
        if (serviceType === "meet_and_greet") serviceTitle = "Airport Meet & Greet";
        else if (serviceType === "lounge") serviceTitle = "Lounge Service";
        else if (serviceType === "transportation") serviceTitle = "Airport Transportation";

        const serviceTypeOption = 
          item.booking_type || 
          item.bookingType || 
          details.tier_name || 
          details.lounge_name || 
          details.vehicle_name || 
          formData.tier_name || 
          formData.lounge_name || 
          formData.vehicle_name || 
          formData.car_title || 
          "Standard Service";

        return {
          id: item.id || item._id,
          title: serviceTitle,
          type: serviceTypeOption,
          passengers: passengers,
          price: extractedPrice,
        };
      });

      setCartItems(formattedItems);
    } catch (err) {
      console.error("Error loading cart items:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item from cart");
      }

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Could not remove item. Please try again.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const total = subtotal;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color: "#0c3981", marginBottom: "15px" }} />
          <h2>Loading your cart services...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!loading && cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <div className="illustration-wrapper">
            <svg className="empty-cart-svg" viewBox="0 0 200 200" fill="none">
              <path d="M85 35 C 80 25, 90 15, 85 5" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M100 40 C 95 30, 105 20, 100 10" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M115 35 C 110 25, 120 15, 115 5" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M40 70 L75 70 L85 80 L150 80 C155 80 160 85 160 90 L155 145 C155 152 148 157 140 157 L50 157 C42 157 35 152 35 145 L40 70 Z" fill="#E5E7EB" stroke="#4B5563" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M35 90 L160 90" stroke="#4B5563" strokeWidth="3" />
              <path d="M72 108 L82 118 M82 108 L72 118" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M102 108 L112 118 M112 108 L102 118" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M78 138 Q92 128 106 138" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="145" cy="60" r="20" fill="white" stroke="#4B5563" strokeWidth="3.5" />
              <text x="145" y="67" fill="#D97706" fontSize="26" fontWeight="bold" textAnchor="middle">?</text>
            </svg>
          </div>
          <h2 className="cart-title">Your cart is empty</h2>
          <p className="cart-description">
            It looks like you haven't added any airport services to your cart yet. Browse our available services and make your journey smoother.
          </p>
          <Link to="/meet-and-greet" className="explore-btn">
            <span>Explore Airport Services</span>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1 className="page-heading">Your Cart Services</h1>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className="cart-content">
          <div className="items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-card">
                <div className="card-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-type">{item.type}</p>
                  <span className="item-details">Passengers: {item.passengers}</span>
                </div>
                <div className="card-actions">
                  <span className="item-price">${(item.price || 0).toFixed(2)}</span>
                  <button
                    className="delete-btn"
                    onClick={() => removeItem(item.id)}
                    title="Remove Item"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
            <hr className="divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn">
              <span>Proceed to Checkout</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;