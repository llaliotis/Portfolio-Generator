from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient
import openai
import logging
import os
from datetime import datetime
import certifi

app = Flask(__name__)
CORS(app)  # Enable CORS

# Rate Limiting
limiter = Limiter(
    get_remote_address,  # Limit by IP address
    app=app,
    default_limits=["5 per minute"]  # Example: 5 requests per minute
)

# MongoDB setup
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
db = client['test']  # Connect to your database
portfolio_collection = db['portfolios']  # Connect to your collection

# Retrieve OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

# Basic Route Test
@app.route('/')
def index():
    return 'App is running!'

def generate_prompt(investment_amount, risk_tolerance, investment_duration, investment_goal, preferred_asset_classes):
    asset_classes_text = ', '.join(preferred_asset_classes) if preferred_asset_classes else "stocks, bonds, real estate"
    return (f"Generate a diversified portfolio for an investment of {investment_amount} USD with a {risk_tolerance} risk tolerance, "
            f"over a {investment_duration} duration and with a goal of {investment_goal}. "
            f"Include asset classes such as {asset_classes_text}. For each asset class, provide the asset class name, percentage allocation, amount to invest, and ticker symbols if applicable.")


# Apply rate limiting to the portfolio generation endpoint
@app.route('/generate_portfolio', methods=['POST'])
@limiter.limit("3 per minute")
def generate_portfolio():
    try:
        user_data = request.json
        logging.info("Received user data: %s", user_data)
        
        # Extract fields from request
        investment_amount = user_data['amount']
        risk_tolerance = user_data['risk_tolerance']
        investment_duration = user_data.get('investment_duration', 'long-term')
        investment_goal = user_data.get('investment_goal', 'growth')
        preferred_asset_classes = user_data.get('preferred_asset_classes', [])  # Defaults to an empty list if not provided
        
        # Generate OpenAI prompt
        prompt = generate_prompt(investment_amount, risk_tolerance, investment_duration, investment_goal, preferred_asset_classes)
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial advisor."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Process the response
        portfolio = response.choices[0].message['content'].strip()
        logging.info("Generated portfolio: %s", portfolio)
        
        # Prepare the data to be saved in MongoDB
        portfolio_data = {
            'amount': investment_amount,
            'risk_tolerance': risk_tolerance,
            'investment_duration': investment_duration,
            'investment_goal': investment_goal,
            'preferred_asset_classes': preferred_asset_classes,
            'portfolio': portfolio,
            'created_at': datetime.now()
        }
        
        # Insert the portfolio into MongoDB
        portfolio_collection.insert_one(portfolio_data)
        
        # Respond with the generated portfolio
        return jsonify({'portfolio': portfolio})
    except Exception as e:
        logging.error("Error: %s", e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
