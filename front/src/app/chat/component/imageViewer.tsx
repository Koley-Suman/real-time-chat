import React from "react";
import { X, Download } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageViewer = ({ imageUrl, onClose }: ImageViewerProps) => {

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

      {/* Top Buttons */}
      <div className="absolute top-5 right-5 flex gap-4 text-white">

        <button
          onClick={handleDownload}
          className="hover:text-violet-400"
        >
          <Download size={28} />
        </button>

        <button
          onClick={onClose}
          className="hover:text-red-400"
        >
          <X size={30} />
        </button>

      </div>

      {/* Image */}
      <img
        src={imageUrl}
        alt="viewer"
        className="max-h-[90%] max-w-[90%] object-contain rounded-lg"
      />

    </div>
  );
};

export default ImageViewer;