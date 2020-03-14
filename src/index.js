const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const AgroAPI = require('./datasource/weather');
const resolvers = require('./resolvers');

require('dotenv').config({path: __dirname + '/.env'})

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => ({
    weatherAPI: new AgroAPI(),
  })
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
