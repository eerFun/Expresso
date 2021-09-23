/* eslint-disable no-throw-literal */
const express = require('express')
const router = express.Router()
const usersRouter = require('./api/users')
const booksRouter = require('./api/books')

router.use('/users', usersRouter)
router.use('/books', booksRouter)

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
