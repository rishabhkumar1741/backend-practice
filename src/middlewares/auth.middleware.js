import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req,res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:"token is required"
            });
        }
    
        try {
            const decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded?.id).select("-password -refToken");
            if(!user)
            {
                return res.status(404).json({
                  success:false,
                  message:"token is expired or invalid"
                });
            }
            req.user = user;
        } catch (error) {
            return res.status(404).json({
                success:false,
                message:"token is expired or invalid"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
});