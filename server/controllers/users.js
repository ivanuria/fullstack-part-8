const { GraphQLError } = require('graphql')
const { v4:uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const parseErrors = require('./parseErrors')

const User = require('../models/user')


const me = async (root, args, { currentUser, requireLogin }) => {
  console.log('currentUser', currentUser)
  console.log('requireLogin', requireLogin)
  requireLogin(currentUser)
  return currentUser
}

const createUser = async (root, {username, name, favouriteGenre, password}) => {
  let newUser
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    newUser = new User({
      username,
      name,
      favouriteGenre,
      passwordHash
    })
    await newUser.save()
  } catch (error) {
    parseErrors(error)
  }
  return newUser
}

const login = async (root, { username, password }) => {
  const loginUser = await User.findOne({ username })
  let passOK = !loginUser || !password
    ? false
    : bcrypt.compare(password, loginUser.passwordHash)

  if (!loginUser || !passOK) {
    throw new GraphQLError('Username or password not valid', {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: username
      }
    })
  }

  const uuidSession = uuid()
  const expires = new Date(new Date().getTime() + 3600000)
  console.log(loginUser)

  const token = jwt.sign({
    uuid: uuidSession,
    id: loginUser._id
  }, process.env.JWT_SECRET)

  loginUser.set({
    session: {
      uuid: uuidSession,
      expires
    }
  })
  await loginUser.save()

  return {
    value: token,
    expires: expires.toISOString(),
    username: loginUser.username,
    name: loginUser.name,
    genre: loginUser.favouriteGenre
  }
}

module.exports = {
  me,
  createUser,
  login
}