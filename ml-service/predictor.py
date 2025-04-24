# predictor.py

import joblib
import numpy as np

model = joblib.load("prediction_model.pkl")

feature_order = [
                    'temp', 'pressure', 'humidity', 'visibility', 'wind_speed', 'wind_deg', 'clouds',
                    'hour', 'weekday',
                    'weather_description_broken clouds', 'weather_description_clear sky', 'weather_description_few clouds',
                    'weather_description_light intensity drizzle', 'weather_description_light intensity drizzle rain',
                    'weather_description_light intensity shower rain', 'weather_description_light rain',
                    'weather_description_mist', 'weather_description_moderate rain',
                    'weather_description_overcast clouds', 'weather_description_scattered clouds'
                ] + [f"number_{i}" for i in range(1, 118) if i != 46 and i != 70 and i != 81]

def predict_batch(forecast_list):
    weather_set = [col for col in feature_order if col.startswith("weather_description_")]
    number_list = [int(col.split("_")[1]) for col in feature_order if col.startswith("number_")]
    all_vectors = []
    metadata = []

    for forecast in forecast_list:
        base_features = [
            forecast.get("temp", 0),
            forecast.get("pressure", 0),
            forecast.get("humidity", 0),
            forecast.get("visibility", 0),
            forecast.get("wind_speed", 0),
            forecast.get("wind_deg", 0),
            forecast.get("clouds", 0),
            forecast.get("hour", 0),
            forecast.get("weekday", 0)
        ]

        weather_value = forecast.get("weather_description", "")
        weather_onehot = [
            1 if w.split("weather_description_")[1] == weather_value else 0
            for w in weather_set
        ]

        for number in number_list:
            number_onehot = [1 if f"number_{number}" == col else 0 for col in feature_order if col.startswith("number_")]
            all_vectors.append(base_features + weather_onehot + number_onehot)
            metadata.append({
                "number": number,
                "forecast_time": forecast.get("forecast_time")
            })

    X = np.array(all_vectors)
    predictions = model.predict(X)

    results = []
    for i, meta in enumerate(metadata):
        results.append({
            "number": meta["number"],
            "forecast_time": meta["forecast_time"],
            "available_bikes": round(predictions[i][0]),
            "available_bike_stands": round(predictions[i][1])
        })

    return results
