import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LOGIN } from "../controllers/queries"
import { useMutation } from "@apollo/client"
import useStore from "../controllers/useStore"
import useLoggedUser from "../utils/useLoggedUser"
//MUI
import {
  Button,
  Grid2,
  Paper,
  TextField,
  Typography,
} from '@mui/material'


const Login = ({}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setError, setSuccess } = useStore()
  const navigate = useNavigate()
  const { name, saveLogin } = useLoggedUser()

  console.log('name', name)
  const [login, result] = useMutation(LOGIN, {
    onError: error => {
      setError(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      saveLogin(data.login)
      setUsername('')
      setPassword('')
      setSuccess('Correctly logged in')
    }
  })

  useEffect(() => {
    if (name) navigate('/')
  }, [name])

  const submit = event => {
    event.preventDefault()
    login({ variables: { username, password }})
  }

  return (
    <>
      <Typography
        variant='h2'
        component='h1'
        textAlign='center'
      >Login</Typography>
      <Paper
        component='form'
        sx={{
          padding: '2rem',
          maxWidth: 600,
          marginInline: 'auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid2
          container
          spacing={3}
        >
          <TextField
            label='Username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            label='Password'
            value={password}
            type='password'
            onChange={({ target }) => setPassword(target.value)}
          />
          <Grid2
            size={12}
            display='flex'
            sx={{
              justifyContent: 'center'
            }}
          >
          <Button
            onClick={submit}
            variant='contained'
          >Login</Button>
          </Grid2>
        </Grid2>
      </Paper>
    </>
  )
}

export default Login