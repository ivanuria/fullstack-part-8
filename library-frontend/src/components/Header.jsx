import { useEffect } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import useLoggedUser from '../utils/useLoggedUser'
//MUI
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar
} from '@mui/material'
import { useScrollTrigger } from '@mui/material'
import { AutoStoriesTwoTone as Logo } from '@mui/icons-material'

const ConditionedButton = ({ condition=true, ...props }) => {
  if (!condition) return null
  return <Button {...props} />
}

const Header = () => {
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 90,
    target: window,
  })
  const { name, saveLogout } = useLoggedUser()
  const location = useLocation()

  const params = new URLSearchParams({  redirect: location.pathname })

  return (
    <AppBar
      position='sticky'
      elevation={0}
      color={scrollTrigger ? 'primary' : 'transparent'}
      sx={{
        backdropFilter: 'blur(10px)'
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: '0'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingInline: '0'
          }}
        >
          <Logo
            sx={{
              width: '3rem',
              height: '3rem'
            }}
          />
          <Toolbar
            variant='dense'
            sx={{
              gap: '1rem'
            }}
          >
            <ConditionedButton
              component={Link}
              to='/'
              color='inherit'
            >
              Authors
            </ConditionedButton>
            <ConditionedButton
              component={Link}
              to='/books'
              color='inherit'
            >
              Books
            </ConditionedButton>
            <ConditionedButton
              component={Link}
              to='/books/add'
              color='inherit'
              condition={name}
            >
              Add Book
            </ConditionedButton>
            <ConditionedButton
              component={Link}
              to='/books/recommended'
              color='inherit'
              condition={name}
            >
              Recommended Books
            </ConditionedButton>
          </Toolbar>
        </Box>
        <Box>
          <ConditionedButton
            component={Link}
            to={`/login?${params.toString()}`}
            color='inherit'
            condition={!name}
            variant='outlined'
          >
            Login
          </ConditionedButton>
          <ConditionedButton
            component={Link}
            onClick={saveLogout}
            color='inherit'
            condition={name}
            variant='outlined'
          >
            Logout
          </ConditionedButton>
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header