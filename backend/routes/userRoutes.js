import express from "express";
import { allusers, authUser, registerUser, updateUser,uploadPic } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.route('/').post(registerUser).get(protect,allusers);
router.route('/login').post(authUser);
router.route('/uploadPic').post(protect,upload.single("profilePic"),uploadPic);
router.route('/update-profile').patch(protect,upload.single("profilePic"),updateUser);


export default router;