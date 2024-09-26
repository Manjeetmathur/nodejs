import mongoose,{Schema} from "mongoose";

const playlistSchema = mongoose.Schema(
       {
              name : {
                     type : String,
                     required :true,
              },

              description : {
                     type : String,
                     required : true,
              },
              videos : [
                     {
                            type : Schema.type.ObjectId ,
                            ref : "Video"
                     }
              ],
              owner : {
                     type : Schema.type.ObjectId,
                     ref : "User"
              }

       },
       {
              timestamps : true,
       }
)

export const PlayList = mongoose.model("Playlist",playlistSchema)