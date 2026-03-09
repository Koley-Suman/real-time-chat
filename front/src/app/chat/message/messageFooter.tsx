import { SendHorizonalIcon, SmileIcon } from "lucide-react";
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
  senduserMessage: (e:any) => void;
}

const MessageFooter = ({ selectedChat, socket,setNewMessage, typeHandeler, newMessage, handleKeyDown, senduserMessage }: MessageHeaderProps) => {

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const inputRef = useRef(null);
     const inputmessageRef = useRef<HTMLInputElement>(null);

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
    <div className="w-full h-[12%] flex items-center justify-center">
      <div className="createMessage flex  h-[70%] items-center w-[85%] rounded-4xl input_background_color text-gray-100 justify-between md:justify-evenly">
        {selectedChat ? (
          <React.Fragment>
            <div className="w-[86%] flex justify-evenly items-center ">
              <div className="md:w-[10%] w-[10%] flex items-center justify-evenly gap-2">
                <SmileIcon
                  className="cursor-pointer hover:text-yellow-400 hidden md:block"
                  size={22}
                  onClick={toggleEmojiPicker}
                />
                <ImageUploadPreview chatId={selectedChat} socket={socket} />
              </div>

              <Input
                placeholder="Type a message"
                className="md:w-[80%] w-[80%] border-none text-gray-100 caret-violet-900 "
                onChange={typeHandeler}
                value={newMessage}
                ref={inputmessageRef}
                onFocus={() => setShowEmojiPicker(false)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div
              className="w-[13%] md:w-[10%] flex justify-center items-center"
              onClick={senduserMessage}
            >
              <SendHorizonalIcon
                className={`text-slate font-thin ${
                  newMessage.length > 0 ? "block" : "hidden"
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
