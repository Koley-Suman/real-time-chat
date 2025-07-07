"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface GroupContactsProps {
  setSelectedChatId: React.Dispatch<React.SetStateAction<string[]>>;
  selectedChatId: string[];
}

function GroupContacts({ setSelectedChatId,selectedChatId }: GroupContactsProps) {
  const allChat = useSelector((state: any) => state.userChat.allChat);
  const currentUserId = useSelector(
    (state: any) => state.userChat.currentUser?._id
  );
  const [selectedChat, setSelectedChat] = useState<string[]>([]);

  useEffect(() => {
    if (selectedChatId.length === 0) {
      setSelectedChat([]);
    } 
  }, [selectedChatId]);

  const selectChat = (chat: any) => {
    const id = chat.users.find((u: any) => u._id != currentUserId)._id;
    const chatId = chat._id;
    setSelectedChatId(
      (prev: any) =>
        prev.includes(id)
          ? prev.filter((userId: any) => userId !== id) // Deselect if already selected
          : [...prev, id] // Select if not selected
    );
    setSelectedChat((prev: any) =>
      prev.includes(chatId)
        ? prev.filter((chat: any) => chat != chatId)
        : [...prev, chatId]
    );
  };

  return (
    <div>
      {allChat && allChat.length > 0
        ? allChat.map((chat: any) => {
            return (
              !chat.isGroupChat && (
                <div
                  key={`chat-${chat._id}`}
                  className={`contacts  w-full h-[10%] p-4 hover:bg-gray-600  flex items-center mb-1 ${
                    selectedChat.length > 0 &&
                    selectedChat.some((c: any) => c === chat._id)
                      ? "border-2 border-green-600 "
                      : "border-2 md:border-gray-700 border-gray-800 md:bg-gray-700"
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="w-[90%] flex h-full items-center bg-transparent">
                    <Avatar>
                      <AvatarImage
                        src={chat.users?.find((u: any) => u._id !== currentUserId).pic || "https://github.com/shadcn.png"}
                        alt={chat.users?.find((u: any) => u._id !== currentUserId).name}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span
                      className="ml-5 truncate max-w-[120px] overflow-hidden whitespace-nowrap"
                      title={
                        chat.users?.find((u: any) => u._id !== currentUserId)
                          ?.name
                      }
                    >
                      {
                        chat.users?.find((u: any) => u._id !== currentUserId)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="w-[10%] flex items-center justify-center">
                    <CheckIcon
                      className={`${
                        selectedChat.length > 0 &&
                        selectedChat.some((c: any) => c === chat._id)
                          ? "block"
                          : "hidden"
                      }`}
                      color="green"
                    />
                  </div>
                </div>
              )
            );
          })
        : ""}
    </div>
  );
}

export default GroupContacts;
