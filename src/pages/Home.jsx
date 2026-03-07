import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ImagePreview from "../components/ImagePreview";
import Loader from "../components/Loader";
import GeminiEnhancedProcessor from "../api/GeminiEnhancedProcessor";

const Home = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enhancementTime, setEnhancementTime] = useState(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const handleSelect = (image) => {
    setFile(image);
    setPreview(URL.createObjectURL(image));
    setResult(null);
    setGeminiAnalysis(null);
  };

  const handleEnhance = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setProgressMessage("Initializing...");
    const startTime = Date.now();

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 10;
          if (prev < 60) return prev + 5;
          return Math.min(prev + 3, 95);
        });
      }, 500);

      setProgressMessage("🤖 Analyzing with Gemini...");
      setProgress(10);

      setProgressMessage("🎨 Removing background...");
      setProgress(30);

      setProgressMessage("🖼️ Applying background image...");
      setProgress(50);

      setProgressMessage("✨ Enhancing image...");
      setProgress(70);

      const result = await GeminiEnhancedProcessor.processImage(file);

      clearInterval(progressInterval);
      setProgress(95);
      setProgressMessage("🎉 Finalizing...");

      setResult(result.dataUrl);
      setGeminiAnalysis(result.geminiAnalysis);

      const endTime = Date.now();
      setEnhancementTime(endTime - startTime);
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
        setProgressMessage("");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      alert("Processing failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ✨ Photomonix AI
          </h1>
          <p className="text-gray-600 text-lg">
            Powered by Google Gemini - Smart Image Enhancement & Background Replacement
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-12">
            {/* Upload */}
            {!file && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Upload Image</h2>
                <ImageUploader onSelect={handleSelect} />
              </div>
            )}

            {/* Gemini Analysis */}
            {geminiAnalysis && (
              <div className="mb-8 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-2xl">
                <h3 className="font-bold text-blue-900 mb-6 text-2xl">🤖 Gemini AI Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-blue-600 font-semibold">Main Object</p>
                    <p className="text-blue-900 font-bold text-lg capitalize">
                      {geminiAnalysis.object}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-blue-600 font-semibold">Object Type</p>
                    <p className="text-blue-900 font-bold text-lg capitalize">
                      {geminiAnalysis.objectType}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-blue-600 font-semibold">Suggested Background</p>
                    <p className="text-blue-900 font-bold text-lg capitalize">
                      {geminiAnalysis.bestBackground.replace(/-/g, " ")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-blue-600 font-semibold">Mood</p>
                    <p className="text-blue-900 font-bold text-lg capitalize">
                      {geminiAnalysis.mood}
                    </p>
                  </div>
                  <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-blue-600 font-semibold mb-2">Enhancements Applied</p>
                    <div className="flex flex-wrap gap-2">
                      {geminiAnalysis.enhancements.map((enh, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                        >
                          ✓ {enh}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-blue-600 font-semibold mb-2">Background Description</p>
                    <p className="text-blue-900">{geminiAnalysis.backgroundDescription}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Preview</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <ImagePreview title="Original" src={preview} />
                  </div>
                  {result && (
                    <div className="flex-1">
                      <ImagePreview title="AI Enhanced" src={result} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhance Button */}
            {file && !loading && !result && (
              <div className="text-center">
                <button
                  onClick={handleEnhance}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-5 px-16 rounded-2xl text-xl transition-all shadow-xl"
                >
                  🚀 Enhance with Gemini AI
                </button>
                <p className="text-gray-600 mt-4 text-sm">
                  Our AI will analyze your image, suggest the best background, and apply smart enhancements
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="py-16 text-center">
                <Loader />
                <div className="mt-8 max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4 shadow-md">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700 font-bold text-lg">{progressMessage}</p>
                  <p className="text-gray-600 mt-2">{progress}% Complete</p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="border-t-2 border-gray-200 pt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">✅ Enhancement Complete!</h2>

                {enhancementTime && (
                  <div className="mb-8 p-6 bg-green-50 border-2 border-green-300 rounded-2xl">
                    <p className="text-green-800 font-bold text-lg">
                      ⚡ Processed in {enhancementTime}ms
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={result}
                    download="photomonix-enhanced.png"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all text-center text-lg shadow-lg"
                  >
                    📥 Download Image
                  </a>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setResult(null);
                      setGeminiAnalysis(null);
                      setEnhancementTime(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all text-lg"
                  >
                    🔄 Process Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 text-center">
            <p className="font-semibold text-lg">© 2024 Photomonix AI</p>
            <p className="text-gray-400 text-sm mt-2">
              Powered by Google Gemini • Advanced AI Image Enhancement • Smart Background Replacement
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;