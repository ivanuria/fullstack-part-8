import { createTheme } from "@mui/material"
import '@fontsource/nanum-gothic'
import '@fontsource/mynerve'

let theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: 'hsl(280, 50%, 75%)'
        },
        secondary: {
          main : 'hsl(73, 50%, 75%)'
        },
        tonalOffset: 0.45,
      },
    },
    light: {
      palette: {
        primary: {
          main: 'hsl(280, 50%, 45%)'
        },
        secondary: {
          main : 'hsl(73, 50%, 45%)'
        },
        tonalOffset: 0.45,
      }
    }
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
                color: 'var(--mui-palette-primary-main)'
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