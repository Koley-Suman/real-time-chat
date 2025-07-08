import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
 
} from "@/components/ui/drawer";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,

  PlusIcon,

  TrashIcon,
} from "lucide-react";
import { AppDispatch } from "@/store/store";
import { addtoGroup, removeTogroup } from "@/store/reducer";

interface UserDrawerProps {
  drawerOpen: boolean;
  drawerDatas: any;
  setDrawerOpen: (open: boolean) => void;
}

function UserDrawer({
  drawerOpen,
  drawerDatas,
  setDrawerOpen,
}: UserDrawerProps) {
  const [addMember, setAddMember] = useState(false);
  const [select, setSelect] = useState([]);
  const [drawerData, setDrawerData] = useState(drawerDatas);
  const allchat = useSelector((state: any) => state.userChat.allChat);
  const singleChat = allchat.filter((chat: any) => chat.isGroupChat == false);
  const currentUserId = useSelector(
    (state: any) => state.userChat.currentUser?._id
  );
  const others = singleChat.map((item: any) =>
    item.users.find((user: any) => user._id != currentUserId)
  );
  const groupUserIds = drawerData?.users.map((u: any) => u._id) || [];
  const notInGroup = others.filter(
    (item: any) => !groupUserIds?.includes(item._id)
  );

  const nextUser = !drawerData?.isGroupChat
  ? drawerData?.users.find((u: any) => u._id !== currentUserId)
  : null;
  
  

  const dispatch = useDispatch<AppDispatch>();

  // reload page when data is appear----------------------
  useEffect(() => {
    setDrawerData(drawerDatas);
  }, [drawerDatas]);

  // useeffect fot when new user add or update this group-----------------------
  useEffect(() => {
    if (!drawerData?._id) return;
    const updated = allchat.find((chat: any) => chat._id === drawerData._id);
    if (updated) {
      setDrawerData(updated);
    }
  }, [allchat, drawerData?._id, setDrawerData]);

  // select the member--------------------------
  const selectedChatId = (id: any) => {
    setSelect((prev: any) =>
      prev.includes(id)
        ? prev.filter((userId: any) => userId !== id)
        : [...prev, id]
    );
  };

  // add new member---------------
  const addMemberHandeler = async () => {
    try {
      await dispatch(addtoGroup({ chatId: drawerData._id, users: select }));
      setAddMember(false);
      setSelect([]);
    } catch (error: any) {
      console.error("not add user", error.message);
    }
  };

  // remove user from group---------
  const removeuser = (id: any) => {
    dispatch(removeTogroup({ chatId: drawerData._id, userId: id }));
  };
  return (
    <React.Fragment>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="!w-screen md:!w-[24rem] h-full ml-auto bg-gray-800 text-gray-100 border-none !max-w-none fixed right-0 top-0">
          <DrawerHeader>
            {/* <DrawerTitle>
        {drawerData?.isGroupChat ? "Group Details" : "User Details"}
      </DrawerTitle> */}
            <DrawerClose className="absolute right-4 top-4 text-2xl cursor-pointer">
              &times;
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4  box-border h-full">
            <div className="profile w-full h-[30%]  p-2 box-border flex items-center justify-center ">
              <div
                className="profile_pic w-[150px] h-[150px] bg-gray-300 drop-shadow-2xl"
                style={{ borderRadius: "50%",backgroundImage:`url(${drawerData?.isGroupChat?drawerData?.groupPic:nextUser?.pic})`, backgroundPosition:"center",backgroundSize:"cover",backgroundRepeat:"no-repeat"}}
              ></div>
            </div>
            {drawerData?.isGroupChat ? (
              <>
                <DrawerTitle className="text-xl flex justify-center">
                  <p className="text-gray-100">{drawerData.chatName}</p>
                </DrawerTitle>
                {/* <p><b>Name:</b> {drawerData.chatName}</p> */}
                <DrawerTitle className="mt-2 mb-1 text-gray-100">
                  {" "}
                  Group Members:
                </DrawerTitle>
                <div className="member h-[50%]  overflow-auto mb-2 p-2 box-border">
                  {!addMember ? (
                    <React.Fragment>
                      <div
                        key={`chat-${drawerData?.groupAdmin._id}`}
                        className="contacts w-full h-[20%] p-4 bg-gray-800 hover:bg-gray-700 flex items-center "
                      >
                        <span className="h-full w-[80%] flex items-center">
                          <Avatar>
                            <AvatarImage
                               src={drawerData?.groupAdmin.pic || "https://github.com/shadcn.png"}
                              alt={drawerData?.groupAdmin.name}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <span className="ml-5">
                            {drawerData.groupAdmin.name}
                          </span>
                        </span>
                        <span className="h-full w-[20%] flex items-center justify-center">
                          <span className="px-3 py-1 rounded-xl bg-grat-800 text-green-600 text-xs font-semibold border border-green-600">
                            admin
                          </span>
                        </span>
                      </div>
                      {drawerData.users.map(
                        (user: any) =>
                          user._id !== drawerData.groupAdmin._id && (
                            <div
                              key={`chat-${user._id}`}
                              className="contacts w-full h-[20%] px-3 bg-gray-800 flex items-center hover:bg-gray-700  "
                            >
                              <span className="h-full w-[80%] flex items-center">
                                <Avatar>
                                  <AvatarImage
                                    src={user.pic || "https://github.com/shadcn.png"}
                                    alt={user.name}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <span className="ml-5">{user.name}</span>
                              </span>
                              <span className="h-full w-[20%] flex items-center justify-center">
                                <div
                                  className="h-[80%] w-[80%] rounded hover:bg-gray-600 cursor-pointer flex items-center justify-center transition-all duration-200 ease-in"
                                  style={{ borderRadius: "50%" }}
                                >
                                  <TrashIcon
                                    className={`w-4 h-4 text-red-500  ${
                                      drawerData.groupAdmin._id ===
                                      currentUserId
                                        ? "block"
                                        : "hidden"
                                    }`}
                                    onClick={() => removeuser(user._id)}
                                  />
                                </div>
                              </span>
                            </div>
                          )
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {notInGroup.length === 0 ? (
                        <p className="text-xs text-gray-500">
                          No users available to add.
                        </p>
                      ) : (
                        notInGroup.map((user: any) => (
                          <div
                            key={`chat-${user._id}`}
                            className={`contacts w-full h-[20%] p-4 bg-gray-800 hover:bg-gray-700 flex mb-1 items-center cursor-pointer ${
                              select.some((e: any) => e == user._id)
                                ? "border-2 border-green-600"
                                : " border-2 border-gray-800"
                            }`}
                            onClick={() => selectedChatId(user._id)}
                          >
                            <span className="h-full w-[80%] flex items-center">
                              <Avatar>
                                <AvatarImage
                                  src={user.pic || "https://github.com/shadcn.png"}
                                  alt={user.name}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <span className="ml-5">{user.name}</span>
                            </span>
                            <span className="h-full w-[20%] flex items-center justify-center">
                              <CheckIcon
                                className={`${
                                  select.some((e: any) => e == user._id)
                                    ? "block"
                                    : "hidden"
                                } text-green-600`}
                              />
                            </span>
                          </div>
                        ))
                      )}
                    </React.Fragment>
                  )}
                </div>

                {!addMember ? (
                  <Button
                    className="w-full cursor-pointer"
                    onClick={() => setAddMember(true)}
                  >
                    <PlusIcon />
                    Add Member
                  </Button>
                ) : (
                  <div className="w-full flex  box-border justify-between">
                    <Button
                      className="w-[48%] cursor-pointer"
                      variant="secondary"
                      onClick={() => setAddMember(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-[48%] cursor-pointer"
                      onClick={addMemberHandeler}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <>
                  {drawerData?.users.map((u: any) =>
                    u._id !== currentUserId ? (
                      <div key={u._id} className="w-full h-15 flex flex-col items-center">
                        <DrawerTitle className="text-gray-100 text-2xl">{u.name}</DrawerTitle>
                        <p>{u.email}</p>
                      </div>
                    ) : null
                  )}
                </>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}

export default UserDrawer;
