from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)

MODEL_DIR = "catboost_model"
MODEL_PATH = os.path.join(MODEL_DIR, "catboost_model.joblib")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.joblib")

# Load model and feature names
model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURES_PATH)

def preprocess(data):
    df = pd.DataFrame([data])
    df['risk_score'] = df['risk_of_escape'] + df['risk_of_influence'] + df['served_half_term']
    df['penalty_severity'] = df['penalty'].map({"Fine": 1, "Imprisonment": 2, "Both": 3}) * df['imprisonment_duration_served']
    df = df.drop(["penalty", "imprisonment_duration_served", "risk_of_escape", 
                  "risk_of_influence", "served_half_term"], axis=1)
    df = pd.get_dummies(df, drop_first=True)
    df = df.reindex(columns=feature_names, fill_value=0)
    return df

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        input_df = preprocess(data)
        prob = model.predict_proba(input_df)[:, 1][0]
        result = prob >= 0.4
        return jsonify({"bail_eligibility": bool(result), "probability": float(prob)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test_accuracy", methods=["GET"])
def test_accuracy():
    try:
        df = pd.read_csv("a(2).csv")
        df['risk_score'] = df['risk_of_escape'] + df['risk_of_influence'] + df['served_half_term']
        df['penalty_severity'] = df['penalty'].map({"Fine": 1, "Imprisonment": 2, "Both": 3}) * df['imprisonment_duration_served']

        X = df.drop(["bail_eligibility", "case_id", "penalty", "imprisonment_duration_served",
                     "risk_of_escape", "risk_of_influence", "served_half_term"], axis=1)
        y = df["bail_eligibility"]
        X = pd.get_dummies(X, drop_first=True)
        X = X.reindex(columns=feature_names, fill_value=0)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred) * 100

        return jsonify({"accuracy": acc})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
