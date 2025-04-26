import time
import requests
import pymysql
import datetime
from pymysql import Error
from config import Config

# 数据库配置
DB_CONFIG = {
    'host': Config.DB_HOST,
    'user': Config.DB_USER,
    'password': Config.DB_PASSWORD,
    'db': Config.DB_NAME,
    'port': Config.DB_PORT
}

# OpenWeatherMap API 配置
WEATHER_API_CONFIG = {
    'url': "http://api.openweathermap.org/data/2.5/weather",
    'params': {
        'lat': 53.349805,
        'lon': -6.260310,
        'appid': Config.OPENWEATHER_API_KEY,
        'units': 'metric'
    }
}

# 日志函数（同时写日志文件 + 控制台打印）
def log(message):
    current_time = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    formatted_message = f"[{current_time}] {message}"
    print(formatted_message)
    with open("weather_data_10mins.log", "a", encoding="utf-8") as file:
        file.write(formatted_message + "\n")

# 获取天气数据
def fetch_data(api_url, params):
    response = requests.get(api_url, params=params)
    response.raise_for_status()
    return response.json()

# 获取数据库连接
def get_db_connection(config):
    try:
        conn = pymysql.connect(**config)
        return conn
    except Error as db_error:
        log(f"❌ Database connection error: {db_error}")
        raise db_error

# 插入天气数据
def insert_weather_data(conn, weather_data):
    with conn.cursor() as cursor:
        try:
            insert_query = """
                INSERT INTO weather_data_10min (
                    location_id, longitude, latitude, weather_id, weather_main, weather_description, weather_icon,
                    temp, feels_like, temp_min, temp_max, pressure, humidity, visibility, wind_speed, wind_deg,
                    clouds, data_timestamp
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            weather_main = weather_data['weather'][0]
            main_data = weather_data['main']
            wind_data = weather_data['wind']
            values = (
                weather_data['id'], weather_data['coord']['lon'], weather_data['coord']['lat'], weather_main['id'],
                weather_main['main'], weather_main['description'], weather_main['icon'], main_data['temp'],
                main_data['feels_like'], main_data['temp_min'], main_data['temp_max'], main_data['pressure'],
                main_data['humidity'], weather_data.get('visibility'), wind_data['speed'], wind_data['deg'],
                weather_data['clouds']['all'], weather_data['dt']
            )
            cursor.execute(insert_query, values)
            conn.commit()
            log("Successfully inserted weather data into database.")
        except Error as insert_error:
            log(f"❌ Database insert error: {insert_error}")
            conn.rollback()
            raise insert_error

# 主程序
def main():
    while True:
        try:
            log("Starting weather data scraping...")
            weather = fetch_data(WEATHER_API_CONFIG['url'], WEATHER_API_CONFIG['params'])
            db_conn = get_db_connection(DB_CONFIG)
            with db_conn:
                insert_weather_data(db_conn, weather)
            log("Completed one weather data cycle. Sleeping for 10 minutes.")
        except Exception as e:
            log(f"❌ Unexpected error: {e}")
        time.sleep(600)

if __name__ == "__main__":
    main()
