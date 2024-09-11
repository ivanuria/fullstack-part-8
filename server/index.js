const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
// Mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
// Config
require('dotenv').config()
// Controllers
const typeDefs = require('./controllers/typeDefs')
const resolvers = require('./controllers/resolvers')
// Models
const User = require('./models/user')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MONGODB')
  })
  .catch(error => {
    console.error('error connecting to MONGODB', error.message)
  })

const requireLogin = user => {
  console.log('user', user)
  if (!user) {
    throw new GraphQLError('Unauthorised', {
      extensions: {
        code: 'FORBIDDEN'
      }
    })
  }
}

mongoose.set('debug', true)

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    let currentUser = null
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      if ( decodedToken.uuid ) {
        const user = await User.findById(decodedToken.id)
        if (user.session.uuid === decodedToken.uuid && user.session.expires > new Date())
          currentUser = user
      }
    }
    return { currentUser, requireLogin: requireLogin }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})