import React, { useState } from 'react';
import './App.css'; // Import a CSS file for styling

function App() {
  const [amount, setAmount] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [investmentDuration, setInvestmentDuration] = useState('long-term');
  const [investmentGoal, setInvestmentGoal] = useState('growth');
  const [preferredAssetClasses, setPreferredAssetClasses] = useState([]);
  const [portfolio, setPortfolio] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://portfolioai-da34d7ab7951.herokuapp.com';
  //const API_URL = 'http://localhost:3000';

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
          investment_goal: investmentGoal,
          preferred_asset_classes: preferredAssetClasses,
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
      setPortfolio(typeof data.portfolio === 'object' ? JSON.stringify(data.portfolio, null, 2) : data.portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferredAssetClassesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setPreferredAssetClasses(selectedOptions);
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
          <label htmlFor="investmentDuration">Investment Duration:</label>
          <select
            id="investmentDuration"
            value={investmentDuration}
            onChange={(e) => setInvestmentDuration(e.target.value)}
            required
          >
            <option value="less than a year">Less than 1 year</option>
            <option value="1-3 year duration">1-3 years</option>
            <option value="3-10 year duration">3-10 years</option>
            <option value="10+ year duration">10+ years</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="investmentGoal">Investment Goal:</label>
          <select
            id="investmentGoal"
            value={investmentGoal}
            onChange={(e) => setInvestmentGoal(e.target.value)}
            required
          >
            <option value="retirement">Retirement</option>
            <option value="growth">Wealth growth over time</option>
            <option value="short term gains">Short-term gains</option>
            <option value="income">Income</option>
            <option value="capital-preservation">Capital Preservation</option>
            <option value="big purchase">A big purchase (e.g., house, car)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="preferredAssetClasses">Preferred Asset Classes:</label>
          <select
            id="preferredAssetClasses"
            multiple
            value={preferredAssetClasses}
            onChange={handlePreferredAssetClassesChange}
          >
            <option value="etf">ETFs</option>
            <option value="stocks">Stocks</option>
            <option value="bonds">Bonds</option>
            <option value="real-estate">Real Estate</option>
            <option value="commodities">Commodities</option>
            <option value="cryptocurrency">Cryptocurrency</option>
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
