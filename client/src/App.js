import React, { useState } from 'react';
import './App.css'; // Import the updated CSS file

function App() {
  const [amount, setAmount] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [investmentDuration, setInvestmentDuration] = useState('5');
  const [investmentType, setInvestmentType] = useState('equity');
  const [income, setIncome] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use your Heroku app URL here
  const API_URL = 'https://portfolioai-da34d7ab7951.herokuapp.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/generate_portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          risk_tolerance: riskTolerance,
          investment_duration: investmentDuration,
          investment_type: investmentType,
          income,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Unknown error');
        }
      }

      const data = await response.json();
      // Convert the portfolio object to a string if needed
      setPortfolio(
        typeof data.portfolio === 'object'
          ? JSON.stringify(data.portfolio, null, 2)
          : data.portfolio
      );
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
        <div className="form-group">
          <label htmlFor="investmentDuration">Investment Duration (years):</label>
          <select
            id="investmentDuration"
            value={investmentDuration}
            onChange={(e) => setInvestmentDuration(e.target.value)}
            required
          >
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="investmentType">Investment Type:</label>
          <select
            id="investmentType"
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value)}
            required
          >
            <option value="equity">Equity</option>
            <option value="bonds">Bonds</option>
            <option value="real_estate">Real Estate</option>
            <option value="commodities">Commodities</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="income">Annual Income ($):</label>
          <input
            id="income"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your annual income"
            required
          />
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
