const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CONFIG = require('../config/config')

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: CONFIG.sessionExpire
  }
})

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)

exports.RefreshTokenSchema = RefreshTokenSchema
exports.RefreshToken = RefreshToken
