module.exports = {
  Query: {
    weather: (_, __, { dataSources }) => dataSources.weatherAPI.getCurrentWeather(),
    forecast: (_, __, { dataSources }) => dataSources.weatherAPI.getForecast(),
    soil: (_, __, { dataSources }) => dataSources.weatherAPI.getSoil(),
    images: (_, __, { dataSources }) => dataSources.weatherAPI.getSatData(),
    ndvi: (_, __, { dataSources }) => dataSources.weatherAPI.getNDVI(),
    uvi: (_, __, { dataSources }) => dataSources.weatherAPI.getUVI(),
    daily: (_, __, { dataSources }) => dataSources.irriSatAPI.getEvapoTranspiration(),
    series: (_, __, { dataSources }) => dataSources.irriSatAPI.getEvapoTranspiration(),
    mapDates: (_, __, { dataSources }) => dataSources.irriSatAPI.getMapsDates(),
    mapLayers: (_, { date }, { dataSources }) => dataSources.irriSatAPI.getMapsLayer(date),
    cropGrowth: (_, __, { dataSources }) => dataSources.irriSatAPI.getCropGrowth(),
    mapImage: (_, __, { dataSources }) => dataSources.irriSatAPI.getMapsLayer(),
  },
  Mutation: {
    //mapDate: (_, { date }, { dataSources }) => dataSources.irriSatAPI.getMapsLayer(date)
  }
}