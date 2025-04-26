FROM python:3.10-slim

WORKDIR /app

# 拷贝代码和环境变量文件
COPY . .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 启动抓取脚本
CMD ["python", "main.py"]
