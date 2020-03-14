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
    return this.weatherReducer(response)
  }

  async getForecast() {
    const response = await this.get(`weather/forecast?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return Array.isArray(response) ? response.map(response => this.forecastReducer(response) ): []
  }

  async getSoil() {
    const response = await this.get(`soil?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return this.soilReducer(response)
  }

  async getSatImages() {
    const response = await this.get(`image/search?start=1577836800&end=1583838000&polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return Array.isArray(response) ? response.map(response => this.imageReducer(response)) : []
  }

  async getNDVI() {
    const response = await this.get(`ndvi/history?start=1577836800&end=1583838000&polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return Array.isArray(response) ? response.map(response => this.ndviReducer(response)) : []
  }

  async getUVI() {
    const response = await this.get(`uvi?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return this.uviReducer(response)
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

  forecastReducer(response) {
    return {
      dt: response.dt,
      main: {
        temp: response.main.temp,
        pressure: response.main.pressure,
        humidity: response.main.humidity,
        temp_min: response.main.temp_min,
        temp_max: response.main.temp_max,
        sea_level: response.main.sea_level,
        grnd_level: response.main.grnd_level,
        temp_kf: response.main.temp_kf
      },
      wind: {
        speed: response.wind.speed,
        deg: response.wind.deg
      },
      clouds: {
        all: response.clouds.all
      },
    }
  }

  soilReducer(response) {
    return {
      dt: response.dt, 
      t10: response.t10,
      moisture: response.moisture,
      t0: response.t0
    }
  }

  imageReducer(response) {
    return {
      dt: response.dt, 
      type: response.type,
      dc: response.dc,
      cl: response.cl,
      sun: response.sun,
      image: response.image,
      tile: response.tile,
      stats: response.stats,
      data: response.data
    }
  }

  ndviReducer(response) {
    return {
      dt: response.dt,
      p75: response.p75,
      min: response.min,
      max: response.max,
      median: response.median,
      p25: response.p25,
      num: response.num,
      mean: response.mean
    }
  }

  uviReducer(response) {
    return {
      dt: response.dt,
      uvi: response.uvi
    }
  }

  
}

module.exports = AgroAPI;