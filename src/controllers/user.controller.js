import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiRespose } from "../utils/ApiRespose.js";
const  registerUser = asyncHandler(async (req,res)=>{

    // get data from the user request  
    const userData = {
        userName:req.body.userName,
        fullName:req.body.fullName,
        email:req.body.email,
        password:req.body.password,
    }
    //vadidation on the data 
    if([userData.userName,userData.fullName,userData.email,userData.password].some((field)=>field?.trim() === ""))
    {
        throw new ApiError(400  ,"All fields are required") 
    }
    // check if the user already exists
    const existedUser = await User.findOne({$or:[{userName:userData.userName},{email:userData.email}]});
    if(existedUser)
    {
        throw new ApiError(409  ,"User already exists")
    }
    // check your image , check for avager 
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log(avatarLocalPath);
    const coverImageLocal = req.files?.coverImage[0]?.path
    console.log(coverImageLocal);
    if(!avatarLocalPath)
    {
        throw new ApiError(400  ,"Avatar is required")
    }
    //upload to coloudinary and get the url
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUrl = await uploadOnCloudinary(coverImageLocal);
    if(!avatarUrl)
    {
        throw new ApiError(400  ,"avatar is not uploaded")
    }
    //create user object -> create in the database
    const user = await User.create({
        fullName:userData.fullName.toLowerCase(),
        userName:userData.userName.toloverCase(),
        email:userData.email.toLowerCase(),
        password:userData.password,
        avatar:avatarUrl.url,
        coverImage:coverImageUrl?.url || ""
    })
    //remove pass and reference token field =>from the user object
    const createdUser= await User.findById(user._id).select("-password -refToken");
    if(!createdUser)
    {
        throw new ApiError(500  ,"User is not created")
    }
    //check user is creation is successful or not
    return res.status(201).json(new ApiRespose(201,"User created successfully",createdUser))
    //retun response to the user

    

    // fullName
    // avatar
    // email
    // coverImage
    // watchHistory
    // password:
    // refToken:
    res.status(200).json({
        success:true,
        message:"User created successfully",
    })
} )


export {registerUser}