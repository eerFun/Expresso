const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('<h2>I\'m Alive!</h2>')
})

module.exports = router
