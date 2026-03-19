"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";

// import "emoji-mart/css/emoji-mart.css";
import { createChat, fetchAllChats } from "@/store/chat_reducer/chatThank";
import { contacts } from "@/store/user_reducer/userThank";
import { sendMessage, allMessages } from "@/store/message_reducer/messageThank";
import { addMessage } from "@/store/message_reducer/messageSlice";
import { AppDispatch } from "@/store/store";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  SendHorizonalIcon,
  SmileIcon,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogDemo } from "./dialogBox";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
// import animationData from "@/animation/typing.json";
import Lottie from "react-lottie";
import UserDrawer from "./drawer";
import { url } from "inspector";
import ImageUploadPreview from "./messagePhoto";
import SignOut from "./signOut";
import Image from "next/image";
import { SkeletonDemo } from "./skeleton";
import "./chat.css";
import SearchComponent from "./search/search";
import MessageHeader from "./message/messageHeader";
import MessageComponent from "./message/message";
import MessageFooter from "./message/messageFooter";
import { DropdownMenuBasic } from "./dropDownMenu";
import { updateDelivered } from "@/store/message_reducer/messageSlice";
import { updateSeen } from "@/store/message_reducer/messageSlice";
import {
  addLastMessage,
  clearUnread,
  increaseUnread,
} from "@/store/chat_reducer/chatSlice";
const ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_URL;
var selectedChatCompare;

function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const [heading, setHeading] = useState("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [soctetConnection, setSoctetConnection] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const token = useSelector((state: any) => state.user.currentUser?.token);

  const [profilePic, setProfilePic] = useState("");

  // state hook for drawer----
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [signOutDrawer, setSignOutDrawer] = useState(false);
  const [open, setOpen] = useState(false);

  // console.log(newMessage);

  const currentUserId = useSelector(
    (state: any) => state.user.currentUser?._id,
  );

  const allMssage = useSelector((state: any) => state.message.allMessages);

  useEffect(() => {
    dispatch(fetchAllChats());
  }, []);

  // dispatch(fetchAllChats());

  const selectChat = async (id: any, chat: any) => {
    setSelectedChat(id);
    dispatch(clearUnread({ chatId: id }));
    dispatch(allMessages(id));
    if (socket && socket.connected) {
      socket?.emit("join chat", id);
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

    // await fetch("/api/message/seen", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     chatId: id,
    //   }),
    // });
    socket?.emit("messages seen", {
      chatId: id,
      userId: currentUserId,
    });
  };

  const senduserMessage = async (e: any) => {
    e.preventDefault();
    try {
      const data = await dispatch(
        sendMessage({
          chatId: selectedChat,
          content: newMessage,
        }),
      );
      socket?.emit("new Message", data.payload);
      socket?.emit("stop typing", selectedChat);
      setNewMessage("");
    } catch (error) {
      console.error("not send message");
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline if textarea
      try {
        const data = await dispatch(
          sendMessage({
            chatId: selectedChat,
            content: newMessage,
          }),
        );
        dispatch(addMessage(data.payload));
        socket?.emit("new Message", data.payload);
        socket?.emit("stop typing", selectedChat);
        setNewMessage("");
      } catch (error) {
        console.error("not send message");
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== "") {
        const user = dispatch(contacts({ text: search }));

        // console.log("Debounced search:", user);
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

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
    if (!socket) return;

    const handler = (newMessageReceived: any) => {
      socket.emit("message delivered", {
        messageId: newMessageReceived._id,
        chatId: newMessageReceived.chat._id,
        userId: currentUserId,
      });
      dispatch(
        addLastMessage({
          chatId: newMessageReceived.chat._id,
          message: newMessageReceived,
        }),
      );

      if (selectedChat === newMessageReceived.chat._id) {
        socket.emit("messages seen", {
          chatId: newMessageReceived.chat._id,
          userId: currentUserId,
        });
        dispatch(addMessage(newMessageReceived));
      } else {
        dispatch(increaseUnread({ chatId: newMessageReceived.chat._id }));
        // dispatch(addLastMessage({ chatId: newMessageReceived.chat._id, message: newMessageReceived?.content }));
      }

      // dispatch(addMessage(newMessageReceived));
    };

    const handleDelivered = ({ messageId, userId }: any) => {
      console.log("delivered received", messageId);
      dispatch(updateDelivered({ messageId, userId }));
    };
    const handleSeen = ({ chatId, userId }: any) => {
      dispatch(updateSeen({ chatId, userId }));
    };

    socket.on("message received", handler);
    socket.on("message delivered", handleDelivered);
    socket.on("messages seen", handleSeen);

    return () => {
      socket.off("message received", handler);
      socket.off("message delivered", handleDelivered);
      socket.off("messages seen", handleSeen);
    };
  }, [socket, selectedChat, dispatch]);

  // useEffect(() => {
  //   console.log("listening for message delivered");
  //   if (!socket) return;

  //   const handleDelivered = ({ messageId, userId }: any) => {
  //     console.log("delivered received", messageId);
  //     dispatch(updateDelivered({ messageId, userId }));
  //   };

  //   socket.on("message delivered", handleDelivered);

  //   return () => {
  //     socket.off("message delivered", handleDelivered);
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   if (!socket) return;

  //   return () => {

  //   };
  // }, [socket, dispatch]);

  const typeHandeler = (e: any) => {
    setNewMessage(e.target.value);
    if (!soctetConnection) return;
    if (!selectedChat) return;

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

  // console.log(ENDPOINT);
  // console.log(selectedChat, "selected chat");

  // useEffect(() => {
  //   const handleResize = () => {
  //     const vh = window.visualViewport?.height;
  //     const fullHeight = window.innerHeight;

  //     if (vh) {
  //       document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);

  //       // 👇 IMPORTANT: calculate keyboard height
  //       const keyboardHeight = fullHeight - vh;

  //       document.documentElement.style.setProperty(
  //         "--keyboard-height",
  //         `${keyboardHeight}px`,
  //       );
  //     }
  //   };

  //   handleResize();

  //   window.visualViewport?.addEventListener("resize", handleResize);

  //   return () => {
  //     window.visualViewport?.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <div className="w-dvw h-dvh md:p-6 p-0 box-border noto-sans-chatFont input_background_color">
      <div className=" w-dvw h-dvh flex drop-shadow-md background  box-border">
        <div
          className={`w-1/4 border-r h-full md:py-0  box-border md:block
        ${showMessages ? "hidden" : "block"} 
        md:w-1/4
        fixed top-0 left-0 w-full h-full z-20 md:static md:z-auto p-5 box-border`}
        >
          <div className="sm:h-[4%] md:h[10%] w-full flex items-center justify-between  box-border mb-2">
            <h1 className="text-white text-2xl">MyChat</h1>

            <DropdownMenuBasic />
          </div>
          <SearchComponent selectChat={selectChat} />
        </div>
        <div
          className={`
    ${showMessages ? "flex" : "hidden"}
    fixed inset-0
    flex-col
    w-full
    z-30
    md:static md:w-[75%] md:h-full
  `}
        >
          {/* Header */}

          <MessageHeader
            setShowMessages={setShowMessages}
            selectedChat={selectedChat}
            setDrawerOpen={setDrawerOpen}
            setDrawerData={setDrawerData}
            profilePic={profilePic}
            heading={heading}
          />

          {/* Messages */}

          <MessageComponent
            selectedChat={selectedChat}
            isTyping={isTyping}
            isGroup={isGroup}
          />

          {/* Footer */}
          
          {/* <div className="shrink-0 bg-slate-900 pb-[env(safe-area-inset-bottom)] mb-[var(--keyboard-height)]"> */}
          {/* <div className="w-full h-[12%] shrink-0 bg-slate-900 pb-[env(safe-area-inset-bottom)]"> */}
          <MessageFooter
            selectedChat={selectedChat}
            socket={socket}
            setNewMessage={setNewMessage}
            typeHandeler={typeHandeler}
            newMessage={newMessage}
            handleKeyDown={handleKeyDown}
            senduserMessage={senduserMessage}
          />
          {/* </div> */}
        </div>
      </div>

      <UserDrawer
        drawerOpen={drawerOpen}
        drawerDatas={drawerData}
        setDrawerOpen={setDrawerOpen}
      />
      <SignOut
        signOutDrawer={signOutDrawer}
        setSignOutDrawer={setSignOutDrawer}
      />
    </div>
  );
}

export default Chat;  this is parent component
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
      <div className="h-16 w-full flex items-center justify-start px-5 z-10 background border-b border-gray-700 text-gray-100">
        <button
          className="md:hidden mr-2"
          onClick={() => setShowMessages(false)}
        >
          <ArrowLeft />
        </button>

        <div
          className="flex items-center w-full cursor-pointer"
          onClick={() => {
            const chatObj = allChat.find(
              (chat: any) => chat._id === selectedChat,
            );
            setDrawerData(chatObj);
            setDrawerOpen(true);
          }}
        >
          {selectedChat && (
            <div className="flex items-center">
              <Avatar className="size-10">
                <AvatarImage
                  src={profilePic || "https://github.com/shadcn.png"}
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="ml-4 font-medium">{heading}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageHeader;  this is message section header
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import animationData from "@/animation/typing.json";
import {
  ArrowUpFromLine,
  CheckCheck,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";
import ProgressCircle from "../component/progressber";
import ImageViewer from "../component/imageViewer";

interface MessageHeaderProps {
  selectedChat: string;
  isTyping: boolean;
  isGroup: boolean;
}

const MessageComponent = ({
  selectedChat,
  isTyping,
  isGroup,
}: MessageHeaderProps) => {
  const allMssage = useSelector((state: any) => state.message.allMessages);
  const currentUserId = useSelector(
    (state: any) => state.user.currentUser?._id,
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [viewerImage, setViewerImage] = useState<string | null>(null);

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

  const defaultoption = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYmid slice",
    },
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMssage, isTyping]);

  const renderTicks = (message: any) => {
    // console.log("message component",message);

    if (message.sender._id !== currentUserId) return null;
    if (message.status == "uploading") {
      return <span className="text-gray-400 text-xs"> </span>;
    }

    // Seen (blue double tick)
    if (message.seenBy.length > 0) {
      return (
        <span className="text-blue-500">
          <CheckCheck />
        </span>
      );
    }

    // Delivered (gray double tick)
    if (message.deliveredTo && message.deliveredTo.length > 0) {
      console.log(message._id, message.deliveredTo);
      return (
        <span className="text-gray-300">
          <CheckCheck />
        </span>
      );
    }

    // Sent (single tick)
    return (
      <span className="text-gray-300">
        <CheckIcon />
      </span>
    );
  };
  return (
  <div className="messagesectio flex-1 w-full bg-slate-800 overflow-hidden">
    
    <div
      className=" h-full w-full 
        overflow-y-auto 
        overscroll-contain
        scroll-smooth 
        p-2 md:p-6 
        pb-[max(80px,env(safe-area-inset-bottom))]
      
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
                              (message.sender.name.charCodeAt(0) * 137) % 360
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
                          <div className="relative">
                            <img
                              src={message.image}
                              alt="sent"
                              onClick={() => setViewerImage(message.image)}
                              className="cursor-pointer object-cover max-w-[260px] max-h-[300px] w-full h-auto rounded-lg"
                              onLoad={() => {
                                messagesEndRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }}
                            />
                            {message.status == "uploading" && (
                              <div className="w-full h-full bg-black/50 backdrop-blur-md absolute top-0 left-0 flex items-center justify-center">
                                <ProgressCircle
                                  progress={message.progress || 0}
                                />
                              </div>
                            )}
                            {message.status == "failed" && (
                              <div className="w-full h-full bg-black/50 backdrop-blur-md absolute top-0 left-0 flex items-center justify-center">
                                <ArrowUpFromLine />
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="break-words">{message.content}</p>
                        )}
                      </div>
                    </span>
                    <span
                      className={`text-[10px]  self-end mt-1 ml-3 ${
                        isSender ? "text-slate-300" : "text-slate-500"
                      } flex items-center justify-end gap-1`}
                    >
                      <p className="text-center">
                        {formateTime(message.createdAt)}
                      </p>
                      <span>{renderTicks(message)}</span>
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
            </div>
          </div>
        ) : (
          ""
        )}
        <div ref={messagesEndRef} className="h-6 w-full"></div>
      </div>
      {viewerImage && (
        <ImageViewer
          imageUrl={viewerImage}
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  );
};

export default MessageComponent; this is the message component where message shows
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
 this is the message footer, there has a input component for write message
i want this chat component work as your provided demo chat code. i mean header not moved up when click on the input section. 