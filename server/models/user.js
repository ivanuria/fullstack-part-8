const { stripIgnoredCharacters } = require('graphql')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: 3,
  },
  name: {
    type: String,
    minlength: 3,
  },
  favouriteGenre: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  session: {
    uuid: {
      type: String,
    },
    expires: {
      type: Date,
    }
  }
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)