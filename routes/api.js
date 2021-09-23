/* eslint-disable no-throw-literal */
const express = require('express')
const router = express.Router()
const auth = require('../middleware/authenticate')
const usersRouter = require('./api/users')
const booksRouter = require('./api/books')

router.use('/users', auth.authenticate, usersRouter)
router.use('/books', auth.authenticate, booksRouter)

//* ******************************************************************************
//  Ping API
//* ******************************************************************************
router.post('/ping', async (req, res, next) => {
  try {
    return res.json({ msgFa: 'بله!', msgEn: 'pong!' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
