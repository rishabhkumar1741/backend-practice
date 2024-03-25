import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userschema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        default:"",
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    coverImage:{
        type:String,
        default:""
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refToken:{
        type:String,
    },
},{timestamps:true})

userschema.pre('save', async function(next){
    if(!this.isModified("password"))
    {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})
userschema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userschema.methods.generateAccessToken = function()
{
    return jwt.sign({
        id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName,
    },process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}
userschema.methods.generateRefreshToken = function(){
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}


export const User = mongoose.model("User",userschema);