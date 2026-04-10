"use client";
// ============================================
// ImageUpload — Drag-and-drop image uploader
// ============================================
import { useRef, useState } from "react";

export interface ImageUploadProps {
  value?: string; // current image URL
  onChange: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    setError("");

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max size: ${maxSizeMB}MB`);
      return;
    }

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const displayUrl = preview || value;

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center hover:border-zinc-500 transition-colors cursor-pointer"
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl mb-3"
          />
        ) : (
          <div className="py-4">
            <i className="ri-upload-cloud-2-line text-4xl text-gray-600 mb-3 block" />
            <p className="text-gray-400 text-sm font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Max {maxSizeMB}MB
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
