const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
  name: {
    type: String,
    required: [true, '`name: string` is required.'],
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    required: [true, '`author: string` is required.']
  },
  numberOfBooksInLibrary: {
    type: Number,
    required: [true, '`numberOfBooksInLibrary: number` is required.'],
    default: 1,
    min: [0, '`numberOfBooksInLibrary` must be greater or equal to ZERO.'],
    validate: {
      validator: function (value) {
        return Number.isInteger(value)
      },
      message: props => `${props.value} is not an Integer number!`
    }
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

BookSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(`The input '${error.message.split('index: ')[1].split('_1')[0]}' already exists`))
  } else {
    next()
  }
})

const Book = mongoose.model('Book', BookSchema)

exports.BookSchema = BookSchema
exports.Book = Book
