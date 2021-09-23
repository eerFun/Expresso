/* eslint-disable no-throw-literal */
const validator = {}
const { validationResult } = require('express-validator')

validator.result = (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw { status: 400, msgFa: 'خطای اعتبارسنجی در ورودی!', msgEn: 'Input validation error!', errors: errors.array() }
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = validator
