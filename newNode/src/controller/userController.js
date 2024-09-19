import  {asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../model/userModel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshToken = async(userId) => {
       try {
              const user = await User.findById(userId)
              
              const accessToken = user.generateAccessToken()
              // console.log("Acess Token : " , accessToken);
              
              const refreshToken = user.generateRefreshToken()
              
              // console.log(" refreshToken : " , refreshToken);
              
              user.refreshToken = refreshToken
              await user.save({validateBeforeSave : false})

              // console.log("refreshToken now : " ,refreshToken);
              
              return {refreshToken,accessToken}
              

       } catch (error) {
              throw new ApiError(500,"Something went wrong while generating access and refresh token ...", error)
       }
}

const registerUser = asyncHandler(async(req,res) => {

       const  {fullName,email,userName, password} = req.body
       
       if([fullName,email,userName,password].some((field) => field?.trim() === "")){
              throw new ApiError(400,"All fields are required")
       }

       const existedUser = await User.findOne({
            $or: [{userName},{email}] 
       })
       
       if(existedUser){
              throw new ApiError(409 , "user or email already exist ... ")
       }
       
       const avatarLocalPath =  req.files?.avatar[0]?.path;
       //const coverImageLocalPath =  req.files?.coverImage[0]?.path;

       let coverImageLocalPath;
       if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
              coverImageLocalPath = req.files.coverImage[0].path
       }
       console.log("coverImageLocalPath : ",coverImageLocalPath);
       
       if(!avatarLocalPath){
              throw new ApiError(400,"Avatar file is required")
       }
       const avatar = await uploadOnCloudinary(avatarLocalPath) 
       if(!avatar){
              throw new ApiError(400,"Avatar file is required")
       }
       const coverImage = await uploadOnCloudinary(coverImageLocalPath)
      

       const user = await User.create({
              fullName,
              avatar : avatar.url,
              coverImage : coverImage?.url || "",
              email,
              password,
              userName
       })
       res.status(200).json({user})
       console.log(user);
       
       const createdUser = await User.findById(user._id).select(
              "  -refreshToken -password"
       )

       if(!createdUser){
              throw new ApiError(500, " Something went wrong while requesting the user");
       }
})


const loginUser = asyncHandler(async(req,res) => {

       const {email,userName,password} = req.body
       // console.log("User Name " , userName, "email : ", email);
       
       if(!(userName || email)){
              throw new ApiError(400,"userName or email is required...")
       }

       const user = await User.findOne({
              $or : [{userName},{email}]
       })

       if(!user){
              throw new ApiError(404,"user doesn't exist...")
       }

       const isPasswordValid =  await user.isPasswordCorrect(password)

       if(!isPasswordValid){
              throw new ApiError(401,"Inavlid user credentials...")
       }

       const { refreshToken ,accessToken} = await generateAccessAndRefreshToken(user._id)
       
       const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
       
       const options = {
              httpOnly : true,
              secure : true
       }

       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
              new ApiResponse(
                     200,
                     {
                            user : loggedInUser , accessToken, refreshToken
                     },
                     "User logged in Successfully..."
              )
       )


})

const logoutUser = asyncHandler(async(req,res) => {
       await User.findByIdAndUpdate(
              req.user._id,
              {
                     $set : {
                            refreshToken : undefined
                     }
              },
              {
                     new : true
              },
             
       )
       const options = {
              httpOnly : true,
              secure : true
       }

       return  res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse(200, "", " user logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res) => {

       const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

       try {
              
              if(!incomingRefreshToken){
                     throw new ApiError(401,'unauthorized request');
              }
       
              const decodedToken = jwt.verify(
                     incomingRefreshToken,
                     process.env.REFRESH_TOKEN_SECRET 
              )
              
              const user =await User.findById(decodedToken?._id)
              
              if(!user){
                     throw new ApiError(401,"Invalid refresh TOken found")
              }
       
              if(incomingRefreshToken !== user?.refreshToken){
                     throw new ApiError(401,"Refresh token is expired")
              }

              const {refreshToken,accessToken } = await generateAccessAndRefreshToken(user._id)
              
              // console.log("accessToken : ",accessToken);
              // console.log("newRefreshToken : ",refreshToken);
              
              const options = {
                     httpOnly : true,
                     secure : true,
              }
              
       
              return res
              .status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(
                     new ApiResponse(
                            200,
                            {accessToken, refreshToken},
                            "Access token refreshed"
                     )
              )
       
       } catch (error) {
              throw new ApiError(401, "invalid refresh Token here")
       }



})




export {registerUser,loginUser,logoutUser,refreshAccessToken}

