import subprocess
import time
import sys
import os

PYTHON_EXEC = sys.executable

# 脚本路径（假设与 main.py 同目录）
SCRIPTS = {
    "weather scraper": "weather_data_10mins_scraper.py",
    "station scraper": "station_data_10mins_scraper.py"
}

def start_process(name, script):
    try:
        print(f"🚀 启动 {name}...")
        proc = subprocess.Popen([PYTHON_EXEC, script])
        return proc
    except Exception as e:
        print(f"❌ 启动 {name} 失败: {e}")
        return None

if __name__ == "__main__":
    processes = []

    try:
        # 启动所有子进程
        for name, script in SCRIPTS.items():
            proc = start_process(name, script)
            if proc:
                processes.append((name, proc))

        # 检查子进程是否异常退出
        while True:
            for name, proc in processes:
                retcode = proc.poll()
                if retcode is not None:
                    print(f"⚠️ {name} 已退出，返回码：{retcode}，5 秒后尝试重启...")
                    processes.remove((name, proc))
                    time.sleep(5)
                    new_proc = start_process(name, SCRIPTS[name])
                    if new_proc:
                        processes.append((name, new_proc))
            time.sleep(10)

    except KeyboardInterrupt:
        print("🛑 收到退出信号，正在终止所有子进程...")
        for name, proc in processes:
            print(f"🛑 正在终止 {name}...")
            proc.terminate()
        time.sleep(2)
        print("✅ 所有子进程已终止。")
