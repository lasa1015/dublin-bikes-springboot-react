import os
from dotenv import load_dotenv

# 加载.env配置
load_dotenv()

class Config:
    # 数据库配置
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")

    # JCDecaux 公共自行车 API
    JCDECAUX_API_KEY = os.getenv("JCDECAUX_API_KEY")

    # OpenWeather 天气 API
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


