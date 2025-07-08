"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

// import "emoji-mart/css/emoji-mart.css";
import {
  addMessage,
  allMessages,
  contacts,
  createChat,
  fetchAllChats,
  sendMessage,
} from "@/store/reducer";
import { AppDispatch } from "@/store/store";
import {
  ArrowLeft,
  ImageIcon,
  Send,
  SendHorizonalIcon,
  SkipBack,
  SmileIcon,
  StepBack,
  StepBackIcon,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogDemo } from "./dialogBox";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import animationData from "@/animation/typing.json";
import Lottie from "react-lottie";
import UserDrawer from "./drawer";
import { url } from "inspector";
import ImageUploadPreview from "./messagePhoto";
import SignOut from "./signOut";

const ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_URL;
var selectedChatCompare;

function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const allChat = useSelector((state: any) => state.userChat.allChat);
  const [heading, setHeading] = useState();
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const searchUser = useSelector((state: any) => state.userChat.searchUser);
  const [selectedSearchUser, setSelectedSearchUser] = useState<any>(null);
  const [soctetConnection, setSoctetConnection] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const [profilePic, setProfilePic] = useState("");

  const [imageMessage, setImageMessage] = useState<File | null>(null);

  // state hook for drawer----
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [signOutDrawer,setSignOutDrawer]=useState(false);
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  console.log(newMessage);

  const defaultoption = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYmid slice",
    },
  };

  const currentUserId = useSelector(
    (state: any) => state.userChat.currentUser?._id
  );
  const currentUser = useSelector(
    (state: any) => state.userChat.currentUser?.pic)
  const allMssage = useSelector((state: any) => state.userChat.allMessages);
  console.log(allMssage);

  useEffect(() => {
    const fetchChats = async () => {
      await dispatch(fetchAllChats());
    };
    fetchChats();
  }, [dispatch, allMssage]);

  const selectChat = (id: any, chat: any) => {
    setSelectedChat(id);
    dispatch(allMessages(id));
    if (socket && socket.connected) {
      socket.emit("join chat", id);
    }
    if (chat.isGroupChat) {
      setHeading(chat.chatName);
      setIsGroup(true);
      setProfilePic(chat.groupPic);
    } else {
      setHeading(chat.users?.find((u: any) => u._id !== currentUserId).name);
      setIsGroup(false);
      setProfilePic(chat.users?.find((u: any) => u._id !== currentUserId).pic);
    }
    setShowMessages(true);
  };

  const senduserMessage = async (e: any) => {
    e.preventDefault();
    try {
      const data = await dispatch(
        sendMessage({
          chatId: selectedChat,
          content: newMessage,
        })
      );
      socket?.emit("new Message", data.payload);
      socket?.emit("stop typing", selectedChat);
      setNewMessage("");
    } catch (error) {
      console.error("not send message");
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== "") {
        const user = dispatch(contacts({ text: search }));

        console.log("Debounced search:", user);
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleSelectSearchUser = async (user: any) => {
    setSelectedSearchUser(user);
    setSearch("");
    const existingChat = allChat.find(
      (chat: any) =>
        !chat.isGroupChat && chat.users.some((u: any) => u._id === user._id)
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

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    newSocket.emit("setup", currentUserId);
    newSocket.on("connected", () => setSoctetConnection(true));
    newSocket.on("typing", () => setIsTyping(true));
    newSocket.on("stop typing", () => {
      setIsTyping(false);
      setTyping(false);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      const handler = (newMessageReceived: any) => {
        dispatch(addMessage(newMessageReceived));
      };
      socket.on("message received", handler);
      return () => {
        socket.off("message received", handler);
      };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMssage, isTyping]);

  const typeHandeler = (e: any) => {
    setNewMessage(e.target.value);
    if (!soctetConnection) return;

    if (!typing) {
      setTyping(true);
      socket?.emit("typing", selectedChat);
    }
    let lastTypingTime = new Date().getTime();
    const timmer = 3000;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timmer && typing) {
        socket?.emit("stop typing", selectedChat);
        setTyping(false);
      }
    }, timmer);
  };

  const formateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  let lastDate = "";

  const inputmessageRef = useRef<HTMLInputElement>(null);


  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);

    // Close keyboard when emoji picker opens
    if (!showEmojiPicker && inputRef.current) {
      // inputmessageRef.current?.blur();
    }
  };
  const handleEmojiSelect = (emoji:any) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  return (
    <div className="h-screen w-screen md:p-6 p-0 box-border bg-gray-600">
      <div className="h-full w-full flex drop-shadow-md bg-white">
        <div
          className={`w-1/4 border-r h-full py-4 md:py-0  bg-gray-800 box-border overflow-hidden md:block
        ${showMessages ? "hidden" : "block"} 
        md:w-1/4
        fixed top-0 left-0 w-full h-full z-20 md:static md:z-auto`}
        >
          <div className="h-[10%] w-full flex items-center justify-between px-4  bg-gray-900  box-border mb-2">
            {/* current user picture */}
            <Avatar className="w-10 h-10 " onClick={()=>setSignOutDrawer(true)}>
              <AvatarImage
                src={currentUser || "https://github.com/shadcn.png"}
                className="object-cover"
              />
            </Avatar>
            <DialogDemo />
          </div>
          <div className="search mb-2 h-[6%] w-full px-4">
            <Input
              placeholder="Type a message"
              className="w-full bg-gray-600 mr-3 text-gray-100 border-none"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
             
            />
          </div>
          <div
            className=" w-full h-[85%] scrollbar-thin overflow-auto border-gray-600 md:px-2 px-3 bg-gray-800 box-border 
                 md:[&::-webkit-scrollbar]:w-2
                 md:[&::-webkit-scrollbar-track]:rounded-full
                md:[&::-webkit-scrollbar-track]:bg-gray-800
                  md:[&::-webkit-scrollbar-thumb]:rounded-full
                md:[&::-webkit-scrollbar-thumb]:bg-gray-900
                dark:[&::-webkit-scrollbar-track]:bg-gray-700
                dark:[&::-webkit-scrollbar-thumb]:bg-gray-500
                  "
          >
            {search.trim() && searchUser && searchUser.length > 0
              ? searchUser.map((user: any) => (
                  <div
                    key={`search-${user._id}`}
                    className="contacts w-full h-[12%] p-2 text-gray-100 hover:bg-gray-700 bg-gray-800 flex items-center  cursor-pointer"
                    onClick={() => handleSelectSearchUser(user)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={user.pic || "https://github.com/shadcn.png"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-5">{user.name}</span>
                  </div>
                ))
              : allChat && allChat.length > 0
              ? allChat.map((chat: any) => (
                  <div
                    key={`chat-${chat._id}`}
                    className="contacts w-full h-[12%] p-2 bg-gray-800 hover:bg-gray-700 text-gray-100 flex items-center "
                    onClick={() => selectChat(chat._id, chat)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          chat.isGroupChat === true
                            ? chat.groupPic
                            : chat.users?.find(
                                (u: any) => u._id !== currentUserId
                              ).pic || "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="ml-5 text-base">
                        {chat.isGroupChat == true
                          ? chat.chatName
                          : chat.users?.find(
                              (u: any) => u._id !== currentUserId
                            ).name}
                      </span>
                      {chat.isGroupChat == true
                        ? chat.latestMessage && (
                            <p className="truncate max-w-[120px] overflow-hidden whitespace-nowrap ml-5 text-sm text-gray-500 ">
                              {chat?.latestMessage?.sender?._id ===
                              currentUserId
                                ? "you"
                                : chat?.latestMessage?.sender?.name}{" "}
                              : {chat?.latestMessage?.content}
                            </p>
                          )
                        : chat.latestMessage && (
                            <p
                              className={`truncate max-w-[120px] overflow-hidden whitespace-nowrap ml-5 text-sm text-gray-500 `}
                            >
                              {chat?.latestMessage?.sender?._id ===
                              currentUserId
                                ? "you : "
                                : ""}{" "}
                              {chat?.latestMessage?.content}
                            </p>
                          )}
                    </div>
                  </div>
                ))
              : "lodding..."}
            <div className="w-full h-[10%]"></div>
          </div>
        </div>
        <div
          className={`
        flex-1
        ${showMessages ? "block" : "hidden"}
        md:block
        fixed top-0 left-0 w-full h-full z-30 bg-white md:static md:w-auto md:h-auto md:bg-transparent
      `}
        >
          <div className=" messageSection header h-[10%] w-full bg-gray-900 text-gray-100 flex items-center px-5">
            <button
              className="md:hidden mr-2"
              onClick={() => setShowMessages(false)}
            >
              <ArrowLeft />
            </button>
            <div
              className="flex h-full w-full items-center"
              onClick={() => {
                // Find current chat object
                const chatObj = allChat.find(
                  (chat: any) => chat._id === selectedChat
                );
                setDrawerData(chatObj);
                setDrawerOpen(true);
              }}
            >
              <div className="h-full w-full">
                {selectedChat ? (
                  <div className="flex h-full w-full items-center">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={profilePic || "https://github.com/shadcn.png"}
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
          <div className="messagesectio flex h-[78%] w-full bg-slate-800">
            <div
              className=" h-full flex scrollbar-thin flex-col p-2 md:p-6 w-full overflow-auto
                md:[&::-webkit-scrollbar]:w-2
                 md:[&::-webkit-scrollbar-track]:rounded-full
                md:[&::-webkit-scrollbar-track]:bg-gray-800
                  md:[&::-webkit-scrollbar-thumb]:rounded-full
                md:[&::-webkit-scrollbar-thumb]:bg-gray-900
                dark:[&::-webkit-scrollbar-track]:bg-gray-700
                dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
            "
            >
              {selectedChat && allMssage && allMssage.length > 0 ? (
                allMssage.map((message: any, i: number) => {
                  const isSender = message.sender._id === currentUserId;
                  const messageDate = formatDate(message.createdAt);
                  const showDate = messageDate !== lastDate;
                  lastDate = messageDate;
                  return (
                    <React.Fragment key={i}>
                      {showDate && (
                        <div className="w-full flex justify-center my-2">
                          <span className="bg-gray-400 text-xs text-gray-700 px-3 py-1 rounded-full">
                            {messageDate}
                          </span>
                        </div>
                      )}
                      <div
                        key={i}
                        className={`h-fit w-full flex ${
                          isSender ? "justify-end" : "justify-start"
                        } items-center mb-2 max-h-[600px]`}
                      >
                        <div
                          className={`message ${
                            isSender
                              ? "text-white bg-violet-900"
                              : "text-slate-800 bg-gray-300"
                          }  rounded-2xl md:p-2.5 p-2 h-fit w-fit max-w-[49%] flex  justify-between`}
                        >
                          <span>
                            {isGroup && message.sender._id != currentUserId ? (
                              <p
                                className="text-xs "
                                style={{
                                  color: `hsl(${
                                    (message.sender.name.charCodeAt(0) * 137) %
                                    360
                                  }, 70%, 45%)`,
                                }}
                              >
                                {message.sender.name.toUpperCase()}
                              </p>
                            ) : (
                              <></>
                            )}
                            <div>
                              {message.image ? (
                                <img
                                  src={message.image}
                                  alt="sent"
                                  className=" object-cover max-w-[260px] max-h-[300px] w-full h-auto rounded-lg"
                                  onLoad={() => {
                                    messagesEndRef.current?.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                  }}
                                />
                              ) : (
                                <p className="break-words">{message.content}</p>
                              )}
                            </div>
                          </span>
                          <span
                            className={`text-[10px]  self-end mt-1 ml-3 ${
                              isSender ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            <p className="text-center">
                              {formateTime(message.createdAt)}
                            </p>
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-100">
                  <p>select and show your chat</p>
                </div>
              )}

              {isTyping ? (
                <div className="w-full flex items-center justify-start mt-2 ">
                  <div className="bg-gray-300 rounded-xl px-2 py-1 flex items-center">
                    <Lottie options={defaultoption} width={50} height={30} />
                    {/* <span className="ml-2 text-white text-sm">Typing...</span> */}
                  </div>
                </div>
              ) : (
                ""
              )}
              <div ref={messagesEndRef} className="h-6 w-full"></div>
            </div>
          </div>


          {/* imojii */}

          
          <div className="createMessage flex h-[12%] items-center w-full bg-gray-900 text-gray-100 justify-between md:justify-evenly">
            {selectedChat ? (
              <React.Fragment>
                <div className="w-[86%] flex justify-evenly items-center ">
                  <div className="md:w-[10%] w-[10%] flex items-center justify-evenly gap-2">
                    <SmileIcon
                      className="cursor-pointer hover:text-yellow-400 hidden md:block"
                      size={22}
                      onClick={toggleEmojiPicker}
                    />
                    <ImageUploadPreview
                      chatId={selectedChat}
                      socket={socket}
                    />
                  </div>

                  <Input
                    placeholder="Type a message"
                    className="md:w-[80%] w-[80%] bg-gray-800 border-none text-gray-100"
                    onChange={typeHandeler}
                    value={newMessage}
                    ref={inputmessageRef}
                    onFocus={() => setShowEmojiPicker(false)}
                    // onFocus={handleInputFocus}
                  />
                </div>
                <div
                  className="w-[13%] md:w-[10%] flex justify-center items-center" 
                  onClick={senduserMessage}
                >
                  <SendHorizonalIcon className={`text-slate font-thin ${newMessage.length>0?"block":"hidden"}`} />
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-6 left-10 w-fit z-50">
           <Picker data={data} onEmojiSelect={handleEmojiSelect} previewPosition="none"/>
        </div>
      )}
      <UserDrawer
        drawerOpen={drawerOpen}
        drawerDatas={drawerData}
        setDrawerOpen={setDrawerOpen}
      />
      <SignOut signOutDrawer={signOutDrawer} setSignOutDrawer={setSignOutDrawer}/>
    </div>
  );
}

export default Chat;
