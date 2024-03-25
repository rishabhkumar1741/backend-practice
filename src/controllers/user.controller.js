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
    console.log(userData);
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
        userName:userData.userName.toLowerCase(),
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
} )

const asccessTokenAndRefereshToken = async (userId)=>{
try {
    const user  = await User.findById(userId);
    if(!user)
    {
        throw new ApiError(404,"User not found");
    }
    const accessToken = await user.generateAccessToken();
    const Referencetoken = await user.generateRefreshToken();
    user.refToken = Referencetoken;
    await user.save({validateBeforeSave:false});
    return {accessToken,Referencetoken};
} catch (error) {
    throw new ApiError(500,"Token generation failed")
}

}


const loginUser  = asyncHandler(async (req,res,next)=>{
   
    // req body → data
    // check username or email is present or not
    //find the user //password check
    //access and referesh token
    //send cookie
// ----------------------------------------------------------
    // get email and password from the request body
    const {email,userName,password} = req.body;
    // check if email and password is present or not
    if(email.trim() === "" && userName.trim() === "")
    {
        throw new ApiError(400,"Email and userName are required");
    }

    // check if user is exist or not 
    const user = await User.findOne({$or:[{email},{userName}]});

    if(!user)
    {
        throw new ApiError(404,"User not found ")
    }
    //check if user is exist then check password is corrent or not 

    const isPasswordMatched = await user.isPasswordCorrect(password);
    if(!isPasswordMatched)
    {
        throw new ApiError(401,"Invalid password")
    }
    //create access token and referesh token
    const {accessToken,Referencetoken} = await asccessTokenAndRefereshToken(user._id);
    // before sending we need to get the updated user object
    const updatedUser = await User.findById(user._id).select("-password -refToken");
    //send cookie to the user
    const option = {
        httpOnly:true,
        secure: true
    }
    return res.cookie("accessToken",accessToken,option).cookie("Referencetoken",Referencetoken,option).status(200).json(new ApiRespose(200,"User logged in successfully",{user:updatedUser,accessToken,Referencetoken}))
})


const logoutUser = asyncHandler(async (req,res,next)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{$set:{refToken:undefined}},{new:true});
    
        const option = {
            httpOnly:true,
            secure:true
        }
        return res
        .status(200)
        .clearCookie("accessToken",option)
        .clearCookie("Referencetoken",option)
        .json(new ApiRespose(200,"User logged out successfully"))
    } catch (error) {
        throw new ApiError(500,"User logout failed");
    }
})
export {registerUser,loginUser,logoutUser}