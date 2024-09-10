const parseErrors = require('./parseErrors')

const Book = require('../models/book')
const Author = require('../models/author')

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
    filter = { ...filter, genres: { $in: RegExp('^'+genre+'$', 'i') } }
    console.log(filter)
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

const allGenres = async () => {
  const genres = await Book.find({genres: { $exists: true }}, { genres: 1, author: 0 })
  const genresToReturn = [
    ...new Set(
      genres.reduce((accumulated, item) => accumulated.concat(item.genres.map(i => i.toLowerCase())), [])
    )
  ]
  genresToReturn.sort()
  return { value: genresToReturn }
}

module.exports = {
  addBook,
  bookCount,
  filterBooks,
  allGenres,
}