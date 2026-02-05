const ImagePreview = ({ title, src }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 px-6 py-2 bg-linear-to-r from-gray-100 to-gray-200 rounded-full">
        <p className="font-bold text-gray-800 text-lg">{title}</p>
      </div>
      <div className="border-4 border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src={src} 
          alt={title}
          className="w-full max-w-md h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
