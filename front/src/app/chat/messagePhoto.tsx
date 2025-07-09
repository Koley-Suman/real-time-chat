import React, { useState } from "react";
import { ImageIcon, Loader2Icon, SendHorizonalIcon, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { sendMessage } from "@/store/reducer";
import { Socket } from "socket.io-client";

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

const loading = useSelector((state: any) => state.userChat.imgLoad);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setShowImageModal(true);
    }
  };

  console.log("chat Id",chatId);
  console.log("image file",selectedImage);
  

  const sendImageMessage = async () => {
    if (!chatId || !selectedImage) return;
    console.log("send image");

    try {
      const result = await dispatch(
        sendMessage({ chatId, image: selectedImage })
      );

      if (sendMessage.fulfilled.match(result)) {
        const messageData = result.payload;
        if (socket) {
          socket.emit("new Message", messageData); // ✅ emit after successful send
        }
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setShowImageModal(false);
      }
      // Reset state
    } catch (err) {
      console.error("Failed to send image:", err);
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
              {!loading?(<button
                onClick={sendImageMessage}
                className="px-4 py-1 bg-violet-800 text-white rounded hover:bg-violet-900 cursor-pointer"
              >
                <SendHorizonalIcon />
              </button>):(
                <button
                className="px-4 py-1 bg-violet-800 text-white rounded hover:bg-violet-900 cursor-not-allowed"
              >
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
