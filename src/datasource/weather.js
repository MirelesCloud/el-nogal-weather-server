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
    
   const convertArray = (array) => {
     const initialValue = {};
     return array.reduce((obj, item) => {
       return {
         ...obj,
         [item]: item,
       };
     }, initialValue)
   }
   
    const result = {}
    Object.assign(result, response.weather[0])
    delete response.weather
    response.weather = result
    
    return this.weatherReducer(response)
  }

  async getForecast() {
    const response = await this.get(`weather/forecast?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    
    response.map(i => {
      const result = {}
      Object.assign(result, i.weather[0]),
      delete i.weather
      i.weather = result
    })
    
    return Array.isArray(response) ? response.map(response => this.forecastReducer(response) ): []
  }

  async getSoil() {
    const response = await this.get(`soil?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return this.soilReducer(response)
  }

  async getSatData() {
    let end = (new Date()/1000).toFixed(0);
    let start = new Date()
    start.setMonth(start.getMonth() - 12)
    start = (start/1000).toFixed(0)
    const response = await this.get(`image/search?start=${start}&end=${end}&polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return Array.isArray(response) ? response.map(response => this.imageReducer(response)) : []
  }

  async getNDVI() {
    let end = (new Date()/1000).toFixed(0);
    let start = new Date()
    start.setMonth(start.getMonth() - 6)
    start = (start/1000).toFixed(0)
    const response = await this.get(`ndvi/history?start=${start}&end=${end}&polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return Array.isArray(response) ? response.map(response => this.ndviReducer(response)) : []
  }

  async getUVI() {
    const response = await this.get(`uvi?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    return this.uviReducer(response)
  }
 
  arrayReducer(response) {
    return {
      weather: [
        {
          id: response.weather.id,
          main: response.weather.main,
          description: response.weather.description,
          icon: response.weather.icon
        }
      ],
    }
  }

  weatherReducer(response) {
    return {
      dt: response.dt, 
      weather: {
          id: response.weather.id,
          main: response.weather.main,
          description: response.weather.description,
          icon: response.weather.icon
        },
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
      sun: {
        azimuth: response.sun.azimuth,
        elevation: response.sun.elevation
      },
      image: {
        truecolor: response.image.truecolor,
        falsecolor: response.image.falsecolor,
        ndvi: response.image.ndvi,
        evi: response.image.evi
      },
      tile: {
        truecolor: response.tile.truecolor,
        falsecolor: response.tile.falsecolor,
        ndvi: response.tile.ndvi,
        evi: response.tile.evi
      },
      stats: {
        ndvi: response.stats.ndvi,
        evi: response.stats.evi
      },
      data: {
        truecolor: response.data.truecolor,
        falsecolor: response.data.falsecolor,
        ndvi: response.data.ndvi,
        evi: response.data.evi,
      }
    }
  }

  ndviReducer(response) {
    return {
      dt: response.dt,
      source: response.source,
      zoom: response.zoom,
      dc: response.dc,
      cl: response.cl,
      data: {
        p75: response.data.p75,
        min: response.data.min,
        max: response.data.max,
        median: response.data.median,
        p25: response.data.p25,
        num: response.data.num,
        mean: response.data.mean
      }
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