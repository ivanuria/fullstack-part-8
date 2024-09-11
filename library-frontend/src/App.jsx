import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Message from './components/Message'
import Login from './components/Login'
import Header from "./components/Header";

import useStore from './controllers/useStore'
import { ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED, ALL_GENRES } from './controllers/queries'
import { useSubscription } from '@apollo/client'

import {
  Container,
} from '@mui/material'

import { Routes, Route } from 'react-router-dom'

const App = () => {
  const { setInfo } = useStore()
  useSubscription(BOOK_ADDED, {
    onData: async ({ data, client }) => {
      const bookAdded = data.data.bookAdded
      await client.cache.updateQuery({ query: ALL_BOOKS }, (store) => {
        const allBooks = store && store.allBooks
        if (allBooks) {
          if (allBooks.find(book => book.id === bookAdded.id)) return { allBooks }
          setInfo(`Added new Book '${bookAdded.title}' by ${bookAdded.author.name}`)
          return {
            allBooks: allBooks.concat(bookAdded)
          }
        } else{
          setInfo(`Added new Book '${bookAdded.title}' by ${bookAdded.author.name}`)
        }
      })

      await client.cache.updateQuery({ query: ALL_AUTHORS }, (store) => {
        const allAuthors = store && store.allAuthors
        if (allAuthors) {
          const cacheAuthor = allAuthors.find(author => author.id === bookAdded.author.id)
          if (cacheAuthor) {
            return { allAuthors: allAuthors.map(
              author =>
              author.id !== cacheAuthor.id
              ? author
              : { ...bookAdded.author, bookCount: author.bookCount + 1 }
            ) }
          }
          return { allAuthors: allAuthors.concat({ ...bookAdded.author, bookCount: 1 }) }
        }
      })

      await client.cache.updateQuery({ query: ALL_GENRES }, (store) => {
        const allGenres = store && store.allGenres
        if (allGenres) {
          let newGenres = [...allGenres.value]
          for (let genre of bookAdded.genres) {
            newGenres.push(genre.toLowerCase())
          }
          newGenres = [...new Set(newGenres)]
          newGenres.sort()
          return {
            allGenres: { __typename: 'Genre', value: newGenres }
          }
        }
      })
    }
  })
  return (
    <>
      <Header />
      <Container
        sx={{
          marginBlockStart: '1rem'
        }}
      >
          <Routes>
            <Route path='/' element={<Authors />} />
            <Route path='/books' element={<Books />} />
            <Route path='/books/add' element={<NewBook />} />
            <Route path='/books/recommended' element={<Books recommended={true} />} />
            <Route path='/login' element={<Login />} />
          </Routes>
      </Container>
      <Message />
    </>
  );
};

export default App;
