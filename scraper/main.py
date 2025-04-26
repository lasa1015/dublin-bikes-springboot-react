import subprocess
import time
import sys

# 获取当前运行的 Python 可执行路径（无论本地虚拟环境还是容器内）
PYTHON_EXEC = sys.executable

if __name__ == "__main__":
    processes = []

    try:
        print("Starting weather scraper...")
        weather_proc = subprocess.Popen([PYTHON_EXEC, "weather_data_10mins_scraper.py"])
        processes.append(weather_proc)

        print("Starting station scraper...")
        station_proc = subprocess.Popen([PYTHON_EXEC, "station_data_10mins_scraper.py"])
        processes.append(station_proc)

        # 等待两个子进程，正常情况下不会结束
        for proc in processes:
            proc.wait()

    except KeyboardInterrupt:
        print("Received exit signal. Terminating all subprocesses...")
        for proc in processes:
            proc.terminate()
        time.sleep(2)
