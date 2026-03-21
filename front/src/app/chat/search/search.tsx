import { AppDispatch } from "@/store/store";
import { contacts } from "@/store/user_reducer/userThank";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createChat } from "@/store/chat_reducer/chatThank";
import { allMessages } from "@/store/message_reducer/messageThank";
import { SkeletonDemo } from "../skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Socket } from "socket.io-client";

interface SearchComponentProps {
  selectChat: (id: any, chat: any) => void;
}

const SearchComponent = ({ selectChat }: SearchComponentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchUser = useSelector((state: any) => state.user.searchUser);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isGroup, setIsGroup] = useState(false);
  const [selectedSearchUser, setSelectedSearchUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState("");
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [heading, setHeading] = useState();
  const [showMessages, setShowMessages] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUserId = useSelector(
    (state: any) => state.user.currentUser?._id,
  );
  const allChat = useSelector((state: any) => state.chat.allChat);
  console.log("all chats in search component", allChat);

  useEffect(() => {
    const search_User = async () => {
      if (!search.trim()) return;
      if (!loading) {
        setLoading(true);
      }

      try {
        const user = await dispatch(contacts({ text: search })).unwrap();
        setLoading(false);

        // console.log("Debounced search:", user);
      } catch (error) {
        console.error("Search failed:", error);
        setLoading(false);
      }
    };

    const handler = setTimeout(search_User, 300);

    return () => clearTimeout(handler);
  }, [search, dispatch]);

  const handleSelectSearchUser = async (user: any) => {
    setSelectedSearchUser(user);
    setSearch("");
    const existingChat = allChat.find(
      (chat: any) =>
        !chat.isGroupChat && chat.users.some((u: any) => u._id === user._id),
    );
    if (existingChat) {
      selectChat(existingChat._id, existingChat);
    } else {
      setSearch("");
      const result: any = await dispatch(createChat({ userId: user._id }));
      // Optionally, select the new chat after creation:
      if (createChat.fulfilled.match(result)) {
        selectChat(result.payload._id, result.payload);
      }
    }

    // You can also start a chat or show user details here
  };

  return (
    <>
      <div className="search mb-2  w-full p-1 px-3 input_background_color rounded-full flex items-center justify-between ">
        <SearchIcon style={{ color: "#5a5a5a" }} />
        <Input
          placeholder="search for chat"
          className="w-full mr-3 border-none input_color"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <div
        className=" w-full scrollbar-thin flex flex-col gap-2 overflow-y-auto border-gray-800 md:px-2 box-border 
                 md:[&::-webkit-scrollbar]:w-2
                 md:[&::-webkit-scrollbar-track]:rounded-full
                md:[&::-webkit-scrollbar-track]:bg-gray-800
                  md:[&::-webkit-scrollbar-thumb]:rounded-full
                md:[&::-webkit-scrollbar-thumb]:bg-gray-900
                dark:[&::-webkit-scrollbar-track]:bg-gray-700
                dark:[&::-webkit-scrollbar-thumb]:bg-gray-500
                  "
        style={{ height: "calc(var(--app-height) * 0.85)" }}
      >
        {loading ? (
          <SkeletonDemo />
        ) : search.trim() && searchUser && searchUser.length > 0 ? (
          searchUser.map((user: any) => (
            <div
              key={`search-${user._id}`}
              className="p-3 box-border  rounded-sm contacts w-full h-16 hover:bg-[#1f1f1f] cursor-pointer transition-all duration-300 ease-in-out text-gray-100 flex items-center "
              onClick={() => handleSelectSearchUser(user)}
            >
              <Avatar className="size-10">
                <AvatarImage
                  src={user.pic || "https://github.com/shadcn.png"}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ml-5">{user.name}</span>
            </div>
          ))
        ) : allChat && allChat.length > 0 ? (
          allChat.map((chat: any) => (
            <div
              key={`chat-${chat._id}`}
              className=" p-3 box-border rounded-sm contacts w-full h-16 hover:bg-[#1f1f1f] cursor-pointer transition-all duration-300 ease-in-out text-gray-100 flex items-center "
              onClick={() => selectChat(chat._id, chat)}
            >
              <Avatar className="size-10">
                <AvatarImage
                  src={
                    chat.isGroupChat === true
                      ? chat.groupPic
                      : chat.users?.find((u: any) => u._id !== currentUserId)
                        .pic || "https://github.com/shadcn.png"
                  }
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex justify-between items-center min-w-0 pr-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate overflow-hidden whitespace-nowrap ml-4 text-lg text-gray-300">
                    {chat.isGroupChat == true
                      ? chat.chatName
                      : chat.users?.find((u: any) => u._id !== currentUserId)
                          ?.name}
                  </p>
                  {chat.isGroupChat == true
                    ? chat.latestMessage && (
                        <p className="truncate flex overflow-hidden whitespace-nowrap ml-4 text-sm text-gray-500">
                          <span className="shrink-0 mr-1">
                            {chat?.latestMessage?.sender?._id === currentUserId
                              ? "You"
                              : chat?.latestMessage?.sender?.name}
                            :
                          </span>
                          <span
                            className={`truncate ${
                              chat.unreadCount > 0
                                ? "text-gray-300 font-bold"
                                : "font-normal"
                            }`}
                          >
                            {chat?.latestMessage?.content}
                          </span>
                        </p>
                      )
                    : chat.latestMessage && (
                        <div
                          className="flex items-center ml-4 text-sm text-gray-500 min-w-0"
                        >
                          <span className="shrink-0">
                            {chat?.latestMessage?.sender?._id === currentUserId
                              ? "you : "
                              : ""}
                          </span>
                          <span
                            className={`truncate ml-1 ${
                              chat.unreadCount > 0
                                ? "text-gray-200 font-bold"
                                : ""
                            }`}
                          >
                            {chat?.latestMessage?.content}
                          </span>
                        </div>
                      )}
                </div>
                {chat.unreadCount > 0 && (
                  <span className="bg-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-lg ml-2 shrink-0">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400 text-2xl font-bold">
                Please Search The Chat User
              </p>
            </div>
          </>
        )}
        <div className="w-full h-[10%]"></div>
      </div>
    </>
  );
};

export default SearchComponent;
