import React, { useState } from 'react';
import './Login.css'; // Import a CSS file for styling
import { setCookie } from 'nookies'; // Import nookies for cookie handling

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'https://www.portfoliogpt.xyz/api/auth/signin'; // Adjust API endpoint if necessary

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();

      // Assuming the API returns the user ID or token
      setCookie(null, 'authToken', data.user.id || data.token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        domain: '.portfoliogpt.xyz', // Adjust domain if needed
      });

      onLogin(true); // Notify parent component of successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="gradient-button">Login</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
