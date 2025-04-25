import subprocess
import time

if __name__ == "__main__":
    processes = []

    try:
        print("Starting weather scraper...")
        weather_proc = subprocess.Popen(["python", "weather_data_10mins_scraper.py"])
        processes.append(weather_proc)

        print("Starting station scraper...")
        station_proc = subprocess.Popen(["python", "station_data_10mins_scraper.py"])
        processes.append(station_proc)

        # 等待两个进程结束（理论上不会结束，除非报错或被杀）
        for proc in processes:
            proc.wait()

    except KeyboardInterrupt:
        print("Received exit signal. Terminating...")
        for proc in processes:
            proc.terminate()
        time.sleep(2)
