import { commentOnPost, createPost, deletePost, likeUnlikePost, removeComment, updatePost, viewAllPost, viewComments, viewLikes, viewPost, viewSpecificUserPost } from "../controllers/post.controller.js";
import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const postRouter =express.Router()


postRouter.route('/posts').post(verifyJWT,createPost)

postRouter.route('/posts/:postId').get(verifyJWT,viewPost)

postRouter.route('/posts/:id').get(verifyJWT,viewSpecificUserPost)

postRouter.route('/posts/all').get(verifyJWT,viewAllPost)

postRouter.route('/posts/:postId').put(verifyJWT,updatePost)

postRouter.route('/posts/:postId').delete(verifyJWT,deletePost)

postRouter.route('/likes/toggle/:id').get(verifyJWT,likeUnlikePost)

postRouter.route('/likes/:id').get(verifyJWT,viewLikes)

postRouter.route('/comments/:postId').get(verifyJWT,viewComments)

postRouter.route('/comments/:postId').post(verifyJWT,commentOnPost)

postRouter.route('/deletecomment/:id/comment/:commentId').post(verifyJWT,removeComment)



export{postRouter}