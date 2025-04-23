import os
import sys
import time
import traceback
import datetime
import requests
import pymysql
from pymysql import Error
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'db': os.getenv("DB_NAME"),
    'port': int(os.getenv("DB_PORT"))
}

API_CONFIG = {
    'url': "https://api.jcdecaux.com/vls/v3/stations",
    'params': {
        'apiKey': os.getenv("JCDECAUX_API_KEY"),
        'contract': "Dublin"
    }
}

def log(msg):
    timestamp = datetime.datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{timestamp} {msg}"
    print(line)
    with open("scraper.log", "a") as f:
        f.write(line + "\n")
        f.flush()

def load_data(api_url, params):
    response = requests.get(api_url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

def get_db_connection(config):
    return pymysql.connect(**config)

def insert_availability_data(cursor, station):
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

    log(f"Inserting station #{station.get('number')}: bikes={total_avail.get('bikes')}, stands={total_avail.get('stands')}, last_update={last_update}")
    cursor.execute(insert_query, values)


def insert_data_to_db(stations, db_config):
    connection = None
    try:
        connection = get_db_connection(db_config)
        with connection.cursor() as cursor:
            for station in stations:
                insert_availability_data(cursor, station)
        connection.commit()
        log("✅ Database write successful.")
    except pymysql.Error as db_error:
        log(f"❌ Database error: {db_error}")
        traceback.print_exc()
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()

# 主循环，每10分钟抓取一次
def main():
    while True:
        try:
            log("Start scraping...")
            stations = load_data(API_CONFIG['url'], API_CONFIG['params'])
            log(f"Fetched {len(stations)} stations.")
            insert_data_to_db(stations, DB_CONFIG)
        except Exception as e:
            log(f"❌ Unexpected error: {e}")
            traceback.print_exc()
        log("Sleeping for 10 minutes.\n")
        time.sleep(600)

if __name__ == "__main__":
    main()
