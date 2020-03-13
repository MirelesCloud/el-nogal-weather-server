module.exports = {
  Query: {
    weather: (_, __, { dataSources }) => dataSources.weatherAPI.getCurrentWeather()
  }
}