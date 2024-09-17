from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import openai
import logging
import os

app = Flask(__name__)
CORS(app)  # Enable CORS

# Rate Limiting
limiter = Limiter(
    get_remote_address,  # Limit by IP address
    app=app,
    default_limits=["5 per minute"]  # Example: 5 requests per minute
)

# Retrieve OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

# Basic Route Test
@app.route('/')
def index():
    return 'App is running!'

def generate_prompt(investment_amount, risk_tolerance):
    return (f"Generate a diversified portfolio for an investment of {investment_amount} EUR with a {risk_tolerance} risk tolerance. "
            "Include asset classes such as stocks, bonds, and real estate. For each asset class, provide the asset class name, percentage allocation, amount to invest, ticker.")

# Apply rate limiting to the portfolio generation endpoint
@app.route('/generate_portfolio', methods=['POST'])
@limiter.limit("3 per minute")  # Example: Limit to 3 requests per minute for this route
def generate_portfolio():
    try:
        user_data = request.json
        logging.info("Received user data: %s", user_data)
        
        investment_amount = user_data['amount']
        risk_tolerance = user_data['risk_tolerance']
        
        prompt = generate_prompt(investment_amount, risk_tolerance)
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial advisor."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Process the response and ensure it's a plain text
        portfolio = response.choices[0].message['content'].strip()
        logging.info("Generated portfolio: %s", portfolio)
        
        # Ensure response is plain text
        return jsonify({'portfolio': portfolio})
    except Exception as e:
        logging.error("Error: %s", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
