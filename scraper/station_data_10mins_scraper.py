import time
import requests
import pymysql
import datetime
import traceback
from pymysql import Error
from config import Config

DB_CONFIG = {
    'host': Config.DB_HOST,
    'user': Config.DB_USER,
    'password': Config.DB_PASSWORD,
    'db': Config.DB_NAME,
    'port': Config.DB_PORT
}

API_CONFIG = {
    'url': "https://api.jcdecaux.com/vls/v3/stations",
    'params': {
        'apiKey': Config.JCDECAUX_API_KEY,
        'contract': "Dublin"
    }
}

def log(message):
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    formatted_message = f"[{timestamp}] {message}"
    print(formatted_message)
    with open("station_data_10mins.log", "a", encoding="utf-8") as f:
        f.write(formatted_message + "\n")

# 限制 retry 次数和回退
def fetch_stations(api_url, params, max_retries=3, timeout=10):
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(api_url, params=params, timeout=timeout)
            response.raise_for_status()
            return response.json()
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            log(f"⚠️ [{attempt}/{max_retries}] 网络错误: {e}")
        except requests.exceptions.HTTPError as http_err:
            log(f"📡 HTTPError: {http_err}")
            break
        except Exception as e:
            log(f"❗ 其他异常: {e}")
            traceback.print_exc()
        time.sleep(5 * attempt)  # 指数退避
    return []

def get_db_connection(config):
    return pymysql.connect(**config)

def insert_station(cursor, station):
    total_avail = station.get("totalStands", {}).get("availabilities", {})
    insert_query = """
        INSERT INTO bike_data_10min (
            number, status, last_update, connected, overflow, banking, bonus,
            latitude, longitude,
            available_bikes, available_bike_stands, capacity,
            mechanical_bikes, electrical_bikes,
            recorded_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
    """
    raw_last_update = station.get("lastUpdate")
    try:
        last_update = datetime.datetime.fromisoformat(raw_last_update.replace("Z", "+00:00")) \
            if isinstance(raw_last_update, str) else datetime.datetime.fromtimestamp(raw_last_update / 1000)
    except Exception:
        last_update = None

    values = (
        station.get("number"), station.get("status"), last_update,
        station.get("connected"), station.get("overflow"), station.get("banking"), station.get("bonus"),
        station.get("position", {}).get("latitude"), station.get("position", {}).get("longitude"),
        total_avail.get("bikes"), total_avail.get("stands"),
        station.get("totalStands", {}).get("capacity"),
        total_avail.get("mechanicalBikes"), total_avail.get("electricalBikes")
    )
    cursor.execute(insert_query, values)

def insert_all_stations(stations, db_config):
    connection = None
    try:
        connection = get_db_connection(db_config)
        with connection.cursor() as cursor:
            for station in stations:
                insert_station(cursor, station)
        connection.commit()
        log("✅ 成功插入所有站点数据")
    except Error as db_error:
        log(f"❌ 数据库错误: {db_error}")
        traceback.print_exc()
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()



def main():
    while True:
        try:
            log("🚴 开始抓取站点数据…")
            stations = fetch_stations(API_CONFIG['url'], API_CONFIG['params'])
            if stations:
                log(f"📦 获取到 {len(stations)} 个站点")
                insert_all_stations(stations, DB_CONFIG)
            else:
                log("⚠️ 获取失败，跳过本轮写库")
        except Exception as e:
            log(f"❌ 总体异常: {e}")
            traceback.print_exc()
        log("⏳ 等待 10 分钟...")
        time.sleep(600)

if __name__ == "__main__":
    main()
