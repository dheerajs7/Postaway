import mongoose from "mongoose";
import { User } from "./user.model.js";

const postSchema = new mongoose.Schema({
  
    image:{
        public_id:String,
        url:String
    },
    caption:{
        type:String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User
    },
    like:[{
       user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User
       }
    }],
    comment:[{
        user:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
        },
        comment:{
            type:String,
            required:true
     }}]

})

export const Post = mongoose.model('Post',postSchema)