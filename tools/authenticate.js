const auth = {}
const Jwt = require('jsonwebtoken')
const CONFIG = require('../config/config')

auth.createAccessToken = (user) => {
  delete user.__v
  delete user.password
  return 'JWT ' + Jwt.sign({
    user,
    createdAt: Date.now()
  }, CONFIG.secret, { expiresIn: CONFIG.accessTokenExpire })
}

module.exports = auth
