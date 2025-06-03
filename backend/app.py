import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Configure the generative AI client
genai.configure(api_key=GOOGLE_API_KEY)

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
    "Please analyze these symptoms and return a clear, professional diagnosis in HTML format only.\n"
    "Use numbered bullet points (<ol><li>...</li></ol>) and follow this exact structure with 6 bullet points per section:\n\n"
    "Please begin each bullet point with a bolded label (e.g., <b>Likely:</b>, <b>Cause:</b>, etc.) to clearly identify the main idea of the point.\n\n"

    "<hr style='width: 100%; border: none; border-top: 2px solid #f28b82; margin: 2rem 0 2rem 0;'>\n"


    "<div>\n"
    "  <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>📋 Diagnosis Summary</h3>\n"
    "<hr style='margin-top: 0.2rem; margin-bottom: 1rem; border: none; border-top: 1px solid #ccc;'>\n"
    "  <ol style='list-style-type: decimal; padding-left: 20px;'>\n"
    "    <li>[Likely condition or illness]</li>\n"
    "    <li>[Cause of the condition]</li>\n"
    "    <li>[How symptoms relate to diagnosis]</li>\n"
    "    <li>[Body system affected]</li>\n"
    "    <li>[Urgency or severity level]</li>\n"
    "    <li>[Any assumptions or uncertainties]</li>\n"
    "  </ol>\n"
    "</div>\n"

    "<div>\n"
    "  <h3 style='font-size:1.1rem; color:#003153; font-weight:bold; margin-bottom: 0.5rem;'>💊 <b>Recommended Medicines</b></h3>\n"
    "<hr style='margin-top: 0.2rem; margin-bottom: 1rem; border: none; border-top: 1px solid #ccc;'>\n"
    "  <ol style='list-style-type: decimal; padding-left: 20px;'>\n"
    "    <li>[Primary medicine name – dosage & frequency]</li>\n"
    "    <li>[Secondary medicine or supplement]</li>\n"
    "    <li>[Over-the-counter options]</li>\n"
    "    <li>[Usage instructions – with/without food]</li>\n"
    "    <li>[Duration of treatment]</li>\n"
    "    <li>[Doctor consultation before changes]</li>\n"
    "  </ol>\n"
    "</div>\n"

    "<div>\n"
    "  <h3 style='font-size:1.1rem; color:#003153; font-weight:bold; margin-bottom: 0.5rem;'>⚠️ <b>Possible Side Effects</b></h3>\n"
    "<hr style='margin-top: 0.2rem; margin-bottom: 1rem; border: none; border-top: 1px solid #ccc;'>\n"
    "  <ol style='list-style-type: decimal; padding-left: 20px;'>\n"
    "    <li>[Common side effect 1]</li>\n"
    "    <li>[Common side effect 2]</li>\n"
    "    <li>[Rare but serious side effect]</li>\n"
    "    <li>[How to manage mild side effects]</li>\n"
    "    <li>[Signs to stop medication immediately]</li>\n"
    "    <li>[When to seek medical help]</li>\n"
    "  </ol>\n"
    "</div>\n"

    "<div>\n"
    "  <h3 style='font-size:1.1rem; color:#003153; font-weight:bold; margin-bottom: 0.5rem;'>🚫 <b>Things to Avoid</b></h3>\n"
    "<hr style='margin-top: 0.2rem; margin-bottom: 1rem; border: none; border-top: 1px solid #ccc;'>\n"
    "  <ol style='list-style-type: decimal; padding-left: 20px;'>\n"
    "    <li>[Restricted foods/drinks]</li>\n"
    "    <li>[Activities that may worsen condition]</li>\n"
    "    <li>[Medication interactions]</li>\n"
    "    <li>[Environmental triggers]</li>\n"
    "    <li>[Bad habits (e.g., smoking, alcohol)]</li>\n"
    "    <li>[Delaying medical follow-up]</li>\n"
    "  </ol>\n"
    "</div>\n"

    "<div>\n"
    "  <h3 style='font-size:1.1rem; color:#003153; font-weight:bold; margin-bottom: 0.5rem;'>📅 <b>Follow-Up Suggestions</b></h3>\n"
    "<hr style='margin-top: 0.2rem; margin-bottom: 1rem; border: none; border-top: 1px solid #ccc;'>\n"
    "  <ol style='list-style-type: decimal; padding-left: 20px;'>\n"
    "    <li>[When to see a doctor again]</li>\n"
    "    <li>[Tests or labs recommended]</li>\n"
    "    <li>[Monitoring symptoms at home]</li>\n"
    "    <li>[Warning signs to watch for]</li>\n"
    "    <li>[Referral to specialist if needed]</li>\n"
    "    <li>[Health tracking tips or apps]</li>\n"
    "  </ol>\n"
    "</div>\n"
)

    try:
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")
        response = model.generate_content(prompt)

        response_text = getattr(response, 'text', None)
        if not response_text and hasattr(response, 'candidates'):
            response_text = response.candidates[0].content.parts[0].text

        if not response_text:
            return jsonify({'error': 'No response received from Gemini API'}), 500

        return jsonify({'response': response_text})
    except Exception as e:
        return jsonify({'error': f"Failed to get diagnosis: {str(e)}"}), 500

# ✅ Fixed section for Render:
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
