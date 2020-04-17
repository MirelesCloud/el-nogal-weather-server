require('dotenv').config();
const { RESTDataSource } = require('apollo-datasource-rest');

const API_KEY = process.env['AGRO_API_KEY']

class IrriSatAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://irrisat-cloud.appspot.com/_ah/api/irrisat/v1/services/'
  }

  async getMapsDates() {
    const response = await this.get('maps/dates')
    return Array.isArray(response.items) ? response.items.map(response => this.mapsDatesReducer(response)) : []
  }

  mapsDatesReducer(response) {
    return {
      date: response.date,
      dateurl: response.dateurl,
    }
  }

  async getMapsLayer(date) {
    
    const response = await this.get(`maps/layers/${date}`)
    console.log(response.items)
    return Array.isArray(response.items) ? response.items.map(response => this.mapsLayerReducer(response)) : []
  }

  mapsLayerReducer(response) {
    return {
      token: response.token,
      mapid: response.mapid,
      name: response.name
    }
  }

  async getCropGrowth() {
    const params = {
      "Start": "2019-05-01T00:00:00",
      "End": "2020 -04-01T00:00:00",
      "ManagementUnit": {
      "Geometry": "POLYGON((36.372017, -119.648216,36.378081, -119.648216, 36.378141, -119.647111,36.379126, -119.646993,36.379118, -119.644654,36.378694, -119.644557,36.378651, -119.643881,36.373805, -119.643892,36.373779, -119.646081,36.372034, -119.646091))"
      }
    }

    const response = await this.post('data/cropgrowth', {body: params}).catch((err) => {console.log(err)})
    return response
  }

  cropGrowthReducer(response) {
    return {
      geometry: response.geometry,
    }
  }

  async getEvapoTranspiration() {
    const response = await this.get('forecast/evapotranspiration/36.375639/-119.646130')
    return response.Daily.map(response => this.dailyReducer(response))
  }

  dailyReducer(response) {
    return {
      et0: response.ET0,
      date: response.Date,
      description: response.Description,
      icon: response.Icon,
      precipitation: response.PrecipProbability
    }
  }
}



class AgroAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://api.agromonitoring.com/agro/1.0/'
  }

  async getCurrentWeather() {
    const response = await this.get(`weather?polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    
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
    let end = new Date();
    end.setDate(end.getDate() - 1)
    end = (end/1000).toFixed(0)
    let start = new Date()
    start.setMonth(start.getMonth() - 6)
    start = (start/1000).toFixed(0)
    const response = await this.get(`image/search?start=${start}&end=${end}&polyid=5e66f15ff6e0ca64d7708957&appid=${API_KEY}`)
    
    return Array.isArray(response) ? response.map(response => this.imageReducer(response)) : []
  }

  async getNDVI() {
    let end = new Date();
    end.setDate(end.getDate() - 1)
    end = (end/1000).toFixed(0)
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
      weather: {
        id: response.weather.id,
        main: response.weather.main,
        description: response.weather.description,
        icon: response.weather.icon
      }
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

module.exports = { AgroAPI, IrriSatAPI };
