const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const { bcryptSaltRound } = require('../config/config')

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, '`name: string` is required.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, '`password: string` is required.']
  },
  role: {
    type: String,
    enum: {
      values: ['superadmin', 'client', 'librarian'],
      message: '{VALUE} is not supported, it can be only `client` or `librarian`.'
    },
    required: [true, '`role: enum[\'client\', \'librarian\']` is required.'],
    immutable: [true, '`role` can not be changed.']
  },
  assignedBookList: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

UserSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password') /* || user.isNew */) {
    try {
      user.password = bcrypt.hashSync(user.password, bcryptSaltRound)
      next()
    } catch (err) {
      return next(err)
    }
  } else { next() }
})

UserSchema.post('save', function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error(`The input '${error.message.split('index: ')[1].split('_1')[0]}' already exists`))
  } else {
    next()
  }
})

UserSchema.methods.isValidPassword = function (psswrd) {
  return bcrypt.compareSync(psswrd, this.password)
}

const User = mongoose.model('User', UserSchema)

exports.UserSchema = UserSchema
exports.User = User
