/* eslint-disable no-throw-literal */
const accessController = {}

accessController.isAuthorizedOn = function (roleList) {
  return (req, res, next) => {
    try {
      if (!roleList.includes(req.user.role)) {
        throw { status: 403, msg: 'Role access has denied!' }
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = accessController
