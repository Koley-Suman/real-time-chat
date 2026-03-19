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

    if (message?.sender?._id !== currentUserId) return null;
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
  <div className="messagesectio flex-1 min-h-0 w-full bg-slate-800">
    
    <div
      className=" h-full overflow-y-auto overscroll-contain
        scroll-smooth 
        p-2 md:p-6 
        
      
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
            const isSender = message?.sender?._id === currentUserId;
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
                        ? "text-gray-100 bg-violet-900"
                        : "text-slate-600 bg-gray-300"
                    }  rounded-2xl font-medium md:p-2.5 p-2 h-fit w-fit max-w-[49%] flex  justify-between`}
                  >
                    <span>
                      {isGroup && message?.sender?._id != currentUserId ? (
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

export default MessageComponent;