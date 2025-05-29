import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

# Load environment variables from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Initialize Gemini client with API key
client = genai.Client(api_key=GOOGLE_API_KEY)

# Set up Flask app to serve frontend files
app = Flask(__name__, static_folder='../frontend')
CORS(app)

# Serve the main page
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files (HTML, CSS, JS, images)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# API endpoint for diagnosis
@app.route('/get_diagnosis', methods=['POST'])
def get_diagnosis():
    symptoms = request.form.get('symptoms', '')
    if not symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400

    prompt = (
        f"I am experiencing the following symptoms: {symptoms}.\n\n"
        "Please analyze and return the diagnosis result with these sections clearly labeled:\n"
        "<div class='info-card'>\n"
        "  <h3>Diagnosis Summary</h3>\n"
        "  <p>...</p>\n"
        "</div>\n"
        "<div class='info-card'>\n"
        "  <h3>Recommended Medicines</h3>\n"
        "  <p>...</p>\n"
        "</div>\n"
        "<div class='info-card'>\n"
        "  <h3>Possible Side Effects</h3>\n"
        "  <p>...</p>\n"
        "</div>\n"
        "<div class='info-card'>\n"
        "  <h3>Things to Avoid</h3>\n"
        "  <p>...</p>\n"
        "</div>\n"
        "Respond with only HTML."
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        response_text = getattr(response, 'text', None)
        if not response_text and hasattr(response, 'candidates'):
            response_text = response.candidates[0].content.parts[0].text

        if not response_text:
            return jsonify({'error': 'No response received from Gemini API'}), 500

        return jsonify({'response': response_text})
    except Exception as e:
        return jsonify({'error': f"Failed to get diagnosis: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)