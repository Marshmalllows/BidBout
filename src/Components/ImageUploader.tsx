import React, { useState } from "react";

export default function ImageUploader() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList) => {
    const newPreviews: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        setError("You only can upload images!");
      } else {
        newPreviews.push(URL.createObjectURL(file));
      }
    }
    if (newPreviews.length > 0) {
      setPreviews((prev) => [...prev, ...newPreviews]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative bg-white p-2 shadow border border-gray-300"
            >
              <img
                src={src}
                alt={`Preview ${i}`}
                className="w-80 h-60 object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-4 right-4 w-7 h-7 text-white/80 hover:text-white bg-black/30 transition-all
                hover:bg-black/50 rounded-sm p-px"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div
        className="border-2 border-dashed border-gray-400 rounded-md p-8 w-full min-h-40 flex flex-col items-center justify-center
          text-gray-500 cursor-pointer hover:bg-gray-100 transition relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="mb-3">Drag and drop images here or</p>
        <label
          htmlFor="fileInput"
          className="border border-gray-400 py-3 px-3 bg-white text-sm sm:text-base text-black shadow-sm
          hover:bg-gray-200 hover:border-gray-500 transition cursor-pointer"
        >
          Choose files
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
