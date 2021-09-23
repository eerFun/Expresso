const { User } = require('../models/user')
const CONFIG = require('../config/config')

module.exports = async () => {
  try {
    let superAdmin = await User.findOne({ role: 'superadmin' }).lean().exec()

    if (!superAdmin) {
      superAdmin = new User({
        name: 'super admin',
        role: 'superadmin',
        password: CONFIG.superAdminPassword
      })
      await superAdmin.save()
      console.log('superadmin created!')
    } else {
      console.log('superadmin has already created.')
    }
  } catch (error) {
    console.log('Initialization Error: ' + error)
    process.exit(1)
  }
}
