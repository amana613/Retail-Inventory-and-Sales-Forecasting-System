from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"message": "ML service is running"})


@app.post("/forecast")
def forecast():
    body = request.get_json(silent=True) or {}
    data = body.get("data", [])

    if len(data) < 2:
        return jsonify({
            "message": "At least 2 historical data points are required"
        }), 400

    try:
        x = np.array([item["day_index"] for item in data]).reshape(-1, 1)
        y = np.array([item["quantity_sold"] for item in data])

        model = LinearRegression()
        model.fit(x, y)

        next_days = np.array([len(data) + 1, len(data) + 2, len(data) + 3]).reshape(-1, 1)
        predictions = model.predict(next_days)

        return jsonify({
            "next_days": next_days.flatten().tolist(),
            "predicted_demand": [max(0, round(float(value), 2)) for value in predictions],
            "model": "LinearRegression"
        })
    except Exception as error:
        return jsonify({"message": str(error)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
