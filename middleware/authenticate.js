/* eslint-disable no-throw-literal */
const authentication = {}
const Jwt = require('jsonwebtoken')
const CONFIG = require('../config/config')

authentication.authenticate = async function (req, res, next) {
  try {
    const token = req.headers.jwt?.split(' ')[1]
    if (token) {
      Jwt.verify(token, CONFIG.secret, function (err, decode) {
        if (err) {
          throw { status: 401, msgFa: 'خطا: توکن نامعتبر', msgEn: 'Error: Invalid Token!' }
        }

        req.user = decode.user
        next()
      })
    } else {
      throw { status: 400, msgFa: 'خطا: توکن خالی است', msgEn: 'Error: Empty Token!' }
    }
  } catch (error) {
    next(error)
  }
}

module.exports = authentication
