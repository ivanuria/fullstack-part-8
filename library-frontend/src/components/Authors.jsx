import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR, AUTHOR_EDITED } from '../controllers/queries'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../controllers/useStore'
import useLoggedUser from '../utils/useLoggedUser'
import { useSubscription } from '@apollo/client'
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
  const { name:userName, saveLogout } = useLoggedUser()
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams({ redirect: location.pathname })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: async (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      if (error.message.toLowerCase().includes('unauthorised')) {
        await saveLogout() // Although VSCode says await does not work here... it does.
        navigate(`/login?${params.toString()}`)
      }
      setError(messages)
    },
    onCompleted: () => {
      setFocused(false)
      setSuccess(`Born date of ${name} correctly saved to ${newBorn}`)
    },
    /*refetchQueries: [
      { query: ALL_AUTHORS }
    ]*/
  })

  const onCancel = () => {
    setNewBorn(born)
    setFocused(false)
  }

  const onSave = () => {
    editAuthor({ variables: { name, setBornTo: parseInt(newBorn) } })
  }

  useEffect(() => {
    setNewBorn(born)
  }, [born])

  if (!userName) {
    return (
      <TableCell
        sx={{
          position: 'relative',
          cursor: 'pointer'
        }}
      >
      {newBorn}
      </TableCell>
    )
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

  useSubscription(AUTHOR_EDITED, {
    onData: ({ data, client }) => {
      const authorEdited = data.data.authorEdited
      console.log('received', authorEdited)
      client.cache.updateQuery({ query: ALL_AUTHORS }, (store) => {
        const allAuthors = store && store.allAuthors
        console.log('allAuthors', allAuthors)
        if (allAuthors) {
          return { allAuthors: allAuthors.map(
            author =>
            author.id !== authorEdited.id
            ? author
            : authorEdited
          ) }
        }
      })
    }
  })

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
