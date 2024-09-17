import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"



const VideoSchema = new Schema({
       videoFile :{
              trype : String,
              required : true,
       },
       thumbnail :{
              trype : String,
              required : true,
       },
       title :{
              trype : String,
              required : true,
       },
       description :{
              trype : String,
              required : true,
       },
       views :{
              trype : Number,
              default : 0
       },
       duration :{
              trype : Number,
              required : true,
       },
       isPublished :{
              trype : Boolean,
              default : true
       },
       owner :{
              trype : Schema.Types.ObjectId,
              ref : "User"
       },
},{timestamps: true})

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("video",VideoSchema)