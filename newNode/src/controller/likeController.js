import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../model/likeModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  const isVideoLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (!isVideoLiked) {
    const videoLike = await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { videoLike }, "video liked"));
  } else {
    await Like.findByIdAndDelete(isVideoLiked._id);
    return res.status(200).json(new ApiResponse(200, "video unliked"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  const isCommentLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (!isCommentLiked) {
    const videoLike = await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { videoLike }, "comment liked"));
  } else {
    await Like.findByIdAndDelete(isCommentLiked._id);
    return res.status(200).json(new ApiResponse(200, "comment unliked"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.body;

  const isTweetLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (!isTweetLiked) {
    const tweetLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { tweetLike }, "tweet liked"));
  } else {
    await Like.findByIdAndDelete(isTweetLiked._id);
    return res.status(200).json(new ApiResponse(200, "tweet unliked"));
  }
});

const getAllLikedVideos = asyncHandler(async (req, res) => {
  // const {videoId} = req.body

  // const videos = await Like.find({likedBy : req.user?._id,})
  const video = await Like.aggregate([
    {
      $match: { likedBy:new mongoose.Types.ObjectId(req.user?._id) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo",
        pipeline: [
          {
            $lookup: {
              from : "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            },
          },
          {
              $project : {
                     title : 1,
                     owner : {
                            $arrayElemAt : ["$owner",0]
                     }
              }
          },
          {
              $project: {
                "owner.fullName":1,
                title : 1 
              },
            },
        ],
      },
    },
    {
       $unwind : "$likedVideo"
    }
    
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "videos fetched..."));
});

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getAllLikedVideos,
};
