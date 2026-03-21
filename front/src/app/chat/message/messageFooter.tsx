import { Loader2Icon, SendHorizonalIcon, SmileIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import ImageUploadPreview from "../messagePhoto";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
interface MessageHeaderProps {
  selectedChat: string;
  socket: any;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  typeHandeler: React.ChangeEventHandler<HTMLInputElement>;
  newMessage: string;
  handleKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  senduserMessage: (e: any) => void;
  inputmessageRef: any;
}

const MessageFooter = ({ selectedChat, socket, setNewMessage, typeHandeler, newMessage, handleKeyDown, senduserMessage, inputmessageRef }: MessageHeaderProps) => {

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const lockPageScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const unlockPageScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);

    // Close keyboard when emoji picker opens
    if (!showEmojiPicker && inputRef.current) {
      // inputmessageRef.current?.blur();
    }
  };
  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.emoji);
  };




  return (
    <div className="w-full h-16 flex items-center justify-center bg-transparent pb-[env(safe-area-inset-bottom)] touch-none pointer-events-auto" style={{ touchAction: 'none' }}>
      <div className="createMessage flex h-[80%] items-center w-[95%] md:w-[85%] rounded-full input_background_color text-gray-100 px-3 md:px-5">
        {selectedChat ? (
          <React.Fragment>
            <div className="flex items-center gap-2 shrink-0">
              <SmileIcon
                className="cursor-pointer hover:text-yellow-400 hidden md:block"
                size={22}
                onClick={toggleEmojiPicker}
              />
              <ImageUploadPreview chatId={selectedChat} socket={socket} />
            </div>

            <div className="flex-1 mx-2 min-w-0">
              <Input
                placeholder="Type a message"
                className="w-full border-none bg-transparent text-gray-100 caret-violet-900 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                onChange={typeHandeler}
                value={newMessage}
                ref={inputmessageRef}
                onFocus={() => {
                  setShowEmojiPicker(false);
                  lockPageScroll();
                }}
                onBlur={() => {
                  unlockPageScroll();
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div
              className="flex justify-center items-center cursor-pointer shrink-0 w-8"
              onMouseDown={(e) => e.preventDefault()}
              onClick={senduserMessage}
            >
              <SendHorizonalIcon
                className={`text-slate-200 ${newMessage.length > 0 ? "block" : "hidden"
                  }`}
              />
            </div>

          </React.Fragment>
        ) : (
          ""
        )}
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-6 left-10 w-fit z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            width={250}
            height={300}
          />
        </div>
      )}
    </div>
  );
};

export default MessageFooter;