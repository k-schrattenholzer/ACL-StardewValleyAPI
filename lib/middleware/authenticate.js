// thought that it was not returning cookie
// posted fake user to /users/register
// then posted that username/pw to users/sessions
// received a successful sign in message, and a COOKIE
// WE HAVE A COOKIE 

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

     try {
       const cookie = req.cookies[process.env.COOKIE_NAME]
        console.log(cookie)
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
