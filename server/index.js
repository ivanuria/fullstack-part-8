// Apollo
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
// Express & MISC
const express = require('express')
const cors = require('cors')
const http = require('http')
const jwt = require('jsonwebtoken')
// GraphQL
const { GraphQLError } = require('graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')
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
// Websockets
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

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

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanUp = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanUp.dispose()
            },
          }
        }
      },
    ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
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
    })
  )

  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log('Server running on http://localhost:4000')
  )
}

start()