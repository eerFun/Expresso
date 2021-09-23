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
  ac.isAuthorizedOn(['superadmin', 'librarian']),
  body('name').exists().isString(),
  body('description').optional().isString().trim(),
  body('author').exists().isString(),
  body('numberOfBooksInLibrary').optional().default(1).isInt({ min: 0 }),
  validator.result,
  async (req, res, next) => {
    try {
      let book = new Book({
        name: req.body.name,
        description: req.body.description,
        author: req.body.author,
        numberOfBooksInLibrary: req.body.numberOfBooksInLibrary
      })
      book = await book.save()

      return res.status(201).json({
        book: tools.toCleanObject(book.toObject()),
        msgFa: 'کتاب با موفقیت ایجاد شد',
        msgEn: 'The book was created successfully'
      })
    } catch (error) {
      next(error)
    }
  })

router.get('/:id',
  ac.isAuthorizedOn(['superadmin', 'librarian']),
  param('id').isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      const bookObj = await Book.findById(req.params.id, '-__v').lean().exec()
      if (!bookObj) {
        throw { status: 404, msgFa: 'کتاب یافت نشد', msgEn: 'Book not found' }
      }

      return res.json({
        book: bookObj
      })
    } catch (error) {
      next(error)
    }
  })

router.get('/',
  ac.isAuthorizedOn(['superadmin', 'librarian', 'client']),
  async (req, res, next) => {
    try {
      const queryObj = {}
      if (req.user.role === 'client') {
        const user = await User.findById(req.user._id).lean().exec()
        if (!user) {
          throw { status: 404, msgFa: 'کاربر یافت نشد', msgEn: 'User not found' }
        }
        queryObj._id.$in = user.assignedBookList
      }

      const size = +req.query.size || CONFIG.pageSize
      const page = +req.query.page || 1
      const sort = req.query.sort || '-createdAt'
      const bookListObj = await Book.find(queryObj, '-__v').lean()
        .sort(sort).skip((page - 1) * size).limit(size).exec()
      const totalCount = await Book.countDocuments(queryObj).exec()

      return res.json({
        bookList: bookListObj,
        totalCount: totalCount
      })
    } catch (error) {
      next(error)
    }
  })

router.put('/:id',
  ac.isAuthorizedOn(['superadmin', 'librarian']),
  param('id').isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.id).exec()
      if (!book) {
        throw { status: 404, msgFa: 'کتاب یافت نشد', msgEn: 'Book not found' }
      }

      const filteredBody = _pick(req.body, AC_CONFIG[req.user.role].updateAnyBook)
      book.set(filteredBody)
      const newBook = await book.save()

      return res.json({
        book: tools.toCleanObject(newBook.toObject(), ['__v']),
        msgFa: 'اطلاعات کتاب با موفقیت تغییر کرد',
        msgEn: 'The book info was successfully updated'
      })
    } catch (error) {
      next(error)
    }
  })

router.delete('/:id',
  ac.isAuthorizedOn(['superadmin', 'librarian']),
  param('id').isMongoId(),
  validator.result,
  async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.id).exec()
      if (!book) {
        throw { status: 404, msgFa: 'کتاب یافت نشد', msgEn: 'Book not found' }
      }

      await book.remove()

      return res.json({
        msgFa: 'کتاب با موفقیت حذف شد',
        msgEn: 'The book was successfully deleted'
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = router
