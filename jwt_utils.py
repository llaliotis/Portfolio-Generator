import jwt
import datetime
import os

# Generate a random secret key (only do this once and store securely)
# secret_key = os.urandom(24).hex()  # Uncomment this line to generate a new key

# Replace with your actual secret key
secret_key = os.getenv('SECRET_KEY')  # Store this securely


def create_jwt(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Token expiration time
    }
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        print('Token has expired')
        return None
    except jwt.InvalidTokenError:
        print('Invalid token')
        return None
