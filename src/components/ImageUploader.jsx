import { useCallback } from "react";

const ImageUploader = ({ onSelect }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onSelect(file);
    }
  }, [onSelect]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-3">Upload Your Image</p>
        <p className="text-gray-600 mb-6 max-w-md">
          Drag & drop your photo here or click to browse. We support JPG, PNG, and WebP formats.
        </p>
        <label className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl cursor-pointer inline-block transition-all duration-300 transform hover:scale-105 shadow-md">
          Choose File
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
        <p className="text-gray-500 text-sm mt-6">Maximum file size: 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
