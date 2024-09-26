import mongoose,{Schema} from "mongoose";

const tweetSchema = mongoose.Schema(
       {
              conten : {
                     type : String,
                     required : true,
              },
              owner :{ 
                     type : Schema.type.ObjectId,
                     ref : "user"
              }
       },
       {
              timestamps : true,
       }

)

export const Tweet = mongoose.model("Tweet",tweetSchema) 