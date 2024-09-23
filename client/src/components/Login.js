import React, { useState } from 'react';
import './Login.css'; // Import a CSS file for styling
import { signIn } from 'next-auth/react'; // Import next-auth for Google login

function Login({ onLogin }) {
  const [error, setError] = useState('');

  // Handle Google login
  const handleGoogleLogin = async () => {
    setError('');

    try {
      // Redirects to the Google sign-in page via next-auth
      await signIn('google', { callbackUrl: 'https://www.portfoliogpt.xyz/dashboard' });
    } catch (error) {
      setError('Failed to login with Google');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <button onClick={handleGoogleLogin} className="gradient-button">
        Sign in with Google
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Login;
