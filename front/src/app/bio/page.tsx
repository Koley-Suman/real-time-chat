"use client";
import React, { useState } from "react";
import PhotoUpload from "./userPhoto";
import { Button } from "@/components/ui/button";
import "./bio.css";
import { useDispatch, useSelector } from "react-redux";
import { uploadPic } from "@/store/user_reducer/userThank";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const Bio = () => {
  const [pic, setPic] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const loading = useSelector((state: any) => state.user.loading);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const upload_pic_bio = async () => {
    if (pic) {
      try {
        await dispatch(uploadPic({ pic, bio })).unwrap();
        router.replace("chat");
      } catch (error: any) {
        console.log(error.message);
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("Please upload a photo before proceeding.");
    }
  };

  return (
    <div className="h-screen w-screen bio">
      <div className="h-[80vh] w-screen flex justify-center items-center box-border p-6">
        <div className="h-[60%] w-full flex flex-col items-center justify-between">
          <PhotoUpload setPic={setPic} />
          <p style={{ color: "red" }}>
            {errorMessage?.length > 0 ? (
              errorMessage
            ) : (
              <span style={{ color: "transparent" }}>error message</span>
            )}
          </p>
          <input
            type="text"
            placeholder="Write Your Bio "
            id="bio"
            className="bio_input p-3"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
          />
          {loading ? (
            <Button
            disabled
              className="w-full p-6 "
              style={{ backgroundColor: "#7C3AED" }}
              onClick={upload_pic_bio}
            >
              <Loader2Icon className="animate-spin" />
            </Button>
          ) : (
            <Button
              className="w-full p-6 "
              style={{ backgroundColor: "#7C3AED" }}
              onClick={upload_pic_bio}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bio;
