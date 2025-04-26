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

# JCDecaux 自行车站点 API 配置
API_CONFIG = {
    'url': "https://api.jcdecaux.com/vls/v3/stations",
    'params': {
        'apiKey': Config.JCDECAUX_API_KEY,
        'contract': "Dublin"
    }
}

# 日志函数（控制台+文件）
def log(message):
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    formatted_message = f"[{timestamp}] {message}"
    print(formatted_message)
    with open("station_data_10mins.log", "a", encoding="utf-8") as f:
        f.write(formatted_message + "\n")

# 获取站点数据
def fetch_stations(api_url, params):
    response = requests.get(api_url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

# 获取数据库连接
def get_db_connection(config):
    return pymysql.connect(**config)

# 插入一条站点数据
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
        if isinstance(raw_last_update, str):
            last_update = datetime.datetime.fromisoformat(raw_last_update.replace("Z", "+00:00"))
        else:
            last_update = datetime.datetime.fromtimestamp(raw_last_update / 1000)
    except Exception:
        last_update = None

    values = (
        station.get("number"),
        station.get("status"),
        last_update,
        station.get("connected"),
        station.get("overflow"),
        station.get("banking"),
        station.get("bonus"),
        station.get("position", {}).get("latitude"),
        station.get("position", {}).get("longitude"),
        total_avail.get("bikes"),
        total_avail.get("stands"),
        station.get("totalStands", {}).get("capacity"),
        total_avail.get("mechanicalBikes"),
        total_avail.get("electricalBikes")
    )

    cursor.execute(insert_query, values)

# 插入所有站点数据
def insert_all_stations(stations, db_config):
    connection = None
    try:
        connection = get_db_connection(db_config)
        with connection.cursor() as cursor:
            for station in stations:
                insert_station(cursor, station)
        connection.commit()
        log("Successfully inserted all station data into database.")
    except Error as db_error:
        log(f"❌ Database error while inserting station data: {db_error}")
        traceback.print_exc()
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()

# 主程序
def main():
    while True:
        try:
            log("Starting station data scraping...")
            stations = fetch_stations(API_CONFIG['url'], API_CONFIG['params'])
            log(f"Successfully fetched {len(stations)} stations.")
            insert_all_stations(stations, DB_CONFIG)
            log("Completed one station data cycle. Sleeping for 10 minutes.")
        except Exception as e:
            log(f"❌ Unexpected error during station data process: {e}")
            traceback.print_exc()
        time.sleep(600)

if __name__ == "__main__":
    main()
