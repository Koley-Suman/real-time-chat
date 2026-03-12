import React, { useState } from "react";
import { ImageIcon, Loader2Icon, SendHorizonalIcon, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { sendMessage } from "@/store/message_reducer/messageThank";
import { Socket } from "socket.io-client";
import imageCompression from "browser-image-compression";
import {
  addMessage,
  replaceTempMessage,
  uploadFailed,
} from "@/store/message_reducer/messageSlice";

interface ImageUploadPreviewProps {
  chatId: string;
  socket: Socket | null;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  chatId,
  socket,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: any) => state.user.imgLoad);
  const currentUserId = useSelector(
    (state: any) => state.user.currentUser?._id,
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // compress only if image is larger than 1MB
        let compressedFile = file;

        if (file.size > 10 * 1024 * 1024) {
          const options = {
            maxSizeMB: 5, // compress down to ~5MB
            maxWidthOrHeight: 1920, // prevent huge resolution
            useWebWorker: true,
          };

          compressedFile = await imageCompression(file, options);
        }

        setSelectedImage(compressedFile);
        setImagePreviewUrl(URL.createObjectURL(compressedFile));
        setShowImageModal(true);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };

  // console.log("chat Id",chatId);
  // console.log("image file",selectedImage);

  const sendImageMessage = async () => {
    if (!chatId || !selectedImage) return;
    // console.log("send image");
    const tempId = "temp-" + Date.now();

    const tempMessage = {
      _id: tempId,
      sender: { _id: currentUserId },
      chat: { _id: chatId },
      image: URL.createObjectURL(selectedImage),
      deliveredTo: [],
      seenBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "uploading",
      file: selectedImage,
    };

    dispatch(addMessage(tempMessage));
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setShowImageModal(false);

    try {
      const result = await dispatch(
        sendMessage({ chatId, image: selectedImage }),
      );

      if (sendMessage.fulfilled.match(result)) {
        const messageData = result.payload;
        if (socket) {
          socket.emit("new Message", messageData);
          dispatch(
            replaceTempMessage({
              tempId,
              realMessage: messageData,
            }),
          );
        }
      }
      // Reset state
    } catch (err) {
      console.error("Failed to send image:", err);
      dispatch(uploadFailed({ tempId }));
    }
  };
  return (
    <>
      {/* Image Select Button */}
      <label htmlFor="image-upload">
        <ImageIcon className="cursor-pointer hover:text-blue-400" size={22} />
      </label>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Modal Preview */}
      {showImageModal && (
        <div className="fixed md:left-92 left-0 bottom-5 w-full  md:bottom-3 md:w-[300px] md:h-[400px] z-50 bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-700 text-gray-100 rounded-lg p-4 w-[100%] h-[100%] max-w-sm shadow-lg">
            <div
              className="w-full flex items-center justify-end cursor-pointer"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
                setImagePreviewUrl(null);
              }}
            >
              <X />
            </div>
            <h2 className="text-lg font-semibold mb-2"> Image</h2>
            <img
              src={imagePreviewUrl!}
              alt="Preview"
              className="rounded w-full max-w-full max-h-60 object-contain mb-4"
            />
            <div className="flex justify-end gap-2">
              {!loading ? (
                <button
                  onClick={sendImageMessage}
                  className="px-4 py-1 bg-violet-800 text-white rounded hover:bg-violet-900 cursor-pointer"
                >
                  <SendHorizonalIcon />
                </button>
              ) : (
                <button className="px-4 py-1 bg-violet-800 text-white rounded hover:bg-violet-900 cursor-not-allowed">
                  <Loader2Icon className="animate-spin" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploadPreview;
