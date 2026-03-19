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
  const updateHeight = () => {
    const vh = window.visualViewport?.height;
    if (vh) {
      document.documentElement.style.setProperty(
        "--app-height",
        `${vh}px`
      );
    }
  };

  updateHeight();
  window.visualViewport?.addEventListener("resize", updateHeight);

  return () => {
    window.visualViewport?.removeEventListener("resize", updateHeight);
  };
}, []);



// // ////////////////////////////
//   useEffect(() => {
//   const updateHeight = () => {
//     const vh = window.visualViewport?.height;
//     if (vh) {
//       document.documentElement.style.setProperty(
//         "--app-height",
//         `${vh}px`
//       );
//     }
//   };

//   updateHeight();
//   window.visualViewport?.addEventListener("resize", updateHeight);

//   return () => {
//     window.visualViewport?.removeEventListener("resize", updateHeight);
//   };
// }, []);
// ------------------------------------------------

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
      dispatch(addMessage(data.payload));
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
    <div className="w-full fixed top-0 left-0 flex flex-col noto-sans-chatFont input_background_color" style={{ height: "var(--app-height)" }}>
      <div className=" w-full h-full flex drop-shadow-md background  box-border">
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
    flex flex-col w-full h-full min-h-0
    md:w-[75%]
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

export default Chat;
