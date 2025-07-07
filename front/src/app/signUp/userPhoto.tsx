// components/PhotoUpload.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CameraIcon, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PhotoUploadProps {
  setPic: (pic: File|null) => void;
  resetkey?: number; // define type for setPic
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({setPic,resetkey}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setPic(selected);
    }
  };

  useEffect(() => {
    setPreview(null);
    setFile(null);
    setPic(null);
  }, [resetkey]);

  return (
    <div className="flex flex-col items-center p-2 w-full">
      <div className="relative">
        <div className=" w-30 h-30 rounded-full overflow-hidden border border-gray-300">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Camera Icon Overlay */}
        <button
        type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
        >
          <CameraIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
        </button>
      </div>

      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={inputRef}
      />
    </div>
  );
};

export default PhotoUpload;
