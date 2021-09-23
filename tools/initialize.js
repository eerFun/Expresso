const { User } = require('../models/user')
const CONFIG = require('../config/config')

module.exports = async () => {
  try {
    let superAdmin = await User.findOne({ title: 'superadmin' }).lean().exec()

    if (!superAdmin) {
      superAdmin = new User({
        name: 'super admin',
        title: 'superadmin',
        password: CONFIG.superAdminPassword
      })
      await superAdmin.save()
      console.log('superadmin created!')
    } else {
      console.log('superadmin has already created.')
    }
  } catch (err) {
    console.log('Initialization Error: ' + err)
    process.exit(1)
  }
}
