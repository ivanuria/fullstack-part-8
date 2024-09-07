const { GraphQLError } = require('graphql')

const parseErrors = error => {
  const invalidArgs = []
  const messages = []
  for (let key of Object.keys(error.errors)) {
    let errorData = error.errors[key].properties
    messages.push(errorData.message)
    invalidArgs.push(errorData.value)
  }
  throw new GraphQLError(messages.join("\n"), {
    extensions: {
      code: 'BAD_USER_INPUT',
      invalidArgs: invalidArgs
    }
  })
}

module.exports = parseErrors