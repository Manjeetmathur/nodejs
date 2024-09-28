import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Video} from "../model/videoModel.js"
import { Subscription } from "../model/subcriptionModel.js";
import { Like } from "../model/likeModel.js";

const getChannelStates = asyncHandler(async(req,res) => {
       //get the channel states
       //all video, videos views, total subscribers,
       //total videos, total likes

       const videos = await Video.aggregate([
              {
                     $match : {
                            owner : new mongoose.Types.ObjectId(req.user?._id)
                     }
              },
              {
                     $group : {
                            _id : "$views",
                            totalViews : {
                                   $sum : "$views,"
                            },
                            totalVideos : {$sum : 1}
                     }
              },
              {
                     $project : {
                            _id : 0,
                            totalVideos : 1,
                            totalViews : 1
                     }
              }
       ])

       const totalSubscriber = await Subscription.aggregate([
              {
                     $match : {
                            channel : req.user?._id
                     }
              },
              {
                     $group : {
                            _id : null,
                            totalSubscribers : {$sum : 1}
                     }
              },
              {
                     $project : {
                            _id : 0,
                            totalSubscribers : 1
                     }
              }
       ])

       const likes = await Like.aggregate([
              {
                     $lookup : {
                            from : "videos",
                            localField : "video",
                            foreignField : "_id",
                            as : "likedVideo"
                     }
              },
              {
                     $lookup : {
                            from : "tweets",
                            localField : "tweet",
                            foreignField : "_id",
                            as : "likedTweet"
                     }
              },
              {
                     $lookup : {
                            from : "comments",
                            localField : "comment",
                            foreignField : "_id",
                            as : "likedComment"
                     }
              },
              {
                     $match : {
                            $or : [
                                   { "likedVideo.owner" : req.user?._id },
                                   { "likedTweet.owner" : req.user?._id },
                                   { "likedComment.owner" : req.user?._id },
                            ]
                     }
              },
              {
                     $group : {
                            _id : null,
                            totalLikes : {$sum : 1}
                     }
              },
              {
                     $project : {
                            _id : 0,
                            totalLikes : 1
                     }
              }

       ])

       const allStates = {
              views : videos[0].totalViews,
              videos : videos[0].totalVideos,
              totalSubscriber : totalSubscriber[0].totalSubscribers,
              totalLikes : likes[0].totalLikes,

       }

       return res
       .status(200)
       .json(new ApiResponse(200,"channel states fecthed ...",{allStates}))
       
})

const getChannelVideos = asyncHandler(async(req,res) => {
       const video = await Video.aggregate([
              {
                     $match :{
                           owner : new mongoose.Types.ObjectId(req.user?._id)
                     } 
              },
              {
                     $project : {
                            videoFile : 1,
                            thumbnail : 1,
                            title : 1,
                            duration : 1,
                            views : 1,
                            desceiption : 1,
                            isPublished : 1,
                            owner : 1,
                            createdAt:1,
                            updatedAt : 1

                     }
              }
       ])
       return res
       .status(200)
       .json(new ApiResponse(200,"videos",{video}))
})

export {getChannelStates,getChannelVideos}