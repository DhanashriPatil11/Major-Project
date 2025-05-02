from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import joblib
import os
#import openai
import time
#from dotenv import load_dotenv

# Load environment variables
#load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

MODEL_FILE = 'gb_classifier.joblib'
FEATURE_NAMES_FILE = 'feature_names.joblib'

# Set your OpenAI API key
#openai.api_key = os.getenv(
#)  # Store API key in .env 

# Function to train the model
def train_model():
    df = pd.read_csv('a(2).csv')

    # Create new features
    df['risk_score'] = (df['risk_of_escape'].astype(int) +
                        df['risk_of_influence'].astype(int) +
                        df['served_half_term'].astype(int))

    df['penalty_severity'] = df['penalty'].map({"Fine": 1, "Imprisonment": 2, "Both": 3}) * df['imprisonment_duration_served']

    # Drop unnecessary columns
    X = df.drop(["bail_eligibility", "case_id", "penalty", "imprisonment_duration_served",
                 "risk_of_escape", "risk_of_influence", "served_half_term"], axis=1)

    y = df["bail_eligibility"]
    X = pd.get_dummies(X, drop_first=True)

    # Save feature names
    joblib.dump(X.columns.tolist(), FEATURE_NAMES_FILE)

    # Split data into train (70%) and test (30%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Train the model
    model = GradientBoostingClassifier(random_state=42, n_estimators=100, learning_rate=0.1, max_depth=3)
    model.fit(X_train, y_train)

    # Evaluate model accuracy
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    # Print accuracy
    print("=" * 50)
    print("📊 Model Training Completed!")
    print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")
    print("=" * 50)

    # Save the trained model
    joblib.dump(model, MODEL_FILE)
    return model, X.columns.tolist()

# Load or train the model
def load_or_train_model():
    if os.path.exists(MODEL_FILE) and os.path.exists(FEATURE_NAMES_FILE):
        try:
            model = joblib.load(MODEL_FILE)
            feature_names = joblib.load(FEATURE_NAMES_FILE)
            print("🔄 Loaded existing model successfully.")
            return model, feature_names
        except:
            print("⚠️ Error loading model. Retraining a new one.")
    
    return train_model()


# Preprocess function to format input data
def preprocess(data):
    # Convert incoming data into a pandas DataFrame
    df = pd.DataFrame([data])

    # Handle categorical columns as in the original training data
    df['risk_score'] = (df['risk_of_escape'].astype(int) +
                        df['risk_of_influence'].astype(int) +
                        df['served_half_term'].astype(int))

    df['penalty_severity'] = df['penalty'].map({"Fine": 1, "Imprisonment": 2, "Both": 3}) * df['imprisonment_duration_served']

    # Drop unnecessary columns (same as during training)
    df = df.drop(["penalty", "imprisonment_duration_served", "risk_of_escape", "risk_of_influence", "served_half_term"], axis=1)

    # One-hot encode categorical columns like statute and offense_category (same as during training)
    df = pd.get_dummies(df, drop_first=True)

    # Ensure the order of columns matches the training data (based on the saved feature names)
    feature_names = joblib.load(FEATURE_NAMES_FILE)
    df = df.reindex(columns=feature_names, fill_value=0)

    return df


# Load the model
model, feature_names = load_or_train_model()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Get input JSON
    input_data = preprocess(data)  # Convert to model format
    
    # Predict probability
    probabilities = model.predict_proba(input_data)[:, 1]  # Probability of bail eligibility being True
    
    threshold = 0.4  # Reduce threshold to allow some 'True' results
    bail_eligibility = probabilities >= threshold  

    # Debugging prints
    print(f"\n🔍 Input Data: {data}")
    print(f"🔄 Processed Data: {input_data}")
    print(f"📊 Predicted Probability: {probabilities}")
    print(f"✅ Bail Eligibility: {bail_eligibility}")

    return jsonify({"bail_eligibility": bool(bail_eligibility)})

# API endpoint to check model accuracy anytime
@app.route('/test_accuracy_gb', methods=['GET'])
def test_accuracy_gb():
    try:
        # Reload dataset
        df = pd.read_csv('a(2).csv')

        # Feature Engineering (same as during training)
        df['risk_score'] = (df['risk_of_escape'].astype(int) +
                            df['risk_of_influence'].astype(int) +
                            df['served_half_term'].astype(int))

        df['penalty_severity'] = df['penalty'].map({"Fine": 1, "Imprisonment": 2, "Both": 3}) * df['imprisonment_duration_served']

        X = df.drop(["bail_eligibility", "case_id", "penalty", "imprisonment_duration_served", 
                     "risk_of_escape", "risk_of_influence", "served_half_term"], axis=1)

        y = df["bail_eligibility"]
        X = pd.get_dummies(X, drop_first=True)

        # Load feature names and align test dataset
        feature_names = joblib.load(FEATURE_NAMES_FILE)
        X = X.reindex(columns=feature_names, fill_value=0)

        # Split dataset
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

        # Predict using the loaded model
        y_pred = model.predict(X_test)

        # Ensure y_pred and y_test have the same length
        assert len(y_pred) == len(y_test), f"Inconsistent lengths: {len(y_pred)} vs {len(y_test)}"

        accuracy = accuracy_score(y_test, y_pred) * 100  # Convert to percentage

        print(f"\n📊 Model Accuracy: {accuracy:.2f}%\n")  # Print in terminal

        return jsonify({"accuracy": accuracy})  # Return JSON response

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# API to generate bail application using OpenAI GPT
#@app.route('/api/generate_bail_application', methods=['POST'])
#def generate_bail_application():
    #try:
        #data = request.json
    #     lawyer_name = data.get('lawyer_name')
    #     input_text = data.get('input_text')
    #     n_words = data.get('n_words', 200)
    #     theme = data.get('theme')

    #     if not lawyer_name or not input_text:
    #         return jsonify({"success": False, "error": "Missing required fields"}), 400

    #     if not isinstance(n_words, int) or n_words <= 0:
    #         return jsonify({"success": False, "error": "Invalid n_words value"}), 400

    #     # OpenAI prompt for bail application
    #     prompt = f"""
    #     [Your Name] = {input_text}
    #     [Phone Number] 7/9/24
    #     Honorable Judge Harshit Kolkata High Court Kolkata -70002

    #     "Write a bail application.
    #     Name of the lawyer will be {lawyer_name}.
    #     Name of the client will be {input_text}.
    #     Crime will be {theme}.
    #     The number of words in the bail application should be {n_words} words.
    #     City: Kolkata.
    #     Judge name: Raghav Jain."
    #     """

    #     # Call OpenAI API
    #     client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    #     response = client.chat.completions.create(
    #         model="gpt-4",
    #         messages=[{"role": "system", "content": "You are a helpful assistant."},
    #                   {"role": "user", "content": prompt}]
    #     )

    #     return jsonify({"success": True, "bail_application": response.choices[0].message.content})

    # except Exception as e:
    #     return jsonify({"success": False, "error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
