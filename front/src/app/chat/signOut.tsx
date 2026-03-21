import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Loader2Icon, LogOut, Pencil } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { signout } from "@/store/user_reducer/userSlice";
import { useRouter } from "next/navigation";
import PhotoUpload from "../bio/userPhoto";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/store/user_reducer/userThank";

interface UserDrawerProps {
  signOutDrawer: boolean;
  setSignOutDrawer: (open: boolean) => void;
}

function SignOut({ signOutDrawer, setSignOutDrawer }: UserDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [pic, setPic] = useState<File | null>(null);
  const [saveLOading, setSaveLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    pic: currentUser?.pic || "",
  });

  const handelSignOut = () => {
    localStorage.removeItem("currentUser");
    dispatch(signout());
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {

      const payload = {
        name: formData.name,
        bio: formData.bio,
        pic: pic || formData.pic,
      };

      await dispatch(updateProfile(payload)).unwrap();
      setSaveLoading(false);

      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update failed:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        pic: currentUser.pic || "",
      });
    }
  }, [currentUser]);

  return (
    <Drawer open={signOutDrawer} onOpenChange={setSignOutDrawer} direction="left">
      <DrawerContent className="background !w-screen md:!w-[24rem] h-full ml-auto bg-gray-800 text-gray-100 border-none !max-w-none fixed left-0 top-0">

        {/* HEADER */}
        <DrawerHeader className="border-b border-gray-700">
          <DrawerTitle className="text-lg font-semibold">
            Profile
          </DrawerTitle>

          <DrawerClose
            className="absolute right-4 top-4 text-2xl cursor-pointer"
            asChild
          >
            &times;
          </DrawerClose>
        </DrawerHeader>

        {/* PROFILE SECTION */}
        <div className="flex flex-col items-center gap-4 mt-6 px-4 w-full">

          {/* PROFILE IMAGE */}
          {isEditing ? (
            <PhotoUpload setPic={setPic} defaultImage={formData.pic} />
          ) : (
            <div
              className="w-[120px] h-[120px] rounded-full border-4 border-blue-400"
              style={{
                backgroundImage: `url(${formData.pic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {/* EDIT BUTTON */}
          {!isEditing && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* USER INFO */}
        <div className="flex flex-col items-center gap-3 mt-6 px-6">

          {isEditing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="input_background_color border-none"
            />
          ) : (
            <h2 className="text-lg font-semibold">
              {currentUser?.name?.toUpperCase()}
            </h2>
          )}

          <p className="text-sm text-gray-400">{currentUser?.email}</p>

          {isEditing ? (
            <Input
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="input_background_color border-none"
            />
          ) : (
            <p className="text-sm text-gray-300 text-center">
              {currentUser?.bio}
            </p>
          )}
        </div>

        {/* EDIT ACTION BUTTONS */}
        {isEditing && (
          <div className="flex gap-3 mt-6 px-6 cursor-pointer">
            <Button className="flex-1" onClick={handleSave} style={{ backgroundColor: "#7C3AED" }}>
              {saveLOading ? (<Loader2Icon className="animate-spin" />) : "Save"}

            </Button>

            <Button
              variant="secondary"
              className="flex-1 cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* SIGN OUT SECTION */}
        <div className="mt-auto px-6 pb-6">
  <DrawerClose asChild>
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handelSignOut}
    >
      <LogOut size={18} />
      Sign Out
    </Button>
  </DrawerClose>
</div>

      </DrawerContent>
    </Drawer>
  );
}

export default SignOut;