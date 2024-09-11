const typeDefs = `
  type Author {
    name: String!,
    id: ID!,
    born: Int,
    bookCount: Int
  }
  type Book {
    title: String!,
    published: Int!,
    author: Author,
    id: ID!,
    genres: [String!]!
  }
  type User {
    username: String!,
    name: String,
    favouriteGenre: String!,
    id: ID!
  }
  type Token {
    value: String!,
    expires: String!,
    username: String!,
    name: String!,
    genre: String!,
  }
  type Genre {
    value: [String!]!
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    allGenres: Genre
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      published: Int!,
      author: String!,
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      name: String
      password: String!
      favouriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!,
    authorEdited: Author!
  }
`

module.exports = typeDefs