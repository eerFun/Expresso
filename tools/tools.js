const tools = {}

/**
 * `PJO` means Plain JavaScript Object
 * @typedef {object} PlainObject
 */

/**
 * Clean object from redundant fields, specially developed to use cleaning `mongoose` object
 *
 * @example
 * // Use with mongoose
 * // Convert `mongoose` document by `toObject()` before pass to the function
 * doc = mongooseDoc.toObject()
 * // or use `lean()` to get `PJO` object
 * doc = Model.findOne().lean()
 * @param {PlainObject} doc - Get plain object
 * @param {string[]} filter - Delete only `__v` from `mongoose` object if leave it without value
 * that is equivalent to pass only `['__v']`
 * @returns {PlainObject}
 */
tools.toCleanObject = (doc, filter = ['__v']) => {
  filter.forEach((item) => {
    delete doc[item]
  })
  return doc
}

/**
 * Delete an specific value from a flat array and return new array
 *
 * @param {*} value
 * @param {*[]} arr
 * @returns {*[]}
 */
tools.deleteFromArray = (value, arr) => {
  const i = arr.indexOf(value)
  if (i === -1) {
    throw Error(`Not found value: Can not delete '${value}' from array: ${arr}'`)
  } else {
    arr.splice(i, 1)
    return arr
  }
}

module.exports = tools
