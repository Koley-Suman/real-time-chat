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
import { PlusIcon } from "lucide-react";
import GroupContacts from "./groupContacts";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { createNewGroup } from "@/store/reducer";
import PhotoUpload from "../signUp/userPhoto";

export function DialogDemo() {
  const [selectedChatId, setSelectedChatId] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [resetPhotoKey, setResetPhotoKey] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("id", selectedChatId);
  }, [selectedChatId]);

  const createGroup = async () => {
    if (!groupName || selectedChatId.length < 1) {
      console.log("enter group name and select group member");
    }
    if (selectedChatId.length < 1) return;
    try {
      await dispatch(
        createNewGroup({
          name: groupName,
          users: selectedChatId,
          groupPic: pic,
        })
      );
      console.log("group create successful");
      setSelectedChatId([]);
      setGroupName("");
      setResetPhotoKey(prev=>prev+1);
      setPic(null);
    } catch (error: any) {
      console.error("error message:", error.message);
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <PlusIcon />
            New group
          </Button>
        </DialogTrigger>
        <DialogContent className="fixed w-full h-full max-w-full max-h-full rounded-none md:bg-gray-700 bg-gray-800 text-gray-100 border-0 md:max-w-[425px] md:h-[550px] md:rounded-lg py-9">
          <div className="flex flex-col h-[40%] justify-between">
            <DialogTitle>Create New Group</DialogTitle>
            <div className="top">
              <PhotoUpload setPic={setPic} resetkey={resetPhotoKey} />
              <Input
                id="name-1"
                name="name"
                placeholder="Enter group name"
                className="border drop-shadow-2xl bg-gray-600 border-none text-gray-100"
                onChange={(e: any) => setGroupName(e.target.value)}
                value={groupName}
              />
            </div>
          </div>
          <div className="md:h-[230px] h-full   overflow-auto p-3 box-border">
            <GroupContacts
              setSelectedChatId={setSelectedChatId}
              selectedChatId={selectedChatId}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="text-black"
                onClick={() => {
                  setGroupName("");
                  setSelectedChatId([]);
                  setPic(null);
                  setResetPhotoKey((prev) => prev + 1); // Trigger reset
                }}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" onClick={createGroup}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
