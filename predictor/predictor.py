import joblib
import numpy as np
import traceback

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
        try:
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
            if f"weather_description_{weather_value}" not in weather_set:
                print(f"⚠️ [WARNING] 传入的天气描述 '{weather_value}' 不在模型支持的列表中，预测将默认全部为 0")

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

        except Exception as e:
            print(f"❌ [ERROR] 构造特征时发生异常: {e}")
            traceback.print_exc()
            continue  # 跳过当前这条 forecast

    try:
        X = np.array(all_vectors)
        predictions = model.predict(X)
    except Exception as e:
        print(f"❌ [ERROR] 模型预测失败: {e}")
        traceback.print_exc()
        return []  # 模型完全失败，返回空结果

    results = []
    for i, meta in enumerate(metadata):
        try:
            results.append({
                "number": meta["number"],
                "forecast_time": meta["forecast_time"],
                "available_bikes": round(predictions[i][0]),
                "available_bike_stands": round(predictions[i][1])
            })
        except Exception as e:
            print(f"❌ [ERROR] 格式化预测结果失败: {e}，对应站点编号 {meta['number']}")
            traceback.print_exc()
            continue

    return results
