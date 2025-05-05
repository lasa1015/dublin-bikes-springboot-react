import time
import requests
import pymysql
import datetime
import traceback
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

def log(message):
    current_time = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    formatted_message = f"[{current_time}] {message}"
    print(formatted_message)
    with open("weather_data_10mins.log", "a", encoding="utf-8") as file:
        file.write(formatted_message + "\n")

def fetch_data(api_url, params, max_retries=3, timeout=10):
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(api_url, params=params, timeout=timeout)
            response.raise_for_status()
            return response.json()
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            log(f"⚠️ [{attempt}/{max_retries}] 网络请求失败: {e}")
        except requests.exceptions.HTTPError as http_err:
            log(f"📡 HTTP 错误: {http_err}")
            break
        except Exception as e:
            log(f"❗ 其他错误: {e}")
            traceback.print_exc()
        time.sleep(5 * attempt)  # 指数退避
    return None

def get_db_connection(config):
    try:
        return pymysql.connect(**config)
    except Error as db_error:
        log(f"❌ 数据库连接失败: {db_error}")
        raise db_error

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
                weather_data['id'], weather_data['coord']['lon'], weather_data['coord']['lat'],
                weather_main['id'], weather_main['main'], weather_main['description'], weather_main['icon'],
                main_data['temp'], main_data['feels_like'], main_data['temp_min'], main_data['temp_max'],
                main_data['pressure'], main_data['humidity'], weather_data.get('visibility'),
                wind_data['speed'], wind_data['deg'], weather_data['clouds']['all'], weather_data['dt']
            )
            cursor.execute(insert_query, values)
            conn.commit()
            log("✅ 成功插入天气数据")
        except Error as insert_error:
            log(f"❌ 插入天气数据失败: {insert_error}")
            conn.rollback()
            raise insert_error

def main():
    while True:
        try:
            log("🌦️ 开始抓取天气数据...")
            weather = fetch_data(WEATHER_API_CONFIG['url'], WEATHER_API_CONFIG['params'])
            if weather:
                db_conn = get_db_connection(DB_CONFIG)
                with db_conn:
                    insert_weather_data(db_conn, weather)
            else:
                log("⚠️ 获取天气数据失败，跳过本轮插入。")
        except Exception as e:
            log(f"❌ 主流程异常: {e}")
            traceback.print_exc()
        log("⏳ 等待 10 分钟...")
        time.sleep(600)

if __name__ == "__main__":
    main()
