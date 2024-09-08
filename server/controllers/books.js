const parseErrors = require('./parseErrors')

const Book = require('../models/book')
const Author = require('../models/author')

/*let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]*/

const filterBooks = async (root, { author, genre }) => {
  let filter = {}
  if (author) {
    const searchedAuthor = await Author.findOne({ name: author })
    if (searchedAuthor) {
      filter = { ...filter, author: searchedAuthor._id.toString() }
    } else {
      /*throw new GraphQLError(`No author of name '${author}' found`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: author
        }
      })*/ // Maybe is required later, let this be for a while
      return []
    }
  }
  if (genre) {
    filter = { ...filter, genres: { $in: genre } }
  }
  return await Book.find(filter)
}

const addBook = async (root, { title, published, author, genres }, { currentUser, requireLogin }) => {
  requireLogin(currentUser)
  let savedAuthor = await Author.findOne({ name: author }) // using findOneAndUpdate to achieve this is buggy due to validations
  if (!savedAuthor) {
    try {
      savedAuthor = new Author({ name: author })
      savedAuthor.save()
    } catch (error) {
      parseErrors(error)
    }
  }

  let newBook
  try {
    newBook = new Book({
      title,
      published,
      author: savedAuthor._id.toString(),
      genres,
    })
    await newBook.save()
  } catch (error) {
    parseErrors(error)
  }

  return newBook
}

const bookCount = async () => Book.countDocuments({})

module.exports = {
  addBook,
  bookCount,
  filterBooks
}