import useStore from "../controllers/useStore"

const useLoggedUser = () => {
  const {
    userName,
    userToken,
    userUsername,
    userExpires,
    userGenre,
    setUserUsername,
    setUserName,
    setUserToken,
    setUserExpires,
    setUserGenre
  } = useStore()

  const saveLogin = ({ username, name, value, expires, genre }) => {
    setUserUsername(username)
    setUserName(name)
    setUserToken(value)
    setUserExpires(expires)
    setUserGenre(genre)
  }

  const saveLogout = () => {
    setUserUsername('')
    setUserName('')
    setUserToken('')
    setUserExpires('')
    setUserGenre('')
  }

  return {
    name: userName,
    token: userToken,
    username: userUsername,
    expires: userExpires,
    favouriteGenre: userGenre,
    saveLogin,
    saveLogout
  }
}

export default useLoggedUser