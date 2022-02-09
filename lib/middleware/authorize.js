const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    const role = req.user.role
    const secret = 'admin'
    if (role === secret) {
      next()
    } else {
      throw new Error('User does not have the necessary privileges to access this path')
    }
  } catch (error) {
    console.error(error)
    error.message = "You do not have access to view this page"
    error.status = 403
    next(error)
  }
};
