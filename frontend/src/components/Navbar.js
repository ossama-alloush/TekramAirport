
import React, { useState } from "react";
import "../pages/pageCSS/Navbar.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPhone,
  faShoppingCart,
  faBars,
  faTimes,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/tikram-logo.avif";

function Navbar() {
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      document.body.classList.toggle("dark-mode", !prev);
      return !prev;
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: "/", en: "Home", ar: "الرئيسية" },
    { path: "/meet-and-greet", en: "Meet & Greet", ar: "خدمة الاستقبال" },
    { path: "/lounges", en: "Lounges", ar: "الصالات" },
    { path: "/transport", en: "Transportation", ar: "النقل" },
    { path: "/services", en: "Services", ar: "الخدمات" },
    { path: "/about", en: "About Us", ar: "من نحن" },
    { path: "/contact", en: "Contact Us", ar: "تواصل معنا" },
  ];

  return (
    <header className={`navbar-header ${isDarkMode ? "dark-theme" : ""}`}>

      {/* TOP BAR */}
      <div className="top-bar">

        {/* Phone */}
        <div className="call-info desktop-only">
          <div className="phone-icon">
            <FontAwesomeIcon icon={faPhone} />
          </div>

          <div className="phone-text">
            <span className="label">
              {lang === "en" ? "Call Anytime" : "اتصل بنا في أي وقت"}
            </span>

            <span className="numbers">
              +961 81 330304 / +961 81 343686
            </span>
          </div>
        </div>

        {/* Logo */}
        <div className="logo-container">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Tikram Logo" className="logo-img" />
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="top-actions desktop-only">

          <div className="dropdown-btn">
            <span>{lang === "en" ? "🇬🇧" : "🇱🇧"}</span>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="custom-select"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div className="dropdown-btn">
            <span>⇄</span>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="custom-select"
              aria-label="Select currency"
            >
              <option value="USD">$ (USD)</option>
              <option value="LBP">ل.ل (LBP)</option>
            </select>
          </div>

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>

          <Link to="/login" className="sign-up-btn">
            {lang === "en" ? "Sign Up" : "إنشاء حساب"}
          </Link>

          <button
            className="icon-btn theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      <hr className="nav-divider" />

      {/* BOTTOM BAR / MOBILE MENU */}
      <div className={`bottom-bar ${isMenuOpen ? "menu-open" : ""}`}>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
            >
              {lang === "en" ? item.en : item.ar}
            </Link>
          ))}
        </nav>

        {/* Mobile Extra Options */}
        <div className="mobile-extra">

          <div className="mobile-phone">
            <FontAwesomeIcon icon={faPhone} />
            <span>+961 81 330304 / +961 81 343686</span>
          </div>

          <div className="mobile-preferences">

            <div className="dropdown-btn">
              <span>{lang === "en" ? "🇬🇧" : "🇱🇧"}</span>

              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="custom-select"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div className="dropdown-btn">
              <span>⇄</span>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="custom-select"
                aria-label="Select currency"
              >
                <option value="USD">$ (USD)</option>
                <option value="LBP">ل.ل (LBP)</option>
              </select>
            </div>

          </div>

          <div className="mobile-actions">

            <Link to="/cart" className="mobile-cart" onClick={closeMenu}>
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>{lang === "en" ? "My Cart" : "السلة"}</span>
            </Link>

            <Link to="/login" className="sign-up-btn" onClick={closeMenu}>
              {lang === "en" ? "Sign Up" : "إنشاء حساب"}
            </Link>

            <button
              className="icon-btn theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>

          </div>
        </div>
      </div>

    </header>
  );
}

export default Navbar;
