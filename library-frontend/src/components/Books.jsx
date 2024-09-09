import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../controllers/queries'
// MUI
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import TableMock from './Skeletons/TableMock'

const Books = () => {
  const query = useQuery(ALL_BOOKS)

  return (
    <Box>
      <Typography
        component='h1'
        variant='h2'
      >
        Books
      </Typography>
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
