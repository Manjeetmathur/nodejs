import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../model/tweetModel.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });
  return res.status(200).json(new ApiResponse(200, { tweet }));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const tweet = await Tweet.find({ owner: userId });
  if (!tweet.length) {
    throw new ApiError(408, "user have no tweets yet");
  }
  return res.status(200).json(new ApiResponse(200, { tweet }, "All tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content ,tweetId} = req.body;

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content :content ,
      },
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse({ updatedTweet }));
});

const deleteTweet = asyncHandler(async(req,res) => {

       const {tweetId} = req.body
       const tweet = await Tweet.findById(tweetId)
       if(!tweet){
              throw new ApiError("Invalid Id...")
       }
       await Tweet.findByIdAndDelete(tweetId)

       return res
       .status(200)
       .json(new ApiResponse("Tweet deleted successfully..."))
})

export { createTweet, getUserTweets, updateTweet ,deleteTweet };
