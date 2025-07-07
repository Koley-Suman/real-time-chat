import express from "express";
import { allusers, authUser, registerUser } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.route('/').post(upload.single("profilePic"),registerUser).get(protect,allusers);
router.route('/login').post(authUser);

export default router;