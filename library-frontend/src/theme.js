import { createTheme } from "@mui/material"
import '@fontsource/nanum-gothic'
import '@fontsource/mynerve'

let theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: 'hsl(280, 50%, 45%)'
    },
    secondary: {
      main : 'hsl(73, 50%, 45%)'
    },
    dark: {
      light: 'hsl(280, 50%, 45%)',
      main: 'hsl(280, 50%, 14.624999999999998%)',
      dark: 'hsl(280, 50%, 0%)',
      contrastText: '#fff'
    },
    tonalOffset: 0.45,
  },
  typography: {
    fontFamily: 'Nanum Gothic, sans serif',
    h1: {
      fontFamily: 'Mynerve, sans serif'
    },
    h2: {
      fontFamily: 'Mynerve, sans serif'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
          width: '100%'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'h2' },
              style: {
                marginBlock: '2rem',
                fontWeight: '700',
                color: 'var(--mui-palette-dark-main)'
              }
            }
          ]
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    }
  }
})

export default theme