
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './pageCSS/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to login');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
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

      {/* 3D Airplane Section */}
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

      {/* Login Form */}
      <div className="login-content">

        <div className="login-card">

          <div className="login-logo">
            <span>✈</span>
            <h2>TRAVEL<span>ZONE</span></h2>
          </div>

          <div className="login-heading">
            <span className="login-subtitle">WELCOME BACK</span>
            <h1>Sign In</h1>
            <p>Enter your details to access your account.</p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

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

            <div className="login-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="login-footer">
            Don't have an account?
            <Link to="/register"> Sign Up</Link>
          </div>

        </div>

        <div className="login-bottom-text">
          © 2026 TravelZone. All rights reserved.
        </div>

      </div>

    </div>
  );
};

export default Login;
