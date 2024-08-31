import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import nodemailer from 'nodemailer'
 
  const generateAccessAndRefreshTokens =async(userId)=>{
  try{
    const user = await User.findById(userId);
   const accessToken= user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   user.refreshToken=refreshToken;
   await user.save({validateBeforeSave:false})

   return{accessToken,refreshToken}
  }
  catch(err){
   throw new ApiError(500,"Something went wrong while generating access and refresh token")
}
  }
// }

   const registerUser =asyncHandler(async(req,res)=>{
    const{userName,email,gender,password}=req.body;
    const isExist=await User.findOne({email})
    if(isExist){
      throw new ApiError(409,"User already exist please login") 
  }
  
  if (password.length < 8) {
   throw new ApiError(
      400,
      "Password must be at least 8 characters",
   );
 }
   const avatarPath = req.file?`/uploads/${req.file.filename}` : null;
   
   if(!avatarPath){
    throw new ApiError(400,"Please upload an avatarPath") 
   } 
  const user = new User({
   userName,
   email,
   gender,
   password,
   avatar: avatarPath
   })
     await user.save()

     return res.status(201).json(
      new ApiResponse(200, user, "User registered successfully")
     )
   })
   

const userLogin =asyncHandler (async(req,res)=>{

      
    const {userName,email,password}=req.body;

    if(!userName && !email){
      return res.json({ status: 400, message: "Please enter username or email"})
    }
    const user=await User.findOne({
      $or:[{userName},{email}]
  })

   
    if(!user){
    return res.json({status:404, message:"Please register first"})

  }
  const isPasswordValid =await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    return res.json({status:404, message:"Please enter valid passowrd"})
    }
   const{accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

  const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

  const options ={
    httpOnly:true,
    secure:true
  }

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
   new ApiResponse(200,
    {
     user:loggedInUser,accessToken,
     refreshToken
    },
    "User logged in successfully"
   ) 
   
    
  )
 
})

const logoutUser = asyncHandler(async(req,res)=>{
 
  await User.findByIdAndUpdate(req.user._id,{
    $set :{
      refreshToken:undefined
    }
  },
{new:true}
  )
  const options ={
    httpOnly:true,
    secure:true
  }
  return res 
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200 ,{},"User logout Successfully"))
}) 


const getUser = asyncHandler(async(req,res)=>{
  
  const userId = req.params.userId;
  // await Post.find({createdBy:userId})
  console.log(userId);
  
  const user = await User.findById(userId).select("-password")

  if(!user){
    throw new ApiError(
      400,
      "user not found",
   );
  }

  return res.status(201).json
  (new ApiResponse(200,user,"User found successfully"))
  
})

const getAllUser = asyncHandler(async(req,res)=>{
  
  
  const user = await User.find().select("-password")

  if(!user){
    throw new ApiError(
      400,
      "user not found",
   );
  }

  return res.status(201).json
  (new ApiResponse(200,user,"User found successfully"))
  
})

const updateUserInfo = asyncHandler(async(req,res)=>{
  const userId = req.params.userId
  const {name,email,gender}=req.body
  const user = await User.findByIdAndUpdate(userId,{$set:{name,email,gender}},{new
    : true})
    return res.status(200).json
    (new ApiResponse(200,user,"User info updated successfully"))

})


const sendFriendRequest = asyncHandler(async (req, res) => {
      const {friendId} = req.body;

      const user = await User.findById(req.user._id);
      const friend = await User.findById(friendId);

      if (!user || !friend)
        {
          throw new ApiError(
            400,
            "user not found",
         );
        }
        // console.log(req.user._id);
        
      if (friend.pendingRequests.includes(req.user._id)) {
        user.sentRequests.pull(friendId)
        friend.pendingRequests.pull(req.user._id)


        await user.save();
        await friend.save();
         
        return res.status(201).json( 
          new ApiResponse(200 , 'Request unsent!' )
        )
      }

      

      user.sentRequests.push(friendId);
      friend.pendingRequests.push(req.user._id);

      await user.save();
      await friend.save();

      return res.status(201).json( 
        new ApiResponse(200 , 'Friend request sent' )
      )  
  } 
);
const manageFriendRequest = asyncHandler( async (req, res) => {
      const friendId = req.body.friendId;
      const action = req.body.action; // 'accept' or 'reject'

      const user = await User.findById(req.user._id);
      const friend = await User.findById(friendId);

      if (!user || !friend)
         return res.status(404).json({ message: 'User not found' });

      if (!friend.pendingRequests.includes(req.user._id)) {
          return res.status(400).json({ message: 'No pending request from this user' });
      }

      if (action === 'accept') {
          user.friends.push(friendId);
          friend.friends.push(req.user._id);
      }

      friend.pendingRequests.pull(friendId);
      user.sentRequests.pull(req.user._id);

      await user.save();
      await friend.save();

      return res.status(201).json( 
        new ApiResponse(200 , `Friend request ${action}ed` )
      )  
    }
)

const viewFriends =asyncHandler(async(req,res)=>{

  const userId = req.params.userId

  const user = await User.findById(userId).populate('friends');
    
  if (!user) {
    return res.status(401).json( 
      new ApiError(201 , 'user not found' )
    )  
    
  }
  return res.status(201).json( 
    new ApiResponse(200 ,user.friends, 'All friends' )
  )  
  
})

const removeFriend = asyncHandler(async(req,res)=>{
  const friendId = req.body.friendId;
  const user = await User.findById(req.user._id);
  const friend = await User.findById(friendId);
  if(!user || !friend)
   return res.status(404).json({ message: 'User not found' });
    
  if(!user.friends.includes(friendId))
    {
      return res.status(400).json(
      {message: 'You are not friends with this user'}
    )
  };
    user.friends.pull(friendId);
    friend.friends.pull(req.user._id);
    await user.save();
    await friend.save();

    return res.status(201).json( 
      new ApiResponse(200 , `Friend removed` )
    )
})

const forgotPassword = asyncHandler(async(req,res)=>{
  const {email} = req.body;
  if(!email){
    throw new ApiError(
      400,
      "Enter valid email",
   );
  }
  const user = await User.findOne({email});
  if(!user){
    throw new ApiError(404,"No match found for this email");
  }
 
let transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user: '7dheeraj5salvi@gmail.com',
    pass: 'gnusbdspwytfsvjd'
  }
})


})



export {registerUser,userLogin,logoutUser,getUser,sendFriendRequest,manageFriendRequest,removeFriend,
  viewFriends,updateUserInfo,getAllUser};