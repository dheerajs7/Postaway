import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        otp:{
            type:String,
            required:true,
            },
        timestamp:{
            type:Date,
            default:Date.now,

        }
    }
)

export const OTP = mongoose.model("OTP",otpSchema)