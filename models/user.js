const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, '`name: string` is required.']
  },
  title: {
    type: String,
    enum: {
      values: ['client', 'librarian'],
      message: '{VALUE} is not supported, it can be only `client` or `librarian`.'
    }
  },
  assignedBooks: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const User = mongoose.model('User', UserSchema)

exports.UserSchema = UserSchema
exports.User = User
