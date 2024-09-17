const jwt = require('jsonwebtoken')
const jwtAutMiddleware= (req,res,next) => {
       const token = req.headers.authorization.split(' ')[1]
       if(!token){
              return res.status(401).json({error : 'Unauthorized'});
       }
       try{
              const decoded = jwt.verify(token,process.env.JWT_SECRET)
              
       }catch(error){
              console.error(error)
              res.status(401).json({error : 'Invalid token'});
       }

}

const generateToken = (userData) => {
       return jwt.sign(userData,process.env.JWT_SECRET);
}

module.exports = {jwtAutMiddleware,generateToken};