const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autopopulate = require('mongoose-autopopulate')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    //unique: true, // I'll set a combination of title + author
    minlength: 5
  },
  published: {
    type: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    autopopulate: true
  },
  genres: [
    { type: String }
  ]
})

schema.index({ title: 1, author: 1 }, { unique: true })

schema.plugin(uniqueValidator)
schema.plugin(autopopulate)

module.exports = mongoose.model('Book', schema)