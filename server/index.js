const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
// Mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
// Config
require('dotenv').config()
// Controllers
const typeDefs = require('./controllers/typeDefs')
const resolvers = require('./controllers/resolvers')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MONGODB')
  })
  .catch(error => {
    console.error('error connecting to MONGODB', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})