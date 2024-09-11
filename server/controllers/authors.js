const { GraphQLError } = require('graphql')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('../models/author')

const editAuthor = async (root, { name, setBornTo }, { currentUser, requireLogin }) => {
  requireLogin(currentUser)
  let editedAuthor
  try {
    editedAuthor = await Author.findOneAndUpdate(
      { name }, // Filter
      { born: parseInt(setBornTo) }, // Updatedata
      {
        new: true,
        runValidators: true
      } // return new object
    )
  } catch (error) {
    throw new GraphQLError('Born year not valid', {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: setBornTo
      }
    })
  }

  pubsub.publish('AUTHOR_EDITED', { authorEdited: editedAuthor })

  return editedAuthor
}

const authorCount = async () => Author.countDocuments({})

const allAuthors = async () => {
  return Author.find({})
}

const authorEdited = {
  subscribe: () => pubsub.asyncIterator('AUTHOR_EDITED')
}

module.exports = {
  editAuthor,
  authorCount,
  allAuthors,
  authorEdited,
}