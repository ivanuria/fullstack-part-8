import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../controllers/queries'
import useLoggedUser from '../utils/useLoggedUser'
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

const Books = ({ recommended=false }) => {
  const {favouriteGenre} = useLoggedUser()
  const [lastGenre, setLastGenre] = useState('')
  const [genre, setGenre] = useState(
    recommended
    ? favouriteGenre
    : lastGenre
  )
  const genres = useQuery(ALL_GENRES)
  const query = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  })

  useEffect(() => {
    setGenre(
      recommended
      ? favouriteGenre
      : lastGenre
    )
  }, [recommended])
  useEffect(() => {
    setLastGenre(
      recommended
      ? lastGenre
      : genre
    )
  }, [genre])

  console.log(query)

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
            {
              !genres.loading &&
              genres.data.allGenres.value.map(g =>
                <MenuItem
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
                  <TableCell>{a.author.name}</TableCell>
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
