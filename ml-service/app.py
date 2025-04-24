# app.py

from flask import Flask, request, jsonify
from predictor import predict_batch

app = Flask(__name__)

@app.route('/')
def home():
    return "模型服务已就绪"

@app.route('/predict_batch', methods=['POST'])
def predict_batch_route():
    try:
        batch = request.get_json()
        print(f"📥 接收到批量请求，共 {len(batch)} 条数据")

        return jsonify(predict_batch(batch))
    except Exception as e:
        print(f"❌ 批量预测出错: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
