import React, { useState } from 'react';
import './App.css'; // Import a CSS file for styling

function App() {
  const [amount, setAmount] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [portfolio, setPortfolio] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/generate_portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, risk_tolerance: riskTolerance })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      // Convert the portfolio object to a string if needed
      setPortfolio(typeof data.portfolio === 'object' ? JSON.stringify(data.portfolio, null, 2) : data.portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Portfolio Generator</h1>
      <form className="portfolio-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Investment Amount:</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="riskTolerance">Risk Tolerance:</label>
          <select
            id="riskTolerance"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
            required
          >
            <option value="low">Low (Conservative)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (Aggressive)</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Portfolio'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {portfolio && (
        <div className="portfolio-container">
          <h2>Generated Portfolio:</h2>
          <pre className="portfolio-text">{portfolio}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
