import mongoose,{Schema} from "mongoose";

const likeSchema = mongoose.Schema(
       {
              video :{
                     type : Schema.type.ObjectId,
                     ref : "Video"
              },
              Comment : {
                     type : Schema.type.ObjectId,
                     ref : "Comment"
              },
              tweet : {
                     type : Schema.type.ObjectId,
                     ref : "Tweet"
              },
              likedBy :{ 
                     type : Schema.type.ObjectId,
                     ref : "User"
              },

       },
       {      
              timestamps : true
       }
)

export const Like = mongoose.model("Like",likeSchema);