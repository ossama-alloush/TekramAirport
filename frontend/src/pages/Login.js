
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pageCSS/Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Switch between Sign In and Sign Up
  const switchMode = () => {
    setIsRegister((prev) => !prev);

    setName('');
    setEmail('');
    setPassword('');

    setError(null);
    setSuccess(null);
  };

  // Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isRegister
        ? 'http://localhost:5000/api/register'
        : 'http://localhost:5000/api/login';

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || 'Authentication failed'
        );
      }

      if (isRegister) {
        // Registration successful
        setSuccess('Account created successfully! You can now sign in.');

        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');

      } else {
        // Login successful
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        navigate('/');
      }

    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background Decorations */}
      <div className="login-glow glow-one"></div>
      <div className="login-glow glow-two"></div>

      {/* Airplane Section */}
      <div className="airplane-section">

        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>

        <div className="plane-container">
          <div className="plane-shadow">✈</div>
          <div className="plane-3d">✈</div>
        </div>

        <div className="airplane-text">
          <span>YOUR JOURNEY STARTS HERE</span>

          <h1>Explore The World</h1>

          <p>
            Discover new destinations and enjoy
            unforgettable experiences.
          </p>
        </div>

        <div className="cloud cloud-one"></div>
        <div className="cloud cloud-two"></div>
        <div className="cloud cloud-three"></div>

      </div>

      {/* Authentication Section */}
      <div className="login-content">

        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <span>✈</span>
            <h2>TRAVEL<span>ZONE</span></h2>
          </div>

          {/* Heading */}
          <div className="login-heading">

            <span className="login-subtitle">
              {isRegister
                ? 'CREATE YOUR ACCOUNT'
                : 'WELCOME BACK'}
            </span>

            <h1>
              {isRegister ? 'Create Account' : 'Sign In'}
            </h1>

            <p>
              {isRegister
                ? 'Join us and start exploring the world.'
                : 'Enter your details to access your account.'}
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="login-success">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Full Name - Only in Sign Up */}
            {isRegister && (
              <div className="login-input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="login-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            {/* Password */}
            <div className="login-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isRegister ? 8 : undefined}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isRegister
                  ? 'Create Account'
                  : 'Sign In'}

              {!loading && <span>→</span>}
            </button>

          </form>

          {/* Switch Mode - No Navigation */}
          <div className="login-footer">

            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              className="auth-switch"
              onClick={switchMode}
              disabled={loading}
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>

          </div>

        </div>

        {/* Copyright */}
        <div className="login-bottom-text">
          © 2026 TravelZone. All rights reserved.
        </div>

      </div>

    </div>
  );
};

export default Login;
