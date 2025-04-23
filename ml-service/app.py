from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# 加载模型
model = joblib.load("prediction_model.pkl")

# 特征顺序（必须和训练时保持一致）
feature_order = [
                    'temp', 'pressure', 'humidity', 'visibility', 'wind_speed', 'wind_deg', 'clouds',
                    'hour', 'weekday',
                    'weather_description_broken clouds', 'weather_description_clear sky', 'weather_description_few clouds',
                    'weather_description_light intensity drizzle', 'weather_description_light intensity drizzle rain',
                    'weather_description_light intensity shower rain', 'weather_description_light rain',
                    'weather_description_mist', 'weather_description_moderate rain',
                    'weather_description_overcast clouds', 'weather_description_scattered clouds'
                ] + [f"number_{i}" for i in [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
    62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83,
    84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102,
    103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117
]]

@app.route('/')
def home():
    return " 模型服务已就绪"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # 提取所有通用特征（所有车站都相同的部分）
        base_features = [
            data.get("temp", 0),
            data.get("pressure", 0),
            data.get("humidity", 0),
            data.get("visibility", 0),
            data.get("wind_speed", 0),
            data.get("wind_deg", 0),
            data.get("clouds", 0),
            data.get("hour", 0),
            data.get("weekday", 0)
        ]

        # 天气描述 one-hot 编码（同样所有车站都一样）
        weather_value = data.get("weather_description", "")
        weather_set = [col for col in feature_order if col.startswith("weather_description_")]
        weather_onehot = [
            1 if weather.split("weather_description_")[1] == weather_value else 0
            for weather in weather_set
        ]

        # 初始化预测结果
        predictions = []

        # 所有车站编号
        number_list = [int(col.split("_")[1]) for col in feature_order if col.startswith("number_")]

        for number in number_list:
            # 构建 one-hot 车站向量
            number_onehot = [1 if f"number_{number}" == col else 0 for col in feature_order if col.startswith("number_")]

            # 构造完整特征向量
            feature_vector = base_features + weather_onehot + number_onehot
            X = np.array(feature_vector).reshape(1, -1)

            # 模型预测
            prediction = model.predict(X)[0]

            # 保存当前车站的预测值
            predictions.append({
                "number": number,
                "available_bikes": round(prediction[0]),
                "available_bike_stands": round(prediction[1])
            })

        return jsonify(predictions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
