import random
import json
import requests
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import hashlib

# API Key
WEATHER_API_KEY = "fb8446311d374d8ca19131622250705"

# Initialize Flask App
app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app)

# --- Database Setup ---
def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# --- Auth Routes ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = hash_password(data.get('password'))

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', (username, email, password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"message": "Email already exists."}), 400
    finally:
        conn.close()

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = hash_password(data.get('password'))

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        session['username'] = user[1]
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/get-username', methods=['GET'])
def get_username():
    username = session.get('username')
    return jsonify({'username': username}) if username else jsonify({'message': 'Not logged in'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200

# --- Weather & Food Suggestion ---
def get_current_temperature(lat, lon):
    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={lat},{lon}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        city = data['location']['name']
        temp = data['current']['temp_c']
        print(f"✅ Weather API working: City = {city}, Temperature = {temp}°C")
        return city, temp
    except Exception as e:
        print(f"❌ Error fetching weather: {e}")
        return None, None

def get_food_suggestion(temp):
    categories = {
        'hot': ["Iced Tea", "Cold Coffee", "Fruit Salad"],
        'warm': ["Pani Puri", "Lemonade", "Chana Chaat"],
        'mild': ["Aloo Paratha", "Samosas", "Chole Bhature"],
        'cool': ["Masala Chai", "Paneer Tikka", "Dal Makhani"],
        'cold': ["Hot Chocolate", "Gajar Halwa", "Methi Thepla"]
    }

    if temp >= 35:
        return random.choice(categories['hot'])
    elif 25 <= temp < 35:
        return random.choice(categories['warm'])
    elif 20 <= temp < 25:
        return random.choice(categories['mild'])
    elif 15 <= temp < 20:
        return random.choice(categories['cool'])
    else:
        return random.choice(categories['cold'])

@app.route('/suggest-food', methods=['POST'])
def suggest_food():
    data = request.get_json()
    location = data.get('location')  # Manual input
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    # If latitude & longitude are sent, reverse geocode to get city name
    if not location and latitude and longitude:
        try:
            response = requests.get(
                f"https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json",
                headers={'User-Agent': 'ZomatoClone/1.0'}
            )
            response.raise_for_status()
            data = response.json()
            location = data.get("address", {}).get("city") or \
                       data.get("address", {}).get("town") or \
                       data.get("address", {}).get("village") or \
                       data.get("address", {}).get("state")

            if not location:
                return jsonify({"message": "Could not determine city from coordinates"}), 400
        except Exception as e:
            return jsonify({"message": f"Error resolving city: {e}"}), 500

    if not location:
        return jsonify({"message": "No location provided"}), 400

    # Proceed with weather API
    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={location}"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()

        temp_c = weather_data['current']['temp_c']
        condition = weather_data['current']['condition']['text']

        suggestion_food = get_food_suggestion(temp_c)

        suggestion = (
            f"Weather in {location}: {condition}, {temp_c}°C. "
            f"Top food suggestion: {suggestion_food}"
        )
        return jsonify({"suggestion": suggestion}), 200

    except Exception as e:
        print(f"Error fetching weather for {location}: {e}")
        return jsonify({"message": f"Could not get weather for {location}"}), 500

# --- Feedback API ---
@app.route("/submit-feedback", methods=["POST"])
def submit_feedback():
    data = request.get_json()
    suggestion = data.get("suggestion")
    feedback = data.get("feedback")

    if not suggestion or feedback not in ['yes', 'no']:
        return jsonify({"message": "Invalid input"}), 400

    feedback_entry = {"suggestion": suggestion, "feedback": feedback}
    try:
        with open('feedback_data.json', 'a', encoding='utf-8') as file:
            file.write(json.dumps(feedback_entry) + "\n")
        return jsonify({"message": "Feedback recorded successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error storing feedback: {e}"}), 500

# --- Start Server ---
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
