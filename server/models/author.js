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
  autopopulate: { maxDepth: 1 } // n+1 problem was attended first-hand. I had a problem with depth.
})

schema.plugin(uniqueValidator)
schema.plugin(autopopulate)
schema.options.selectPopulatedPaths = false

module.exports = mongoose.model('Author', schema)