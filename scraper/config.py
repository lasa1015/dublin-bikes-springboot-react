import os
from dotenv import load_dotenv


load_dotenv()



class Config:

    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_USER = os.getenv("DB_USERNAME")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")

    # JCDecaux API
    JCDECAUX_API_KEY = os.getenv("JCDECAUX_API_KEY")

    # OpenWeather  API
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


