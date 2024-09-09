import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../controllers/queries'
import useStore from '../controllers/useStore'
// MUI
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import {
  EditOutlined as EditIcon
} from '@mui/icons-material'
import TableMock from './Skeletons/TableMock'

const SetBorn = ({ name, born }) => {
  const [newBorn, setNewBorn] = useState(born || '')
  const [focused, setFocused] = useState(false)
  const { setError, setSuccess } = useStore()

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
      onError: error => {
        const messages = error.graphQLErrors.map(e => e.message).join('\n')
        setError(messages)
      },
      onCompleted: () => {
        setFocused(false)
        setSuccess(`Born date of ${name} correctly saved to ${newBorn}`)
      },
      refetchQueries: [
        { query: ALL_AUTHORS }
      ]
    }
  )

  const onCancel = () => {
    setNewBorn(born)
    setFocused(false)
  }

  const onSave = () => {
    editAuthor({ variables: { name, setBornTo: parseInt(newBorn) } })
  }

  if (focused) {
    return (
      <TableCell
        sx={{
          display: 'flex',
          gap: '.4rem'
        }}
      >
        <TextField
          label='Edit Born'
          type='number'
          value={newBorn}
          size='small'
          sx={{
            minWidth: '12ch'
          }}
          onChange={({ target }) => setNewBorn(target.value)}
        />
        <Box
          display='flex'
          spacing={1}
        >
          <Button
            onClick={onSave}
            size='small'
          >
            Save
          </Button>
          <Button
            onClick={onCancel}
            size='small'
          >
            Cancel
          </Button>
        </Box>

      </TableCell>
    )
  }

  return (
    <TableCell
      sx={{
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={() => setFocused(true)}
    >
    {newBorn}
    <EditIcon
      sx={{
        position: 'absolute',
        top: '.8rem',
        right: '1rem'
      }}
    />
    </TableCell>
  )
}

const Authors = () => {
  const query = useQuery(ALL_AUTHORS)

  return (
    <Box>
      <Typography
        component='h1'
        variant='h2'
      >
        Authors
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: { sm: '60%' }
                }}
              ></TableCell>
              <TableCell
                sx={{
                  width: { sm: '30%' }
                }}
              >Born</TableCell>
              <TableCell
                sx={{
                  width: { sm: '10%' }
                }}
              >Books</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              query.loading
              ? <TableMock rows={5} />
              : query.data.allAuthors.map((a) => (
                <TableRow key={a.name}>
                  <TableCell>{a.name}</TableCell>
                  <SetBorn name={a.name} born={a.born} />
                  <TableCell>{a.bookCount}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Authors
