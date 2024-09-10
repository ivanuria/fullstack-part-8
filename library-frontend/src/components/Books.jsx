import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../controllers/queries'
import { useLocation, useNavigate } from 'react-router-dom'
import useLoggedUser from '../utils/useLoggedUser'
import useStore from '../controllers/useStore'
// MUI
import {
  Box,
  Grid2,
  Paper,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import TableMock from './Skeletons/TableMock'

const Books = ({ recommended }) => {
  const {favouriteGenre, expires, saveLogout} = useLoggedUser()
  const {filteredGenre:genre, setFilteredGenre:setGenre} = useStore()
  const [lastGenre, setLastGenre] = useState(genre)
  const genres = useQuery(ALL_GENRES)
  const queryOptions = {
    variables: { genre: genre },
    fetchPolicy: 'cache-and-network' // https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic
  }
  const query = useQuery(ALL_BOOKS, genre ? queryOptions : {})
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams({  redirect: location.pathname })

  useEffect(() => {
    if (recommended !== null) {
      setGenre(
        recommended
        ? favouriteGenre
        : lastGenre
      )
    }
  }, [recommended])
  useEffect(() => {
    if (recommended !== null) {
      setLastGenre(
        recommended
        ? lastGenre
        : genre
      )
    }
  }, [genre])
  useEffect(() => {
    const fn = async () => {
      if (recommended && expires <= new Date()) {
        await saveLogout()
        navigate(`/login?${params.toString()}`)
      }
    }
    fn()
  })

  return (
    <Box>
      <Typography
        component='h1'
        variant='h2'
      >
        Books
      </Typography>

        {
          recommended
        ? <Typography
            variant='h6'
            sx={{
              marginBlockEnd: '1rem'
            }}
          >
            Filtered by your favourite genre {genre}:
          </Typography>
        : <Grid2
            container
          >
          <Typography
            variant='h6'
            component='label'
            htmlFor='genre'
          >
            Filtered by Genre:
          </Typography>
          <Select
            value={genre}
            label=''
            id='genre'
            onChange={({ target }) => setGenre(target.value)}
            color='secondary'
            sx={{
              display: 'inline',
              width: '100%',
              textTransform: 'capitalize',
              marginBlockEnd: '2rem',
            }}
          >
            <MenuItem
              key=''
              value=''
              sx={{
                textTransform: 'capitalize'
              }}
            >
              All the genres
            </MenuItem>
            {
              genres.loading ? null : genres.data.allGenres.value.map(g =>
                <MenuItem
                  key={g}
                  value={g}
                  sx={{
                    textTransform: 'capitalize'
                  }}
                >
                  {g}
                </MenuItem>
              )
            }
          </Select>
          </Grid2>
        }
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: '60%'
                }}
              ></TableCell>
              <TableCell
                sx={{
                  width: '25%'
                }}
              >Author</TableCell>
              <TableCell
                sx={{
                  width: '15%'
                }}
              >Published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              query.loading
              ? <TableMock rows={5} />
              : query.data.allBooks.map((a) => (
                <TableRow key={`${a.title}-${a.author}`}>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.author && a.author.name}</TableCell>
                  <TableCell>{a.published}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Books
