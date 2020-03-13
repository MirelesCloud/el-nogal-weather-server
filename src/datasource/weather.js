require('dotenv').config();
const { RESTDataSource } = require('apollo-datasource-rest');

const API_KEY = process.env['AGRO_API_KEY']

class AgroAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://api.agromonitoring.com/agro/1.0/'
  }

  async getCurrentWeather() {
    const response = await this.get(`weather?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    console.log(response)
    return this.weatherReducer(response)
  }

  weatherReducer(response) {
    return {
      dt: response.dt, 
      weather: [
        {
          id: response.weather.id,
          main: response.weather.main,
          description: response.weather.description
        }
      ],
      main: {
        temp: response.main.temp, 
        pressure: response.main.pressure,
        humidity: response.main.humidity,
        temp_min: response.main.temp_min,
        temp_max: response.main.temp_max
      },
      wind: {
        speed: response.wind.speed,
        deg: response.wind.deg
      },
      clouds: {
        all: response.clouds.all
      }
    }
  }

  
}

module.exports = AgroAPI;