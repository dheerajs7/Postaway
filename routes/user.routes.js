import express from 'express'
import { getAllUser, getUser, logoutUser, manageFriendRequest, registerUser, removeFriend, sendFriendRequest, updateUserInfo, userLogin, viewFriends } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';


const userRouter = express.Router();



userRouter.route("/users/signup").post( upload.single('avatar'),registerUser);

userRouter.route("/users/signin").post(userLogin);

userRouter.route("/users/logout").post(verifyJWT,logoutUser)

userRouter.route("/users/update-details/:userId").put(updateUserInfo);

userRouter.route("/users/get-all-details").get(getAllUser);

userRouter.route("/users/get-details/:userId").get(getUser);

userRouter.route("/friends/get-friends/:userId").get(viewFriends);

userRouter.route('/users/send-friend-request').post(verifyJWT,sendFriendRequest);

userRouter.route('/friends/respond-to-request').post(verifyJWT,manageFriendRequest);

userRouter.route('/remove-friend').post(verifyJWT,removeFriend);

export default userRouter;