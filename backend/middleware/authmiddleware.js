import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js"
 export const protect=(req,res,next)=>{
    const token = req.cookies.access_token

  if (!token) {
    return next(errorHandler(401, "Unauthorized"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"))
    }

    req.user = user

    next()
  })
}
export  const adminonly=(req,res,next)=>{
  const token = req.cookies.access_token

  if (!token) {
    return next(errorHandler(401, "Unauthorized"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"))
    }

    req.user = user
    console.log(req.user)

  if(req.user&&req.user.role?.toLowerCase()==="admin"){
        next()
    }
    else{
        return next(errorHandler(403,"access denied,admin only"))
    }
  })
    
}