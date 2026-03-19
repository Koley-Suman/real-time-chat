"use client";

import React, { useEffect, useRef, useState } from "react";
import { CameraIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PhotoUploadProps {
  setPic: (pic: File | null) => void;
  resetkey?: number;
  defaultImage?: string; // optional image from props
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  setPic,
  resetkey,
  defaultImage,
}) => {

  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (selected) {
      const previewUrl = URL.createObjectURL(selected);

      setPreview(previewUrl);
      setPic(selected);
    }
  };

  useEffect(() => {
    setPreview(null);
    setPic(null);
  }, [resetkey, setPic]);

  const displayImage = preview || defaultImage;

  return (
    <div className="flex flex-col items-center p-2 w-full">

      <div className="relative">

        <div className="w-40 h-40 rounded-full overflow-hidden border-none">

          {displayImage ? (
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-gray-200"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              No Image
            </div>
          )}

        </div>

        {/* Camera Icon */}
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