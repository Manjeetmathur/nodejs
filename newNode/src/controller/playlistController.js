import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../model/playlistModel.js";
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "playlist created Successfully....")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist.owner.equals(req.user?._id)) {
    throw new ApiError(400, "you can not add video...");
  }

  const found = playlist.videos.filter((video) => video.toString() == videoId);

  if (found.length > 0) {
    throw new ApiError(400, "video is already added to playlist...");
  }

  const newVideo = [...playlist.videos, videoId];

  const newPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        videos: newVideo,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { newPlaylist }, "video Added successfully..."));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const playlist =await Playlist.findById(playlistId)
  const newPlaylistVideo = (playlist.videos).filter(video => video.toString() !== videoId)

  const updatePlaylistVideo = await Playlist.findByIdAndUpdate(
       playlistId,
       {
              $set : {
                     videos : newPlaylistVideo
              }
       },
       {
              new : true
       }
  )

  return res
  .status(200)
  .json(
       new ApiResponse(200,{updatePlaylistVideo},"playlist updated...")
  )


});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId, name, description } = req.body;

  const playlist = await Playlist.findByIdAndUpdate(playlistId,
       {
              $set : {
                     name : name,
                     description : description
              }
       },
       { new : true}
  )

  return res
  .status(200)
  .json(new ApiResponse(200,{playlist},"playlist updated..."))

});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.body;
       await Playlist.findByIdAndDelete(playlistId)

       return res.status(200).json(new ApiResponse(200,"playlist deleted successfully..."))

});

const getPlaylistById = asyncHandler(async (req, res) => {
       const { playlistId } = req.body;

       const playlist = await Playlist.findById(playlistId)

       return res
       .status(200)
       .json(new ApiResponse(200,"playlist fetched successfully...",{playlist}))
});
     

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const findPlaylist = await Playlist.aggregate([
       {
              $match :{
                     owner : new mongoose.Types.ObjectId(userId)
              }
       },
       {
              $lookup : {
                     from : "videos",
                     localField : "videos",
                     foreignField : "_id",
                     as : "videos",
                     pipeline : [
                            {
                                   $lookup : {
                                          from : "users",
                                          localField : "owner",
                                          foreignField : "_id",
                                          as : "owner"
                                   }
                            },
                            {
                                   $addFields : {
                                          owner : {
                                                 $first : "$owner"
                                          }
                                   }
                            },
                            {
                                   $project  : {
                                          title : 1,
                                          description : 1,
                                          thumbnail : 1,
                                          owner : {
                                                 userName : 1,
                                                 fullName : 1,
                                                 avatar : 1
                                          }
                                   }
                            }
                     ]
              },
              
       },
       {
              
              $lookup : {
                     from : "users",
                     localField : "owner",
                     foreignField : "_id",
                     as : "createdBy",
                     pipeline : [
                            {
                                   $project : {
                                          avatar :1,
                                          fullName : 1,
                                          userName : 1
                                   }
                            }
                     ]
              }
       },
       {
              $addFields : {
                     createdBy : {
                            $first : "$createdBy"
                     }
              }
       },
       {
              $project : {
                     videos : 1,
                     createdBy : 1,
                     name  : 1,
                     description : 1
              }
       }
  ])

  if(!findPlaylist){
       throw new ApiError(500,"Playlist not found...")
  }

  return res
  .status(200)
  .json(new ApiResponse(200,"playlist fetched" ,{findPlaylist}))

});


export {
  createPlaylist,
  addVideoToPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
};
