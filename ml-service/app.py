from flask import Flask, request, jsonify
from predictor import predict_all_stations

app = Flask(__name__)

@app.route('/')
def home():
    return "模型服务已就绪"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        return jsonify(predict_all_stations(data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
