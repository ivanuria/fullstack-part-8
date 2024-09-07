const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autopopulate = require('mongoose-autopopulate')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    uniqueCaseInsensitive: true // Please
  },
  born: {
    type: Number
  }
})

schema.virtual('bookCount', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author',
  count: true,
  autopopulate: true
})

schema.plugin(uniqueValidator)
schema.plugin(autopopulate)

module.exports = mongoose.model('Author', schema)