import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { signout } from "@/store/reducer";
import { useRouter } from "next/navigation";
interface UserDrawerProps {
  signOutDrawer: boolean;
  setSignOutDrawer: (open: boolean) => void;
}

function SignOut({ signOutDrawer, setSignOutDrawer }: UserDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: any) => state.userChat.currentUser);
  const router = useRouter();
  const handelSignOut = () => {
    localStorage.removeItem("currentUser");
    dispatch(signout());
    router.push("/");
  };
  return (
    <React.Fragment>
      <Drawer
        open={signOutDrawer}
        onOpenChange={setSignOutDrawer}
        direction="left"
      >
        <DrawerContent className="bg-gray-400">
          <DrawerHeader>
            <DrawerClose className="absolute right-4 top-4 text-2xl cursor-pointer">
              &times;
            </DrawerClose>
          </DrawerHeader>

          <div className="profile w-full h-1/3  p-2 box-border flex items-center justify-center  ">
            <div
              className="profile_pic w-[150px] h-[150px] bg-gray-300 drop-shadow-gray-600 drop-shadow-2xl border-b-4 border-b-blue-300 border-t-4 border-blue-400"
              style={{
                borderRadius: "50%",
                backgroundImage: `url(${currentUser?.pic})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
          <div className="w-full h-10 flex items-center justify-center flex-col ">
            <DrawerTitle className="text-lg text-gray-900">
              {currentUser?.name.toUpperCase()}
            </DrawerTitle>
            <DrawerTitle className="text-md text-gray-900">
              {currentUser?.email}
            </DrawerTitle>
          </div>

              <DrawerClose>
          <div className="w-full h-10 mt-6 flex items-center justify-center">
            <Button className=" w-[50%]" onClick={handelSignOut} type="button">
              Sign Out
              <LogOut />
            </Button>
          </div>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}

export default SignOut;
