
import { Post } from "../models/posts.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const createPost = asyncHandler(async(req,res)=>{
    const newPost ={
       caption: req.body.caption,
       image:{
        public_id:"req.body.public_id",
        url:"req.body.url",
       },
       createdBy : req.user._id,
}

const post = await Post.create(newPost);

const user = await User.findById(req.user._id);


user.post.push(post._id);

await user.save();

return res.status(201).json(
    new ApiResponse(200, post, "Post created successfully")
   )
 })

 const viewPost = asyncHandler(async(req,res)=>{
  const post = await Post.findById(req.params.postId)
  console.log(post);
  
  if(!post){
    return res.status(404).json(
      new ApiResponse(404, null, "Post not found")
      )
      }
      return res.status(200).json(
        new ApiResponse(200, post, "Post found")
      )
 })

 const viewAllPost = asyncHandler(async(req,res)=>{
  const post = await Post.find()
  console.log(post);
  
  if(!post){
    return res.status(404).json(
      new ApiError(404, null, "Posts not found")
      )
      }
      return res.status(200).json(
        new ApiResponse(200, post, "Posts found")
      )
 })

 const viewSpecificUserPost = asyncHandler(async(req,res)=>{

  const userId = req.params.id;

  if (!userId) {
    return res.status(200).json(
      new ApiError(200,'User not found')
    )
    
  }
  const post = await Post.find({createdBy:userId})
  if (!post){
    return res.status(200).json(
      new ApiError(200,'Post not found')
    )

  }
      return res.status(200).json(
        new ApiResponse(200,post,'User not found')
      )

 
})

 const updatePost =asyncHandler(async(req,res)=>{
  const post = await Post.findById(req.params.postId);
  if(!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
      });
      }
      post.caption = req.body.caption;
      post.image.public_id = req.body.public_id;
      post.image.url = req.body.url;
      await post.save();
      return res.status(201).json(
        new ApiResponse(200, "Post updated successfully")
       )
    } 
  )

 const deletePost = asyncHandler(async(req,res)=>{
  const post = await Post.findById(req.params.postId)
  if (!post) {
    return res.status(404).json(
    new ApiResponse(404, "Post not found" )
    )
  }      

  if (post.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this post" });
  }

  await post.deleteOne();
  await User.findByIdAndUpdate(post.createdBy, {
    $pull: { post: req.params.id }
  });
  return res.status(201).json(
    new ApiResponse(200, "Post deleted successfully")
   )
} 
 )


const likeUnlikePost = asyncHandler(async(req,res)=>{

  const post =await Post.findById(req.params.id);
  
  console.log(req.user._id);
  
  const isLiked = post.like.some(like => like.equals(req.user._id));

    if (isLiked) {
        const index = post.like.findIndex(like => like.equals(req.user._id));
        post.like.splice(index, 1);
        await post.save();
    return res.status(201).json(
      new ApiResponse(200, "Post unliked")
     )
  }
else{
  post.like.push(req.user._id); 

  await post.save()

  
  return res.status(201).json(
    new ApiResponse(200, post, "Post liked")
   )
  }
})

const viewLikes = asyncHandler(async(req,res)=>{
  const post = await Post.findById(req.params.id).populate("like");
  console.log(post);
  
  return res.status(201).json(
    new ApiResponse(200, post.like,"All likes")
   )
  // return res.status(201).json(post.like);
  })



const commentOnPost = asyncHandler(async(req,res)=>{
  const  postId  = req.params.postId; // ID of the post to comment on
    const { userId, commentText } = req.body; // ID of the user and the comment text
 console.log(postId);
   
    // Find the post by ID
    // if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: "Invalid post or user ID" });
    // }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    console.log(post);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" }); // Handle null post case
    }
     
    const newComment ={
      user: userId,
      comment: commentText,
    };

    post.comment.push(newComment);
    
    await post.save();


    return res.status(201).json(
      new ApiResponse(200,newComment, "comment added succesfully" )
     )
    }
  )

  const viewComments = asyncHandler(async(req,res)=>{
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('comment.user')
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
      }
      return res.status(201).json(
        new ApiResponse(200,post.comment, "all comments" )
       )
  })

  const removeComment = asyncHandler(async(req,res)=>{
    const { id: postId, commentId } = req.params;
    
    const user = req.user._id;

    const { userId } = req.body;
       
  
    const post = await Post.findById(postId);
   


    const comment = post.comment.id(commentId);
   
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

      if (post.createdBy.toString() == user.toString() && comment.user.toString()==userId){
        post.comment.pull(commentId);
        await post.save();
        return res.status(200).json({ message: "Comment deleted successfully" });
    
      }
      
      return res.status(401).json({ message: " You cannot delete this " });
      
  })


export {createPost,likeUnlikePost,deletePost,updatePost,
  commentOnPost,removeComment,viewLikes,viewComments,viewPost,viewAllPost,viewSpecificUserPost}