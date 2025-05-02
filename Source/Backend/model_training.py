from catboost import CatBoostClassifier
from skopt import BayesSearchCV
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

MODEL_DIR = "catboost_model"
MODEL_PATH = os.path.join(MODEL_DIR, "catboost_model.joblib")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.joblib")
DATA_PATH = "a(2).csv"

def train_and_save_model():
    # Load data
    df = pd.read_csv(DATA_PATH)

    # Feature engineering
    df["risk_score"] = (df["risk_of_escape"].astype(int) +
                        df["risk_of_influence"].astype(int) +
                        df["served_half_term"].astype(int))
    
    df["penalty_severity"] = df["penalty"].map({"Fine": 1, "Imprisonment": 2, "Both": 3}) * df["imprisonment_duration_served"]

    # Split into features and target
    X = df.drop(["bail_eligibility", "case_id", "penalty", "imprisonment_duration_served",
                 "risk_of_escape", "risk_of_influence", "served_half_term"], axis=1)
    y = df["bail_eligibility"]
    X = pd.get_dummies(X, drop_first=True)

    # Save feature names
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(X.columns.tolist(), FEATURES_PATH)

    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Initialize CatBoostClassifier
    model = CatBoostClassifier(verbose=0, random_state=42)

    # Define parameter space for Bayesian Optimization
    param_space = {
        'iterations': (100, 500),  # Number of trees
        'depth': (4, 10),  # Depth of the trees
        'learning_rate': (0.01, 0.2),  # Learning rate
        'l2_leaf_reg': (1, 10),  # Regularization
        'bagging_temperature': (0, 1),  # Data sampling strength
        'border_count': (32, 255),  # Number of splits for features
    }

    # Perform Bayesian Optimization
    bayes_search = BayesSearchCV(
        model,
        param_space,
        n_iter=50,  # Increased iterations
        cv=3,  # Cross-validation
        n_jobs=-1,  # Use all processors
        verbose=2,
        random_state=42
    )

    # Fit the model
    bayes_search.fit(X_train, y_train)

    # Get the best model
    best_model = bayes_search.best_estimator_

    # Evaluate model
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred) * 100

    print(f"✅ Optimized CatBoost Model Accuracy: {accuracy:.2f}%")
    
    # Save the best model
    joblib.dump(best_model, MODEL_PATH)

if __name__ == "__main__":
    train_and_save_model()
