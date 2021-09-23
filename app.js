const express = require('express')
const createError = require('http-errors')
const mongoose = require('mongoose')
const logger = require('morgan')
const methodOverride = require('method-override')

// our requirements
const CONFIG = require('./config/config')
const DOMAIN = require('./config/domain')
const apiRouter = require('./routes/api')
const indexRouter = require('./routes/index')

const app = express()
app.disable('x-powered-by')
app.use(methodOverride('X-HTTP-Method-Override'))

// handle mongoose collection.ensureIndex warn
// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)

mongoose.connect(CONFIG.dbAddress, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function () {
  console.log('MongoDB connected!')
})

app.use(function (req, res, next) {
  const allowedOrigins = [DOMAIN.client]
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-HTTP-Method-Override, X-Requested-With, Content-Type, Accept, Content-Length, Authorization, Cookie, jwt')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message
  // res.locals.error = req.app.get('env') === 'development' ? err : {}

  return err.status ? res.status(err.status).json(err) : res.status(500).json({ error: err, errorMessage: err.message, msgFa: 'خطایی رخ داده!', msgEn: 'Something went wrong!' })

  // render the error page
  // res.status(err.status || 500)
  // res.render('error')
})

module.exports = app
