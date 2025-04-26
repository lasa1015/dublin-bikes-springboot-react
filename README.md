## Dublin Bikes Mapper – Smart Bike Monitoring & Prediction Platform

### Website

[http://dublinbikes.site](http://dublinbikes.site)

------

### Project Overview

This project delivers a comprehensive web-based system for monitoring and predicting the availability of Dublin’s public bike-sharing network. It integrates real-time data from bike stations, weather APIs, and air quality APIs, combined with machine learning models to forecast future bike and stand availability.

To support model training, I first collected two months of historical data on bike usage and weather conditions. Live data was continuously collected from the JCDecaux API (for real-time bike station availability) and the OpenWeatherMap API (for current weather and forecasts). After processing and cleaning the collected data, I trained a Random Forest model using scikit-learn.

The platform adopts a **microservices architecture**, with separate services for scraping, prediction, backend API handling, and frontend visualization. It is fully containerized with Docker, deployed on AWS EC2, and uses an AWS RDS MySQL database for persistent storage. CI/CD automation is managed via GitHub Actions.

------

###  Tech Stack

- **Frontend**: React + Vite + TypeScript (Google Maps Platform, Google Charts)
- **Backend**: Spring Boot (Java, RESTful API)
- **Scrapers**: Python (requests, schedule, dotenv)
- **Model Training**: Python (scikit-learn Random Forest, Jupyter notebooks / scripts for model training)
- **Predictor**: Python + Flask microservice (serving the trained Random Forest model)
- **Database**: AWS RDS (MySQL)
- **Deployment & Infrastructure**: Docker, Docker Compose, Nginx, GitHub Actions (CI/CD), AWS EC2 (Hosting t4g.small), Namecheap (Domain & DNS)

---

### System Architecture

The system adopts a microservices-based architecture, consisting of the following independent services:

- **Scraper Service** (Python): Periodically collects live station and weather data via the JCDecaux and OpenWeatherMap APIs and stores it into the database.
- **Predictor Service** (Python + Flask): Hosts the trained Random Forest model and provides real-time prediction endpoints.
- **Backend API Service** (Spring Boot): Exposes RESTful APIs, manages business logic, and interacts with the database and prediction service.
- **Frontend Service** (React + Vite): Visualizes live station data, weather information, and prediction results using Google Maps and Google Charts.

Each service runs in its own Docker container, orchestrated with Docker Compose for simplified deployment, scaling, and maintenance

In addition to the services, the platform relies on a centralized database component:

- **AWS RDS MySQL**: Provides reliable and scalable persistent storage for all application data.

---

###  Folder Structure

```
dbbikes/
├── app/
│   ├── ml/                   # Scripts for applying ML models to generate predictions
│   ├── ML_models/            # Saved ML model files (.joblib)
│   ├── scraper/              # Data scrapers for weather, air quality, stations etc.
│   ├── static/               # Front-end static files (CSS, JS, images)
│   ├── templates/            # HTML templates for Flask rendering
│   ├── app.py   。             # Main Flask application entry point
│   ├── config.py             # Configuration loader from .env
│   └── .env                  # Environment variables (excluded from Git)
├── notebooks/                # Jupyter notebooks used for ML model training and preparation
├── requirements.txt          # Python dependency list
├── .gitignore                # Git ignore rules
└── README.md                 # Project overview and instructions
```

---

### Key Features

#### **● Displaying all the bike stations in Dublin**

Upon loading the website, all Dublin bike stations are displayed on the map, providing users with a clear overview of their distribution. Clicking on a station marker reveals an info box with key details, including station name and number, status, total capacity, real-time bike and stand availability, credit card support.

![image-20250426215749026](docs/images/image-20250426215749026.png)

![image-20250426215822921](docs/images/image-20250426215822921.png)



#### **● Weather forecast feature**

The top-left widget displays current weather conditions. Clicking it reveals 24-hour forecast charts for temperature and wind speed.

![image-20250426215859705](docs/images/image-20250426215859705.png)



#### ● **Machine Learning Prediction feature for Bikes and Stands**

When users click the “ML Availability Prediction” button on a selected station, the system displays bar charts forecasting the number of available bikes and stands over the next four days, helping users plan future trips.

![image-20250426220001780](docs/images/image-20250426220001780.png)



#### **● Real-Time Bike & Stand Distribution**

Users can toggle between "Bikes Avail" and "Stands Avail" views to display the real-time availability of bikes or bike stands across all stations. Availability is represented by colored circles on the map, where size indicates quantity and color reflects availability levels. A legend in the top-left corner provides reference.

![image-20250426220032593](docs/images/image-20250426220032593.png)

![image-20250426220049200](docs/images/image-20250426220049200.png)

#### **● Route Planning Between Stations**

Users can select any two bike stations — one as the departure point and one as the destination — to generate a suggested cycling route between them. 

![image-20250426220136418](docs/images/image-20250426220136418.png)

