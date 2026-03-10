import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ImagePreview from "../components/ImagePreview";
import Loader from "../components/Loader";
import ImageProcessingEngine from "../api/ImageProcessingEngine";

const Home = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enhancementTime, setEnhancementTime] = useState(null);
  const [aesthetic, setAesthetic] = useState(null);
  const [progress, setProgress] = useState(0);

  const [options, setOptions] = useState({
    autoBackground: true,
    lighting: true,
    composition: true,
    colors: true,
    sharpness: true,
    backgroundChange: true,
    backgroundType: "aesthetic",
    backgroundIntensity: 70,
  });

  const handleSelect = (image) => {
    setFile(image);
    setPreview(URL.createObjectURL(image));
    setResult(null);
    setAesthetic(null);
  };

  const handleEnhance = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(0);
    const startTime = Date.now();

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 85));
      }, 300);

      const result = await ImageProcessingEngine.processImage(file, options);

      clearInterval(progressInterval);
      setProgress(95);

      setResult(result.dataUrl);
      setAesthetic(result.analysis);

      const endTime = Date.now();
      setEnhancementTime(endTime - startTime);
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Enhancement error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            ✨ Photomonix
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Image Enhancement with Intelligent Background Replacement
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Upload Section */}
            {!file && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Upload Your Image</h2>
                <ImageUploader onSelect={handleSelect} />
              </div>
            )}

            {/* Aesthetic Info */}
            {aesthetic && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                <h3 className="font-bold text-blue-900 mb-3">🎨 Image Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-semibold">Brightness</p>
                    <p className="text-blue-600">{Math.round(aesthetic.avgBrightness * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Saturation</p>
                    <p className="text-blue-600">{Math.round(aesthetic.avgSaturation * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Color Temp</p>
                    <p className="text-blue-600 capitalize">{aesthetic.colorTemp}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Dominant Color</p>
                    <div
                      className="w-8 h-8 rounded border-2 border-blue-300"
                      style={{
                        backgroundColor: `rgb(${aesthetic.dominantColor.r},${aesthetic.dominantColor.g},${aesthetic.dominantColor.b})`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Section */}
            {preview && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Preview</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 flex flex-col items-center">
                    <ImagePreview title="Original" src={preview} />
                    <p className="text-gray-600 mt-3">Original Image</p>
                  </div>
                  {result && (
                    <div className="flex-1 flex flex-col items-center">
                      <ImagePreview title="Enhanced" src={result} />
                      <p className="text-gray-600 mt-3">Enhanced with AI</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings */}
            {file && !loading && !result && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Enhance Settings</h2>

                {/* Auto Background */}
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">🤖 Auto Background</h3>
                      <p className="text-purple-700 text-sm mt-1">Automatically select matching background</p>
                    </div>
                    <label className="relative cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.autoBackground}
                        onChange={(e) =>
                          setOptions((prev) => ({
                            ...prev,
                            autoBackground: e.target.checked,
                            backgroundChange: e.target.checked,
                          }))
                        }
                        className="hidden"
                      />
                      <div
                        className={`w-14 h-8 rounded-full transition-colors ${
                          options.autoBackground
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                          options.autoBackground ? 'translate-x-6' : ''
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>

                {/* Enhancement Options */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Enhancement Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'lighting', label: 'Lighting', icon: '☀️', desc: 'Brightness' },
                      { key: 'colors', label: 'Colors', icon: '🌈', desc: 'Saturation' },
                      { key: 'sharpness', label: 'Sharpness', icon: '🔍', desc: 'Details' },
                      { key: 'composition', label: 'Contrast', icon: '🎨', desc: 'Definition' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() =>
                          setOptions((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          options[item.key]
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className="font-bold text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Intensity */}
                <div className="mb-12">
                  <label className="block font-bold text-gray-800 mb-4">
                    Background Intensity: {options.backgroundIntensity}%
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={options.backgroundIntensity}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          backgroundIntensity: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1 h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 w-12">Subtle</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleEnhance}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all disabled:opacity-50 shadow-lg"
                >
                  ✨ Generate Enhanced Image
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="py-16 text-center">
                <Loader />
                <div className="mt-8 max-w-sm mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600 font-semibold">{progress}% Complete</p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="border-t-2 border-gray-200 pt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">✅ Enhancement Complete!</h2>
                
                {enhancementTime && (
                  <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
                    <p className="text-green-800 font-bold">
                      Processed in {enhancementTime}ms
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <a
                    href={result}
                    download="photomonix-enhanced.png"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all text-center"
                  >
                    📥 Download Image
                  </a>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setResult(null);
                      setAesthetic(null);
                      setEnhancementTime(null);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-2xl transition-all"
                  >
                    🔄 Start New
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 text-center">
            <p className="font-semibold">© 2024 Photomonix</p>
            <p className="text-gray-400 text-sm mt-2">Advanced AI Image Enhancement & Background Replacement</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;