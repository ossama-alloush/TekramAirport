import React, { useState } from "react";
import "../pages/pageCSS/Navbar.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/tikram-logo.avif";

function Navbar() {
  // State 1: Language
  const [lang, setLang] = useState("en");

  // State 2: Theme (Dark/Light)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State 3: Currency
  const [currency, setCurrency] = useState("USD");

  // Toggle Language
  const toggleLanguage = (e) => {
    setLang(e.target.value);
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  // Toggle Currency
  const toggleCurrency = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <header className={`navbar-header ${isDarkMode ? "dark-theme" : ""}`}>
      {/* 1. Top Bar */}
      <div className="top-bar">
        {/* Left: Phone Info */}
        <div className="call-info">
          <div className="phone-icon">
            <FontAwesomeIcon icon={faPhone} />
          </div>
          <div className="phone-text">
            <span className="label">
              {lang === "en" ? "Call Anytime" : "اتصل بنا في أي وقت"}
            </span>
            <span className="numbers">+961 81 330304 / +961 81 343686</span>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Tikram Logo" className="logo-img" />
          </Link>
        </div>

        {/* Right: Actions & Preferences */}
        <div className="top-actions">
          {/* Language Selector */}
          <div className="dropdown-btn">
            <span className="flag">{lang === "en" ? "🇬🇧" : "🇱🇧"}</span>
            <select value={lang} onChange={toggleLanguage} className="custom-select">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="dropdown-btn">
            <span className="currency-icon">⇄</span>
            <select value={currency} onChange={toggleCurrency} className="custom-select">
              <option value="USD">$ (USD)</option>
              <option value="LBP">ل.ل (LBP)</option>
            </select>
          </div>

          {/* Cart Button */}
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
  <FontAwesomeIcon icon={faShoppingCart} />
</Link>

          {/* Sign Up Button */}
          <Link to="/login" className="sign-up-btn">
  {lang === "en" ? "Sign Up" : "إنشاء حساب"}
</Link>

          {/* Dark / Light Mode Button */}
          <button
            className="icon-btn theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
          </button>
        </div>
      </div>

      <hr className="nav-divider" />

      {/* 2. Bottom Navigation Bar */}
      <div className="bottom-bar">
        <nav className="nav-links">
          <Link to="/">{lang === "en" ? "Home" : "الرئيسية"}</Link>
          <Link to="/meet-and-greet">{lang === "en" ? "Meet & Greet" : "خدمة الاستقبال"}</Link>
          <Link to="/lounges">{lang === "en" ? "Lounges" : "الصالات"}</Link>
          <Link to="/transport">{lang === "en" ? "Transportation" : "النقل"}</Link>
          <Link to="/services">{lang === "en" ? "Services" : "الخدمات"}</Link>
          <Link to="/about">{lang === "en" ? "About Us" : "من نحن"}</Link>
          <Link to="/contact">{lang === "en" ? "Contact Us" : "تواصل معنا"}</Link>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;