import useStore from "../controllers/useStore"

const useLoggedUser = () => {
  const {
    userName,
    userToken,
    userUsername,
    userExpires,
    setUserUsername,
    setUserName,
    setUserToken,
    setUserExpires
  } = useStore()

  const saveLogin = ({ username, name, value, expires }) => {
    setUserUsername(username)
    setUserName(name)
    setUserToken(value)
    setUserExpires(expires)
  }

  const saveLogout = () => {
    setUserUsername('')
    setUserName('')
    setUserToken('')
    setUserExpires('')
  }

  return {
    name: userName,
    token: userToken,
    username: userUsername,
    expires: userExpires,
    saveLogin,
    saveLogout
  }
}

export default useLoggedUser