/* eslint-disable no-throw-literal */
const express = require('express')
const router = express.Router()
const authRouter = require('./api/auth')
const dashboardRouter = require('./api/dashboard')
const auth = require('../tools/auth')

/*****************************************************
 ********************* Auth APIs *********************
 *****************************************************/

router.use('/auth', authRouter)

/*****************************************************
  ******************* Dashboard APIs ******************
  *****************************************************/

router.use('/dashboard', auth.authenticate, dashboardRouter)

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
