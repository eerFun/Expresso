/* eslint-disable no-throw-literal */
const express = require('express')
const router = express.Router()
const { body, param } = require('express-validator')
const _pick = require('object.pick')
const ac = require('../../middleware/access-controller')
const validator = require('../../middleware/validator')
const { User } = require('../../models/user')
const { Book } = require('../../models/book')
const tools = require('../../tools/tools')
const CONFIG = require('../../config/config')
const AC_CONFIG = require('../../config/access-controller')

router.post('/',
  ac.isAuthorizedOn(['superadmin']),
  body('name').exists().isString(),
  body('password').exists().isStrongPassword(),
  body('role').exists().isString().isIn(['client', 'librarian']),
  validator.result,
  async (req, res, next) => {
    try {
      let user = new User({
        name: req.body.name,
        role: req.body.role,
        password: req.body.password
      })
      user = await user.save()

      return res.status(201).json({
        user: tools.toCleanObject(user.toObject()),
        msgFa: 'کاربر با موفقیت ایجاد شد',
        msgEn: 'The user was created successfully'
      })
    } catch (error) {
      next(error)
    }
  })

router.get('/:id',
  ac.isAuthorizedOn(['superadmin']),
  param('id').isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      const userObj = await User.findById(req.params.id, '-__v').lean().exec()
      if (!userObj) {
        throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
      }

      return res.json({
        user: userObj
      })
    } catch (error) {
      next(error)
    }
  })

router.get('/',
  ac.isAuthorizedOn(['superadmin']),
  async (req, res, next) => {
    try {
      const queryObj = {}
      const size = +req.query.size || CONFIG.pageSize
      const page = +req.query.page || 1
      const sort = req.query.sort || '-createdAt'
      const userListObj = await User.find(queryObj, '-__v').lean()
        .sort(sort).skip((page - 1) * size).limit(size).exec()
      const totalCount = await User.countDocuments(queryObj).exec()

      return res.json({
        userList: userListObj,
        totalCount: totalCount
      })
    } catch (error) {
      next(error)
    }
  })

router.put('/:id/assign-book',
  ac.isAuthorizedOn(['superadmin']),
  param('id').isMongoId(),
  body('bookId').exists().isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      let user = await User.findById(req.params.id).exec()
      if (!user) {
        throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
      }
      let book = await Book.findById(req.body.bookId).exec()
      if (!book) {
        throw { status: 404, msgFa: 'کتاب یافت نشد', msgEn: 'Book not found' }
      }

      if (book.numberOfBooksInLibrary <= 0) {
        throw { status: 409, msgFa: 'کتابی جهت واگذاری در کتابخانه موجود نیست', msgEn: 'There is no book to assign in the library' }
      }

      book.numberOfBooksInLibrary--
      book = await book.save()
      user.assignedBookList.push(book._id)
      user = await user.save()

      return res.json({
        user: tools.toCleanObject(user.toObject(), ['__v']),
        msgFa: 'کتاب با موفقیت به کاربر تخصیص یافت',
        msgEn: 'The book was successfully assigned to the user'
      })
    } catch (error) {
      next(error)
    }
  })

router.put('/:id/restore-book',
  ac.isAuthorizedOn(['superadmin']),
  param('id').isMongoId(),
  body('bookId').exists().isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      let user = await User.findById(req.params.id).exec()
      if (!user) {
        throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
      }
      let book = await Book.findById(req.body.bookId).exec()
      if (!book) {
        throw { status: 404, msgFa: 'کتاب یافت نشد', msgEn: 'Book not found' }
      }

      if (!user.assignedBookList.includes(book._id)) {
        throw { status: 409, msgFa: 'چنین کتابی به این شخص واگذار نشده است', msgEn: 'The book has not been assigned to this person' }
      }

      book.numberOfBooksInLibrary++
      book = await book.save()
      user.assignedBookList = tools.deleteFromArray(book._id, user.assignedBookList)
      user = await user.save()

      return res.json({
        user: tools.toCleanObject(user.toObject(), ['__v']),
        msgFa: 'اطلاعات کاربر با موفقیت تغییر کرد',
        msgEn: 'The user info was successfully updated'
      })
    } catch (error) {
      next(error)
    }
  })

router.put('/:id',
  ac.isAuthorizedOn(['superadmin']),
  param('id').isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).exec()
      if (!user) {
        throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
      }

      const filteredBody = _pick(req.body, AC_CONFIG[req.user.role].updateAnyUser)
      user.set(filteredBody)
      const newUser = await user.save()

      return res.json({
        user: tools.toCleanObject(newUser.toObject(), ['__v']),
        msgFa: 'اطلاعات کاربر با موفقیت تغییر کرد',
        msgEn: 'The user info was successfully updated'
      })
    } catch (error) {
      next(error)
    }
  })

router.delete('/:id',
  ac.isAuthorizedOn(['superadmin']),
  param('id').isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).exec()
      if (!user) {
        throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
      }

      await user.remove()

      return res.json({
        msgFa: 'کاربر با موفقیت حذف شد',
        msgEn: 'The user was successfully deleted'
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = router
