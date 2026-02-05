const Loader = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-linear-to-r from-blue-500 to-purple-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-xl font-semibold text-gray-700">Processing Image...</p>
      <p className="mt-2 text-gray-500">AI is enhancing your photo</p>
    </div>
  );
};

export default Loader;