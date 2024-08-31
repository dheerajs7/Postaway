import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"

export const verifyJWT= async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        
        if(!token){
            res.json({status:401, message:"unauthorized req"}) 
        }

     const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")

     if (!user) {

        throw new ApiError(401,"Invalid access token")
        
     }

     req.user =user;
     next();
    }catch(err){
        throw new ApiError(401, err?.message || "Invalid Access")
    }
  
}