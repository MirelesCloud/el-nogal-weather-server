const { gql } = require('apollo-server');

const typeDefs = gql`
  type CurrentWeather {
    dt: Int
    weather: Weather
    main: Main
    wind: Wind
    clouds: Clouds
  }

  type Forecast {
    dt: Int
    weather: Weather
    main: Main
    wind: Wind
    rain: Rain
    clouds: Clouds

  }
  
  type Weather {
    id: Int
    main: String
    description: String
    icon: String
  }

  type Main {
    temp: Float
    pressure: Float
    humidity: Float
    temp_min: Float
    temp_max: Float
    sea_level: Float
    grnd_level: Float
    temp_kf: Float
  }

  type Wind {
    speed: Float
    deg: Int
  }

  type Rain {
    rain: Float
  }

  type Clouds {
    all: Int
  }

  type Soil {
    dt: Int
    d10: Float
    moisture: Float
    t0: Float
  }

  type SatImages {
    dt: Int
    type: String
    dc: Float
    cl: Float
    sun: Sun
    image: Image
    tile: Tile
    stats: Stats
    data: Data
  }
  
  type Sun {
    azimuth: Float
    elevation: Float
  }

  type Image {
    truecolor: String
    falsecolor: String
    ndvi: String
    evi: String
  }

  type Tile {
    truecolor: String
    falsecolor: String
    ndvi: String
    evi: String
  }

  type Stats {
    ndvi: String
    evi: String
  }

  type Data {
    truecolor: String
    falsecolor: String
    ndvi: String
    evi: String
  }

  type NDVI {
    dt: Int
    source: String
    zoom: Int
    dc: Float
    cl: Float
    data: NDVIData
  }

  type NDVIData {
    std: Float
    p75: Float
    min: Float
    max: Float
    median: Float
    p25: Float
    num: Int
    mean: Float
  }

  type UVI {
    dt: Int
    uvi: Float
  }

  type IrriSat {
    series: Series
    daily: [Daily]
    forecast: String
  }

  type Series {
    timestamp: [String]
    et0tall: [Float]
    et0short: [Float]

  }
  
  
  type Daily {
    date: String
    et0: Float
    description: String
    precipitation: Int
    icon: String
  }

  type Query {
    weather: CurrentWeather
    forecast: [Forecast]
    soil: Soil
    images: [SatImages]
    ndvi: [NDVI]
    uvi: UVI
    irrisat: IrriSat
    daily: [Daily]
    series: Series
    geometry: String
    
  }
`;

module.exports = typeDefs;