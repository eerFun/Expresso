/* eslint-disable no-throw-literal */
const express = require('express')
const router = express.Router()
const { body, header } = require('express-validator')
const Jwt = require('jsonwebtoken')
const validator = require('../middleware/validator')
const auth = require('../middleware/authenticate')
const { User } = require('../models/user')
const { RefreshToken } = require('../models/refreshToken')
const tools = require('../tools/tools')
const authTools = require('../tools/authenticate')
const CONFIG = require('../config/config')

router.post('/login',
  body('name').exists(),
  body('password').exists(),
  validator.result,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ name: req.body.name }).exec()
      if (!user) {
        throw { status: 401, msgFa: 'نام یا رمز عبور اشتباه است', msgEn: 'Incorrect name or password!' }
      }
      const IS_MATCH = await user.isValidPassword(req.body.password)
      if (!IS_MATCH) {
        throw { status: 401, msgFa: 'نام یا رمز عبور اشتباه است', msgEn: 'Incorrect name or password!' }
      }

      const userObj = user.toObject()
      delete userObj.password
      delete userObj.__v
      req.user = userObj

      const token = await Jwt.sign({
        user: user._id,
        createdAt: Date.now()
      }, CONFIG.secret, { expiresIn: CONFIG.sessionExpire })

      let refreshToken = new RefreshToken({
        token: token,
        user: user._id
      })

      refreshToken = await refreshToken.save()

      return res.json({
        user: tools.toCleanObject(user.toObject(), ['__v', 'password']),
        token: authTools.createAccessToken(user.toObject()),
        refreshToken: 'JWT ' + refreshToken.token,
        msgFa: 'خوش آمدید',
        msgEn: 'Welcome'
      })
    } catch (error) {
      next(error)
    }
  })

router.post('/refresh-token',
  header('jwt').exists(),
  validator.result,
  async (req, res, next) => {
    try {
      const token = req.headers.jwt.split(' ')[1]
      if (!token) {
        throw { status: 400, msgFa: 'خطا: توکن خالی است', msgEn: 'Error: Empty Token!' }
      }
      const refreshToken = await RefreshToken.findOne({ token: token }).exec()
      if (!refreshToken) {
        throw { status: 401, msgFa: 'توکن منقضی شده است! لطفا مجددا لاگین کنید', msgEn: 'Token expired! please login again' }
      }

      const user = await User.findById(refreshToken.user, '-__v -password').exec()
      if (!user) {
        throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
      }

      return res.json({
        user: tools.toCleanObject(user.toObject(), ['__v', 'password']),
        token: authTools.createAccessToken(user.toObject()),
        msgFa: 'خوش آمدید',
        msgEn: 'Welcome'
      })
    } catch (error) {
      next(error)
    }
  })

router.post('/logout',
  auth.authenticate,
  async (req, res, next) => {
    try {
      const refreshToken = await RefreshToken.findOneAndDelete({ token: req.headers.jwt.split(' ')[1] }).exec()
      if (!refreshToken) {
        throw { status: 401, msgFa: 'توکن منقضی شده است! لطفا مجددا لاگین کنید', msgEn: 'Token expired! please login again' }
      }

      return res.json({
        msgFa: 'خدا نگهدار، به امید دیدار',
        msgEn: 'Bye bye!'
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = router
