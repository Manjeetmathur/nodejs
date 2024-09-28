import {asyncHandler} from "../utils/asyncHandler.js"
import { Comment } from "../model/commentModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addComment = asyncHandler(async(req,res) => {
       const { content ,videoId } = req.body
       const comment = await Comment.create({
              content,
              video : videoId,
              owner : req.user?._id 
       })

       return res
       .status(200)
       .json(
              new ApiResponse(200,{comment},"comment added successfully")
       )

})
const updateComment = asyncHandler(async(req,res) => {
       const { content ,commentId } = req.body
       const comment = await Comment.findByIdAndUpdate(
              commentId,
            {
              $set:{
                     content:content,
                     
              }
            },
            {new:true}
       )

       return res
       .status(200)
       .json(
              new ApiResponse(200,{comment},"comment added successfully")
       )

})
const deleteComment = asyncHandler(async(req,res) => {
       const { commentId } = req.body
       await Comment.findByIdAndDelete(commentId)

       return res
       .status(200)
       .json(
              new ApiResponse(200,"comment deleted successfully")
       )

})

const getVideoComments = asyncHandler(async(req,res) => {
       const { videoId } = req.body
       const {page = 1, limit = 2} = req.query

       //const comment = await Comment.find({video : videoId})

       const comment = await Comment.aggregate([
              {
                     $match : {video : new mongoose.Types.ObjectId(videoId)}
              },
              {
                     $lookup : {
                            from : "videos",
                            localField : "content",
                            foreignField:"_id",
                            as : "comments"
                     },
                     $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as  : "createdBy",
                            pipeline:[
                                   {
                                          $project : {
                                                 userName : 1,
                                                 fullName : 1,
                                                 avatar : 1,
                                          }
                                   }
                            ]
                     }
              },
              {
                     $addFields : {
                            comments : {
                                   $first : "$comments"
                            },
                            createdBy : {
                                   $first : "$createdBy"
                            }
                     }
              },
              {
                     $project : {
                            content : 1,
                            createdBy :1
                     }
              },
              {
                     $skip : (page - 1) * limit
              },
              {
                     $limit : parseInt(limit)
              }
       ])

       return res
       .status(200)
       .json(
              new ApiResponse(200,comment,"comments fetched...")
       )
})

export {addComment,updateComment,deleteComment,getVideoComments}
