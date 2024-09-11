import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    published
    author {
      id
      name
      born
    }
    id
    genres
  }
`

const AUTHOR_DETAILS = gql`
  fragment authorDetails on Author {
    bookCount
    born
    id
    name
  }
`

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      ...authorDetails
    }
  }
    ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
  query AllBooks ($genre: String) {
    allBooks (genre: $genre) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(title: $title, published: $published, author: $author, genres: $genres) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value,
    expires,
    name,
    username,
    genre
  }
}
`

export const ALL_GENRES = gql`
  query AllGenres {
    allGenres {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const AUTHOR_EDITED = gql`
  subscription {
    authorEdited {
      ...authorDetails
    }
  }
  ${AUTHOR_DETAILS}
`