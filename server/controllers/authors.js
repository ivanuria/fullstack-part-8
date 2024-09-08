const { GraphQLError } = require('graphql')

const Author = require('../models/author')

/*let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]*/

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

  return editedAuthor
}

const authorCount = async () => Author.countDocuments({})

const allAuthors = async () => {
  return Author.find({})
}

module.exports = {
  editAuthor,
  authorCount,
  allAuthors
}