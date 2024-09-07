const booksController = require('./books')
const authorsController = require('./authors')

const resolvers = {
  Query: {
    bookCount: booksController.bookCount,
    authorCount: authorsController.authorCount,
    allBooks: booksController.filterBooks,
    allAuthors: authorsController.allAuthors
  },
  Mutation: {
    addBook: booksController.addBook,
    editAuthor: authorsController.editAuthor
  }
}

module.exports = resolvers