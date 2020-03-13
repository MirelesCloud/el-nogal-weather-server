const { gql } = require('apollo-server');

const typeDefs = gql`
  type CurrentWeather {
    dt: Int
    weather: [Weather]
    main: Main
    wind: Wind
    clouds: Clouds
  }
  
  type Weather {
    id: ID 
    main: String
    description: String
  }

  type Main {
    temp: Float
    pressure: Float
    humidity: Float
    temp_min: Float
    temp_max: Float
  }

  type Wind {
    speed: Float
    deg: Int
  }

  type Clouds {
    all: Int
  }

  type Query {
    weather: CurrentWeather
  }
`;

module.exports = typeDefs;