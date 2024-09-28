import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../model/videoModel.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllVideo = asyncHandler(async(req,res) => {
       const {page = 1 , limit = 10 , query , sortBy , sortType} = req.query
       //get All video based on query , sort, pagination

       const videos = await Video.aggregate([
              {
                     $match : {
                            $or : [
                                   {
                                          title : {
                                                 $regex : query,
                                                 $options : "i"
                                          },
                                          description : {
                                                 $regex : query,
                                                 $options : "i"
                                          }
                                   }
                            ]
                     }
                     
              },
              {
                     $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "createdBy"
                     }
              },
              {
                     $unwind : "$createdBy"
              },
              {
                     $project : {
                            thumbnail: 1,
                            videoFile : 1,
                            title : 1,
                            description  :1,
                            createdBy : {
                                   fullname : 1,
                                   userName : 1,
                                   avatar : 1
                            }
                     }
              },

              {
                     $sort : {
                            [sortBy] : sortType === "asc" ? 1 : -1
                     }
              }, 
              {
                     $skip : (page-1)*limit
              },
              {
                     $limit : parseInt(limit)
              }
       ])

       return res
       .status(200)
       .json(
              new ApiResponse(200,{videos},"All videos")
       )
})

const publishVideo = asyncHandler(async(req,res) => {
       const {title,description,thumbnail} = req.body
       //getVideo , upload on cloudinary , create video
       
       if([title , description,thumbnail].some((field) => field.trim() === "")){
              throw new ApiError(400,"All fields are required...")
       }
       const videoLocalPath = req.file?.path


       if(!videoLocalPath){
              throw new ApiError(400,"Vedio file is required...")
       }
       
       const videoFile = await uploadOnCloudinary(videoLocalPath)

       
       if(!videoFile){
              throw new ApiError(400,"Video is required...")
       }

       const video =await Video.create({
              videoFile : videoFile.url,
              title,
              description,
              thumbnail,
              duration : videoFile.duration,
              owner : req.user?._id
       })

       if(!video){
              throw new ApiError(400,"Error while uplaoding...")
       }
       const public_id = videoFile.public_id;
       
       return res.status(200).json(
              new ApiResponse(200,{video,public_id},"Video uploaded Successfully...")
       );

})

const getVideoByID = asyncHandler(async(req,res) => {
      
       const {videoId} = req.body
       const video = await Video.findById(videoId)
       
       if(!video){
              throw new ApiError("video is not found")
       }
       return res.status(200).json(
              new ApiResponse(200,video,"Video fetched...")
       )

})

const updateVideo = asyncHandler(async(req,res) => {
      
       
       const {videoId,title,description,thumbnail}=req.body

       const video =await Video.findById(videoId)

       if(!video){
              throw new ApiError(400,"video not found...");
       }

       const videoFilePath = req.file?.path

       if(!videoFilePath){
              throw new ApiError(400,"video file path is not found...");
       }

       const updatedVideo = await uploadOnCloudinary(videoFilePath)
       

       if(!updatedVideo){
              throw new ApiError(400,"video file is missing...")
       }

       const videoUpdate = await Video.findByIdAndUpdate(
              videoId,
              {
                     $set:{
                            title,
                            description,
                            thumbnail,
                            videoFile : updatedVideo.url
                     }
              },
              {new : true}
       )

       return res
       .status(200)
       .json(
              new ApiResponse(200,videoUpdate,"Video is updated")
       )
       
})

const deleteVideo = asyncHandler(async(req,res) => {
       const { publicId,videoId } = req.body
       
       if(!publicId){
              throw new ApiError(400,"video file is missing...")
       }

       const video =  await Video.findByIdAndDelete(videoId)

       if(!video){
              throw new ApiError(400,"Invalid video iD")
       }
       await deleteOnCloudinary(publicId)
     
       return res
       .status(200)
       .json(
              new ApiResponse(200,"Video is deleted....")
       )
})

const togglePublishStatus = asyncHandler(async(req,res) => {
       
       const {videoId} = req.body
       const video = await Video.findById(videoId)

       video.isPublished = !video.isPublished

       await video.save();

       return res
       .status(200)
       .json(new ApiResponse(`video is now ${video.isPublished ? 'published' : "unpublished"} `))

})

export {
       getAllVideo,
       publishVideo,
       deleteVideo,
       updateVideo,
       togglePublishStatus,
       getVideoByID,
}