"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon, PlusIcon, SearchIcon } from "lucide-react";
import GroupContacts from "./groupContacts";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { createNewGroup } from "@/store/chat_reducer/chatThank";
import PhotoUpload from "../bio/userPhoto";
import "./chat.css";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function DialogDemo({ open, setOpen }: Props) {
  const [selectedChatId, setSelectedChatId] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [resetPhotoKey, setResetPhotoKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("id", selectedChatId);
  }, [selectedChatId]);

  const createGroup = async (e:any) => {
    setLoading(true);
    e.preventDefault();
    if (!groupName || selectedChatId.length < 2 || !pic) {
      setErrorMessage(
        "enter group name, group photo and select group member minimum two",
      );
      setLoading(false);
      return;
    }

    try {
      await dispatch(
        createNewGroup({
          name: groupName,
          users: selectedChatId,
          groupPic: pic,
        }),
      );
      console.log("group create successful");
      setSelectedChatId([]);
      setGroupName("");
      setResetPhotoKey((prev) => prev + 1);
      setPic(null);
      setLoading(false);
      setOpen(false);
    } catch (error: any) {
      console.error("error message:", error.message);
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full h-full max-w-full max-h-full rounded-none background text-gray-100 border-0 md:max-w-[550px] md:h-[650px] md:rounded-lg p-0 flex flex-col">
        <form className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-6 flex flex-col items-center gap-4 border-b border-gray-600">
            <DialogTitle>Create New Group</DialogTitle>

            <PhotoUpload setPic={setPic} resetkey={resetPhotoKey} />
            <div className="search mb-2 h-[45px] w-full px-4 input_background_color rounded-xl flex items-center justify-between ">
              <SearchIcon style={{ color: "#5a5a5a" }} />
              <Input
                placeholder="search for chat"
                className="w-full mr-3 border-none input_color"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
            </div>

            {/* <Input
          placeholder="Enter group name"
          className="input_background_color border-none text-gray-100"
          onChange={(e) => setGroupName(e.target.value)}
          value={groupName}
        /> */}
          </div>

          {/* BODY (SCROLL AREA) */}
          <div className="flex flex-col overflow-y-auto p-4 gap-2">
            {errorMessage && (
              <p className="text-red-400 mb-2">{errorMessage}</p>
            )}

            <GroupContacts
              setSelectedChatId={setSelectedChatId}
              selectedChatId={selectedChatId}
            />
          </div>

          {/* FOOTER */}
          <DialogFooter className="p-4 border-t border-gray-600 w-full flex flex-row justify-center">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="text-gray-200 cursor-pointer w-28"
                onClick={() => {
                  setGroupName("");
                  setSelectedChatId([]);
                  setPic(null);
                  setResetPhotoKey((prev) => prev + 1);
                  setErrorMessage("");
                }}
              >
                Cancel
              </Button>
            </DialogClose>
                {loading ? (
              <Button disabled className="cursor-not-allowed w-28" style={{ backgroundColor: "#7C3AED" }}>
                Create
                <Loader2Icon className="animate-spin"/>
              </Button>
            ) : ( 
            <Button type="submit" onClick={createGroup} className="cursor-pointer w-28" style={{ backgroundColor: "#7C3AED" }}>
              Create
            </Button>)}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
