import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

interface MessageHeaderProps {
  setShowMessages: (show: boolean) => void;
  selectedChat: string;
  setDrawerOpen: (open: boolean) => void;
  setDrawerData: (data: any) => void;
  profilePic: string;
  heading: string;
}

const MessageHeader = ({
  setShowMessages,
  selectedChat,
  setDrawerOpen,
  setDrawerData,
  profilePic,
  heading,
}: MessageHeaderProps) => {
  const allChat = useSelector((state: any) => state.chat.allChat);
  // console.log(selectedChat);
  // console.log(profilePic);
  
  return (
    <>
      <div className=" messageSection header h-[10%] w-full text-gray-100 flex justify-center items-center px-5">
        <button
          className="md:hidden mr-2"
          onClick={() => setShowMessages(false)}
        >
          <ArrowLeft />
        </button>
        {/* <h1>suman koley</h1> */}
        <div
          className="flex h-full w-full items-center"
          onClick={() => {
            // Find current chat object
            const chatObj = allChat.find(
              (chat: any) => chat._id === selectedChat,
            );
            setDrawerData(chatObj);
            setDrawerOpen(true);
          }}
        >
          <div className="h-full w-full">
            {selectedChat ? (
              <div className="flex h-full w-full items-center">
                <Avatar className="size-10">
                  <AvatarImage
                    src={profilePic || "https://github.com/shadcn.png"}
                    className="object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="ml-4">{heading}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageHeader;
