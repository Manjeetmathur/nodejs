import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/userModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Subscription} from "../model/subcriptionModel.js"

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  // TODO: toggle subscription
  if (!channelId) {
    throw new ApiError("channel id is not found");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError("user is not found");
  }

  const userId = req.user?._id;
  const isExist = await Subscription.findOne({
    subscriber : userId,
    channel : channelId
  })

  if(!isExist){
    const subscriber = await Subscription.create({
      subscriber : userId,
      channel : channelId
    })

    return res.status(200).json(new ApiResponse(200,{subscriber},"Subscribed Succesfully..."));
  }
  else{
    await Subscription.findByIdAndDelete(isExist._id)
    return res.status(200).json(new ApiResponse("Unsubscribed Succesfully..."))
  }

});

// controller to return subscriber list of a channel
const getUserChannelSubscriber = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  
  const subscribers = await Subscription.find({channel : channelId}).select("fullName")
  console.log("subscribers ",subscribers);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {subscribers},
        "channel subscriber fetched successfuly..."
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  
  const userId = req.user?._id;

  const channels = await Subscription.find({subscriber : userId}).select("fullName")

  return res
  .status(200)
  .json(
    new ApiResponse(200,{channels})
  )

});

export { toggleSubscription, getSubscribedChannels, getUserChannelSubscriber };
