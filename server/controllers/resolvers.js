const booksController = require('./books')
const authorsController = require('./authors')
const usersController = require('./users')

const resolvers = {
  Query: {
    bookCount: booksController.bookCount,
    authorCount: authorsController.authorCount,
    allBooks: booksController.filterBooks,
    allAuthors: authorsController.allAuthors,
    me: usersController.me,
    allGenres: booksController.allGenres,
  },
  Mutation: {
    addBook: booksController.addBook,
    editAuthor: authorsController.editAuthor,
    createUser: usersController.createUser,
    login: usersController.login,
  },
  Subscription: {
    bookAdded: booksController.bookAdded,
    authorEdited: authorsController.authorEdited,
  }
}

module.exports = resolvers