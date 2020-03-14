module.exports = {
  Query: {
    weather: (_, __, { dataSources }) => dataSources.weatherAPI.getCurrentWeather(),
    forecast: (_, __, { dataSources }) => dataSources.weatherAPI.getForecast(),
    soil: (_, __, { dataSources }) => dataSources.weatherAPI.getSoil(),
    images: (_, __, { dataSources }) => dataSources.weatherAPI.getSatImages(),
    ndvi: (_, __, { dataSources }) => dataSources.weatherAPI.getNDVI(),
    uvi: (_, __, { dataSources }) => dataSources.weatherAPI.getUVI()
  }
}