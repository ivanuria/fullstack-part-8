import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS, ALL_GENRES } from '../controllers/queries'
import useStore from '../controllers/useStore'
import { useNavigate, useLocation } from 'react-router-dom'
import useLoggedUser from '../utils/useLoggedUser'
//MUI
import {
  Button,
  Grid2,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import { useState } from 'react'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const navigate = useNavigate()
  const { setError, setSuccess, userName } = useStore()
  const { saveLogout } = useLoggedUser()

  const location = useLocation()
  const params = new URLSearchParams({
    redirect: location.pathname
  })

  const [createBook] = useMutation(ADD_BOOK, {
    onError: async (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      if (error.message.toLowerCase().includes('unauthorised')) {
        await saveLogout()
        navigate(`/login?${params.toString()}`)
      }
      setError(messages)
    },
    onCompleted: () => {
      setSuccess(`${title} by ${author} correctly added`);
      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
      navigate('/books')
    },
    update: async (cache, { data }) => {
      // Update Books
      await cache.updateQuery({ query: ALL_BOOKS }, (store) => {
        const allBooks = store && store.allBooks
        if (allBooks) {
          if (allBooks.find(book => book.id === data.addBook.id)) return { allBooks }
          return { allBooks: allBooks.concat(data.addBook) }
        }
      })
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, author, published: parseInt(published), genres } })
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  useEffect(() => {
    if (!userName) navigate('/login')
  }, [userName])

  return (
    <>
      <Typography
        component='h1'
        variant='h2'
      >
        Add a New Book
      </Typography>
      <Paper>
        <form onSubmit={submit}>
          <Grid2
            container
            spacing={2}
          >
            <TextField
              label='Title'
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <TextField
              label='Author'
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
            <TextField
              label='Published'
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
            <Grid2 size={8}>
              <TextField
                label='Genre'
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addGenre()
                  }
                }}
              />
            </Grid2>
            <Grid2 size={4}>
              <Button
                onClick={addGenre}
                color='secondary'
                variant='outlined'
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              >
                Add Genre
              </Button>
            </Grid2>
            <Grid2 size={12}>
              <Typography>Genres: {genres.join(' ')}</Typography>
            </Grid2>
            <Grid2 size={12} justifyContent='center' display='flex'>
              <Button variant='contained' type="submit">Create Book</Button>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
    </>
  )
}

export default NewBook