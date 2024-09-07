import useStore from '../controllers/store'
import { useEffect } from 'react'
import {
  Alert,
  AlertTitle,
  Snackbar,
} from '@mui/material'

const Message = () => {
  const { message, openMessage, closeMessage, severityMessage } = useStore()

  useEffect(
    () => {
      if (openMessage) setTimeout(closeMessage, 10000)
    }, [openMessage])
  return (
    <Snackbar open={openMessage}>
      <Alert onClose={closeMessage} severity={severityMessage}>
        <AlertTitle
          sx={{
            textTransform: 'capitalize'
          }}
        >{severityMessage}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Message