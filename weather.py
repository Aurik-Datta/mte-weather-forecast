from flask import make_response, send_from_directory
from flask import Flask
from flask import jsonify
import requests
import json, uuid, os
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__, static_folder='client/build')
CORS(app)

load_dotenv()

WeatherAPIkey = os.getenv("API_KEY_WEATHER")
GeocodeAPIkey = os.getenv("API_KEY_GEOCODE")

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

def getlatlon(city):
    latlonRes = requests.get(
        f"https://maps.googleapis.com/maps/api/geocode/json?address={city}&key={GeocodeAPIkey}").json()
    lon = latlonRes['results'][0]['geometry']['location']['lng']
    lat = latlonRes['results'][0]['geometry']['location']['lat']
    latlon = {"lat": lat, "lon": lon}
    return latlon


@app.route("/api/fetchWeather/<city>", methods=["GET"])
def fetchWeather(city):
    latlon = getlatlon(city)
    weatherResponse = requests.get(f"https://api.openweathermap.org/data/2.5/onecall?lat={latlon['lat']}&lon={latlon['lon']}&exclude=minutely,hourly,alerts&units=metric&appid={WeatherAPIkey}").json()
    weather = {"current": weatherResponse['current'], "daily": weatherResponse['daily'][0:7]}
    temp = weatherResponse['current']['temp']
    return weather


if __name__ == "__main__":
    app.run()
