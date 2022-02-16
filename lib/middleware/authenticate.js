const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

     try {
       const cookie = req.cookies[process.env.COOKIE_NAME]
       if(!cookie) {
        throw new Error('WE NEED A LIL BB COOKIE')
       } else {
         const payload = jwt.verify(cookie, process.env.JWT_SECRET)
         req.user = payload
         next()
       }
     } catch (error) {
       console.error(error)
       error.message = "You must be signed in to continue"
       error.status = 401
       next(error)
     }
}
