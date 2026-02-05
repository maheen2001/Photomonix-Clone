import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ImagePreview from "../components/ImagePreview";
import Loader from "../components/Loader";
import { enhanceImageWithHuggingFace } from "../api/HuggingFaceAPI";

const Home = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enhancementTime, setEnhancementTime] = useState(null);
  
  // Combined enhancement and background options
  const [enhancementOptions, setEnhancementOptions] = useState({
    // Enhancement options
    lighting: true,
    composition: true,
    colors: true,
    sharpness: true,
    
    // Background options
    backgroundChange: false,
    backgroundType: "studio",
    backgroundIntensity: 50,
    customBackground: "",
    
    // General
    referenceNotes: ""
  });

  const backgroundPresets = [
    { id: "studio", name: "Studio", color: "bg-gradient-to-br from-gray-100 to-gray-300", desc: "Clean professional" },
    { id: "outdoor", name: "Outdoor", color: "bg-gradient-to-br from-blue-100 to-green-100", desc: "Natural setting" },
    { id: "blur", name: "Blur", color: "bg-gradient-to-br from-purple-100 to-pink-100", desc: "Soft blurred" },
    { id: "beach", name: "Beach", color: "bg-gradient-to-br from-blue-50 to-yellow-50", desc: "Sunny beach" },
    { id: "office", name: "Office", color: "bg-gradient-to-br from-gray-200 to-blue-100", desc: "Professional office" },
    { id: "none", name: "Keep Original", color: "bg-gradient-to-br from-gray-200 to-gray-300", desc: "No background change" }
  ];

  const handleSelect = (image) => {
    setFile(image);
    setPreview(URL.createObjectURL(image));
    setResult(null);
    setEnhancementTime(null);
  };

  const handleEnhance = async () => {
    if (!file) return;
    
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const enhancedUrl = await enhanceImageWithHuggingFace(file, enhancementOptions);
      setResult(enhancedUrl);
      
      const endTime = Date.now();
      setEnhancementTime(endTime - startTime);
      
    } catch (err) {
      console.error(err);
      alert("Enhancement failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomBackground = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEnhancementOptions(prev => ({
        ...prev,
        customBackground: url,
        backgroundChange: true,
        backgroundType: "custom"
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="w-full max-w-6xl mb-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Photomonix</h1>
        <p className="text-gray-600 text-center mt-2">AI Image Enhancement with Background Replacement</p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="p-8">
          {/* Upload Section */}
          {!file && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upload Your Image</h2>
              <ImageUploader onSelect={handleSelect} />
            </div>
          )}

          {/* Preview Section */}
          {preview && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Preview</h2>
              <div className="flex flex-col md:flex-row justify-center items-start gap-8">
                <div className="flex-1">
                  <ImagePreview title="Original" src={preview} />
                  <p className="text-center text-gray-600 mt-2 text-sm">Original</p>
                </div>
                {result && (
                  <div className="flex-1">
                    <ImagePreview title="AI Enhanced" src={result} />
                    <p className="text-center text-gray-600 mt-2 text-sm">AI Enhanced</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Combined Enhancement Options */}
          {file && !loading && !result && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Enhancement Settings</h2>
              
              {/* Image Enhancement Options */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Image Enhancements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'lighting', label: 'Lighting', icon: '☀️' },
                    { key: 'composition', label: 'Composition', icon: '🎨' },
                    { key: 'colors', label: 'Colors', icon: '🌈' },
                    { key: 'sharpness', label: 'Sharpness', icon: '🔍' }
                  ].map((item) => (
                    <div 
                      key={item.key}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        enhancementOptions[item.key] ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setEnhancementOptions(prev => ({
                        ...prev, 
                        [item.key]: !prev[item.key]
                      }))}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          enhancementOptions[item.key] ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                          {enhancementOptions[item.key] && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-800">{item.label}</h4>
                      <p className="text-gray-600 text-sm">1 selected</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Background Change Options */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Background Replacement</h3>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={enhancementOptions.backgroundChange}
                        onChange={(e) => setEnhancementOptions(prev => ({
                          ...prev,
                          backgroundChange: e.target.checked
                        }))}
                      />
                      <div className={`block w-12 h-6 rounded-full ${
                        enhancementOptions.backgroundChange ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        enhancementOptions.backgroundChange ? 'transform translate-x-6' : ''
                      }`}></div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      {enhancementOptions.backgroundChange ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {enhancementOptions.backgroundChange && (
                  <>
                    {/* Background Presets */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {backgroundPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            enhancementOptions.backgroundType === preset.id 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => setEnhancementOptions(prev => ({
                            ...prev,
                            backgroundType: preset.id
                          }))}
                        >
                          <div className={`h-20 rounded-lg mb-3 ${preset.color}`}></div>
                          <h4 className="font-bold text-gray-800">{preset.name}</h4>
                          <p className="text-gray-600 text-sm">{preset.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Custom Background Upload */}
                    {enhancementOptions.backgroundType === "custom" && (
                      <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-xl">
                        <h4 className="font-semibold text-gray-700 mb-4">Upload Custom Background</h4>
                        <label className="block w-full">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                            {enhancementOptions.customBackground ? (
                              <div className="flex flex-col items-center">
                                <img 
                                  src={enhancementOptions.customBackground} 
                                  alt="Custom background" 
                                  className="h-32 w-full object-cover rounded-lg mb-4"
                                />
                                <p className="text-green-600">✓ Background uploaded</p>
                              </div>
                            ) : (
                              <>
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-600">Click to upload background image</p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCustomBackground}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* Background Intensity */}
                    <div className="mb-6">
                      <label className="block font-semibold text-gray-700 mb-3">
                        Background Blend: {enhancementOptions.backgroundIntensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={enhancementOptions.backgroundIntensity}
                        onChange={(e) => setEnhancementOptions(prev => ({
                          ...prev, 
                          backgroundIntensity: parseInt(e.target.value)
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Subtle</span>
                        <span>Natural</span>
                        <span>Strong</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Reference Notes */}
              <div className="mb-8">
                <label className="flex items-center mb-3">
                  <span className="text-gray-700 font-medium">Reference Notes (Optional)</span>
                </label>
                <textarea
                  value={enhancementOptions.referenceNotes}
                  onChange={(e) => setEnhancementOptions(prev => ({
                    ...prev,
                    referenceNotes: e.target.value
                  }))}
                  placeholder="Add any specific instructions or preferences for the AI..."
                  className="w-full border-2 border-gray-200 rounded-xl p-4 h-32 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleEnhance}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Generate Enhanced Image'}
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader />
              <p className="mt-6 text-gray-600 text-lg">Enhancing your image with AI...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
            </div>
          )}

          {/* Result Section */}
          {result && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Enhanced Result</h2>
              
              {/* Result Info Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">AI</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">AI Enhanced</h3>
                      <p className="text-gray-600">
                        {enhancementOptions.backgroundChange ? 
                          'With background replacement' : 
                          'Enhanced with selected features'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {enhancementTime && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700 font-semibold">Generated in {enhancementTime}ms</p>
                      <p className="text-gray-500 text-sm mt-1">Activate Windows</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Ready to Download</h3>
                    <p className="text-gray-600">
                      Your {enhancementOptions.backgroundChange ? 'background-changed' : 'enhanced'} image is ready
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={result}
                      download="photomonix-enhanced.png"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Image
                    </a>
                    
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setResult(null);
                        setEnhancementTime(null);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Start New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Type here to search"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">
              <p>Go to Settings to activate Windows</p>
              <p className="mt-1">© 2024 Photomonix. AI Image Enhancement Tool</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;