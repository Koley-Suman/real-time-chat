import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allMessages, sendMessage } from '../controllers/messageControler.js';
import { upload } from '../middleware/multer.js';
import { markMessagesSeen } from '../controllers/messageControler.js';
const router = express.Router();
router.route('/').post(protect, upload.single("image"), sendMessage);
router.route('/:chatId').get(protect, allMessages);
router.put("/seen", protect, markMessagesSeen);

export default router;