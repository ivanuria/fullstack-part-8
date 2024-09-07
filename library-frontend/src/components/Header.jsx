import {
  AppBar,
  Button,
  Container,
  Toolbar
} from '@mui/material'
import {
  AutoStoriesTwoTone as Logo
} from '@mui/icons-material'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <AppBar
      position='sticky'
      color='dark'
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingInline: '0'
        }}

      > <Logo
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
          <Button
            component={Link}
            to='/'
            color='inherit'
          >
            Authors
          </Button>
          <Button
            component={Link}
            to='/books'
            color='inherit'
          >
            Books
          </Button>
          <Button
            component={Link}
            to='/books/add'
            color='inherit'
          >
            Add Book
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header