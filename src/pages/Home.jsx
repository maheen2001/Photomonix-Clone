// import { useState } from "react";
//  import ImageUploader from "../components/ImageUploader";
// import ImagePreview from "../components/ImagePreview";
//  import Loader from "../components/Loader";
//  import { enhanceImageWithHuggingFace } from "../api/HuggingFaceAPI";
// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [enhancementTime, setEnhancementTime] = useState(null);
  
//   // Combined enhancement and background options
//   const [enhancementOptions, setEnhancementOptions] = useState({
//     // Enhancement options
//     lighting: true,
//     composition: true,
//     colors: true,
//     sharpness: true,
    
//     // Background options
//     backgroundChange: false,
//     backgroundType: "studio",
//     backgroundIntensity: 50,
//     customBackground: "",
    
//     // General
//     referenceNotes: ""
//   });

//   const backgroundPresets = [
//     { id: "studio", name: "Studio", color: "bg-gradient-to-br from-gray-100 to-gray-300", desc: "Clean professional" },
//     { id: "outdoor", name: "Outdoor", color: "bg-gradient-to-br from-blue-100 to-green-100", desc: "Natural setting" },
//     { id: "blur", name: "Blur", color: "bg-gradient-to-br from-purple-100 to-pink-100", desc: "Soft blurred" },
//     { id: "beach", name: "Beach", color: "bg-gradient-to-br from-blue-50 to-yellow-50", desc: "Sunny beach" },
//     { id: "office", name: "Office", color: "bg-gradient-to-br from-gray-200 to-blue-100", desc: "Professional office" },
//     { id: "none", name: "Keep Original", color: "bg-gradient-to-br from-gray-200 to-gray-300", desc: "No background change" }
//   ];

//   const handleSelect = (image) => {
//     setFile(image);
//     setPreview(URL.createObjectURL(image));
//     setResult(null);
//     setEnhancementTime(null);
//   };

//   const handleEnhance = async () => {
//     if (!file) return;
    
//     setLoading(true);
//     const startTime = Date.now();
    
//     try {
//       const enhancedUrl = await enhanceImageWithHuggingFace(file, enhancementOptions);
//       setResult(enhancedUrl);
      
//       const endTime = Date.now();
//       setEnhancementTime(endTime - startTime);
      
//     } catch (err) {
//       console.error(err);
//       alert("Enhancement failed: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCustomBackground = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setEnhancementOptions(prev => ({
//         ...prev,
//         customBackground: url,
//         backgroundChange: true,
//         backgroundType: "custom"
//       }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center px-4 py-8">
//       {/* Header */}
//       <header className="w-full max-w-6xl mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 text-center">Photomonix</h1>
//         <p className="text-gray-600 text-center mt-2">AI Image Enhancement with Background Replacement</p>
//       </header>

//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden">
//         <div className="p-8">
//           {/* Upload Section */}
//           {!file && (
//             <div className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upload Your Image</h2>
//               <ImageUploader onSelect={handleSelect} />
//             </div>
//           )}

//           {/* Preview Section */}
//           {preview && (
//             <div className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Preview</h2>
//               <div className="flex flex-col md:flex-row justify-center items-start gap-8">
//                 <div className="flex-1">
//                   <ImagePreview title="Original" src={preview} />
//                   <p className="text-center text-gray-600 mt-2 text-sm">Original</p>
//                 </div>
//                 {result && (
//                   <div className="flex-1">
//                     <ImagePreview title="AI Enhanced" src={result} />
//                     <p className="text-center text-gray-600 mt-2 text-sm">AI Enhanced</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Combined Enhancement Options */}
//           {file && !loading && !result && (
//             <div className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Enhancement Settings</h2>
              
//               {/* Image Enhancement Options */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Image Enhancements</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {[
//                     { key: 'lighting', label: 'Lighting', icon: '☀️' },
//                     { key: 'composition', label: 'Composition', icon: '🎨' },
//                     { key: 'colors', label: 'Colors', icon: '🌈' },
//                     { key: 'sharpness', label: 'Sharpness', icon: '🔍' }
//                   ].map((item) => (
//                     <div 
//                       key={item.key}
//                       className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
//                         enhancementOptions[item.key] ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                       }`}
//                       onClick={() => setEnhancementOptions(prev => ({
//                         ...prev, 
//                         [item.key]: !prev[item.key]
//                       }))}
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-2xl">{item.icon}</span>
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
//                           enhancementOptions[item.key] ? 'bg-blue-500' : 'bg-gray-200'
//                         }`}>
//                           {enhancementOptions[item.key] && (
//                             <span className="text-white text-sm">✓</span>
//                           )}
//                         </div>
//                       </div>
//                       <h4 className="font-bold text-gray-800">{item.label}</h4>
//                       <p className="text-gray-600 text-sm">1 selected</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Background Change Options */}
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-700">Background Replacement</h3>
//                   <label className="flex items-center cursor-pointer">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         className="sr-only"
//                         checked={enhancementOptions.backgroundChange}
//                         onChange={(e) => setEnhancementOptions(prev => ({
//                           ...prev,
//                           backgroundChange: e.target.checked
//                         }))}
//                       />
//                       <div className={`block w-12 h-6 rounded-full ${
//                         enhancementOptions.backgroundChange ? 'bg-blue-500' : 'bg-gray-300'
//                       }`}></div>
//                       <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
//                         enhancementOptions.backgroundChange ? 'transform translate-x-6' : ''
//                       }`}></div>
//                     </div>
//                     <span className="ml-3 text-gray-700">
//                       {enhancementOptions.backgroundChange ? 'Enabled' : 'Disabled'}
//                     </span>
//                   </label>
//                 </div>

//                 {enhancementOptions.backgroundChange && (
//                   <>
//                     {/* Background Presets */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                       {backgroundPresets.map((preset) => (
//                         <div
//                           key={preset.id}
//                           className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
//                             enhancementOptions.backgroundType === preset.id 
//                               ? 'border-blue-500 ring-2 ring-blue-200' 
//                               : 'border-gray-200'
//                           }`}
//                           onClick={() => setEnhancementOptions(prev => ({
//                             ...prev,
//                             backgroundType: preset.id
//                           }))}
//                         >
//                           <div className={`h-20 rounded-lg mb-3 ${preset.color}`}></div>
//                           <h4 className="font-bold text-gray-800">{preset.name}</h4>
//                           <p className="text-gray-600 text-sm">{preset.desc}</p>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Custom Background Upload */}
//                     {enhancementOptions.backgroundType === "custom" && (
//                       <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-xl">
//                         <h4 className="font-semibold text-gray-700 mb-4">Upload Custom Background</h4>
//                         <label className="block w-full">
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
//                             {enhancementOptions.customBackground ? (
//                               <div className="flex flex-col items-center">
//                                 <img 
//                                   src={enhancementOptions.customBackground} 
//                                   alt="Custom background" 
//                                   className="h-32 w-full object-cover rounded-lg mb-4"
//                                 />
//                                 <p className="text-green-600">✓ Background uploaded</p>
//                               </div>
//                             ) : (
//                               <>
//                                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 <p className="text-gray-600">Click to upload background image</p>
//                               </>
//                             )}
//                           </div>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleCustomBackground}
//                             className="hidden"
//                           />
//                         </label>
//                       </div>
//                     )}

//                     {/* Background Intensity */}
//                     <div className="mb-6">
//                       <label className="block font-semibold text-gray-700 mb-3">
//                         Background Blend: {enhancementOptions.backgroundIntensity}%
//                       </label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="100"
//                         value={enhancementOptions.backgroundIntensity}
//                         onChange={(e) => setEnhancementOptions(prev => ({
//                           ...prev, 
//                           backgroundIntensity: parseInt(e.target.value)
//                         }))}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                       />
//                       <div className="flex justify-between text-sm text-gray-500 mt-2">
//                         <span>Subtle</span>
//                         <span>Natural</span>
//                         <span>Strong</span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Reference Notes */}
//               <div className="mb-8">
//                 <label className="flex items-center mb-3">
//                   <span className="text-gray-700 font-medium">Reference Notes (Optional)</span>
//                 </label>
//                 <textarea
//                   value={enhancementOptions.referenceNotes}
//                   onChange={(e) => setEnhancementOptions(prev => ({
//                     ...prev,
//                     referenceNotes: e.target.value
//                   }))}
//                   placeholder="Add any specific instructions or preferences for the AI..."
//                   className="w-full border-2 border-gray-200 rounded-xl p-4 h-32 focus:border-blue-500 focus:outline-none resize-none"
//                 />
//               </div>

//               {/* Generate Button */}
//               <div className="text-center">
//                 <button
//                   onClick={handleEnhance}
//                   disabled={loading}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? 'Processing...' : 'Generate Enhanced Image'}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader />
//               <p className="mt-6 text-gray-600 text-lg">Enhancing your image with AI...</p>
//               <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
//             </div>
//           )}

//           {/* Result Section */}
//           {result && (
//             <div className="mt-10 pt-8 border-t border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Enhanced Result</h2>
              
//               {/* Result Info Card */}
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-xl">AI</span>
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-800 text-lg">AI Enhanced</h3>
//                       <p className="text-gray-600">
//                         {enhancementOptions.backgroundChange ? 
//                           'With background replacement' : 
//                           'Enhanced with selected features'
//                         }
//                       </p>
//                     </div>
//                   </div>
                  
//                   {enhancementTime && (
//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                       <p className="text-gray-700 font-semibold">Generated in {enhancementTime}ms</p>
//                       <p className="text-gray-500 text-sm mt-1">Activate Windows</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
//                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-lg mb-1">Ready to Download</h3>
//                     <p className="text-gray-600">
//                       Your {enhancementOptions.backgroundChange ? 'background-changed' : 'enhanced'} image is ready
//                     </p>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-4">
//                     <a
//                       href={result}
//                       download="photomonix-enhanced.png"
//                       className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                       </svg>
//                       Download Image
//                     </a>
                    
//                     <button
//                       onClick={() => {
//                         setFile(null);
//                         setPreview(null);
//                         setResult(null);
//                         setEnhancementTime(null);
//                       }}
//                       className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                       </svg>
//                       Start New
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <footer className="bg-gray-800 text-white p-6">
//           <div className="max-w-6xl mx-auto">
//             <div className="relative mb-4">
//               <input
//                 type="text"
//                 placeholder="Type here to search"
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                 🔍
//               </div>
//             </div>
//             <div className="text-center text-gray-400 text-sm">
//               <p>Go to Settings to activate Windows</p>
//               <p className="mt-1">© 2024 Photomonix. AI Image Enhancement Tool</p>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Home;
// import { useState } from "react";
// import ImageUploader from "../components/ImageUploader";
// import ImagePreview from "../components/ImagePreview";
// import Loader from "../components/Loader";
// import { enhanceImageWithAutoBackground, analyzeImageAesthetics } from "../api/HuggingFaceAPI";

// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [enhancementTime, setEnhancementTime] = useState(null);
//   const [detectedAesthetic, setDetectedAesthetic] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [progressMessage, setProgressMessage] = useState("");
  
//   // Enhanced options with auto-background
//   const [enhancementOptions, setEnhancementOptions] = useState({
//     // Auto detection
//     autoBackground: true,
    
//     // Enhancement options
//     lighting: true,
//     composition: true,
//     colors: true,
//     sharpness: true,
    
//     // Background options
//     backgroundChange: true,
//     backgroundType: "studio",
//     backgroundIntensity: 50,
//     customBackground: "",
    
//     // General
//     referenceNotes: ""
//   });

//   const handleSelect = async (image) => {
//     setFile(image);
//     setPreview(URL.createObjectURL(image));
//     setResult(null);
//     setEnhancementTime(null);
    
//     // Pre-analyze aesthetic when image is uploaded
//     try {
//       const aesthetic = await analyzeImageAesthetics(image);
//       setDetectedAesthetic(aesthetic);
//     } catch (error) {
//       console.log("Aesthetic analysis failed:", error);
//     }
//   };

//   const handleEnhance = async () => {
//     if (!file) return;
    
//     setLoading(true);
//     setProgress(0);
//     const startTime = Date.now();
    
//     try {
//       const result = await enhanceImageWithAutoBackground(
//         file,
//         enhancementOptions,
//         (prog, msg) => {
//           setProgress(prog);
//           setProgressMessage(msg);
//         }
//       );
      
//       setResult(result.url);
//       setDetectedAesthetic(result.aesthetic);
      
//       const endTime = Date.now();
//       setEnhancementTime(endTime - startTime);
      
//     } catch (err) {
//       console.error(err);
//       alert("Enhancement failed: " + err.message);
//     } finally {
//       setLoading(false);
//       setProgress(0);
//       setProgressMessage("");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center px-4 py-8">
//       {/* Header */}
//       <header className="w-full max-w-6xl mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 text-center">Photomonix</h1>
//         <p className="text-gray-600 text-center mt-2">AI Image Enhancement with Intelligent Background Replacement</p>
//       </header>

//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden">
//         <div className="p-8">
//           {/* Upload Section */}
//           {!file && (
//             <div className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upload Your Image</h2>
//               <ImageUploader onSelect={handleSelect} />
//             </div>
//           )}

//           {/* Detected Aesthetic Info */}
//           {detectedAesthetic && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//               <h3 className="font-semibold text-blue-900 mb-2">🎨 Detected Aesthetic</h3>
//               <p className="text-blue-800 text-sm">
//                 <strong>Mood:</strong> {detectedAesthetic.mood.replace(/_/g, ' ')} | 
//                 <strong> Style:</strong> {detectedAesthetic.style.replace(/_/g, ' ')} | 
//                 <strong> Color Temp:</strong> {detectedAesthetic.colorTemp} | 
//                 <strong> Confidence:</strong> {Math.round(detectedAesthetic.confidence * 100)}%
//               </p>
//             </div>
//           )}

//           {/* Preview Section */}
//           {preview && (
//             <div className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Preview</h2>
//               <div className="flex flex-col md:flex-row justify-center items-start gap-8">
//                 <div className="flex-1">
//                   <ImagePreview title="Original" src={preview} />
//                   <p className="text-center text-gray-600 mt-2 text-sm">Original</p>
//                 </div>
//                 {result && (
//                   <div className="flex-1">
//                     <ImagePreview title="AI Enhanced" src={result} />
//                     <p className="text-center text-gray-600 mt-2 text-sm">AI Enhanced with Auto Background</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Enhancement Options */}
//           {file && !loading && !result && (
//             <div className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Enhancement Settings</h2>
              
//               {/* Auto Background Toggle */}
//               <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">🤖 Intelligent Auto Background</h3>
//                     <p className="text-gray-600 text-sm mt-1">Automatically select background based on image aesthetic</p>
//                   </div>
//                   <label className="flex items-center cursor-pointer">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         className="sr-only"
//                         checked={enhancementOptions.autoBackground}
//                         onChange={(e) => setEnhancementOptions(prev => ({
//                           ...prev,
//                           autoBackground: e.target.checked,
//                           backgroundChange: e.target.checked
//                         }))}
//                       />
//                       <div className={`block w-12 h-6 rounded-full ${
//                         enhancementOptions.autoBackground ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
//                       }`}></div>
//                       <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
//                         enhancementOptions.autoBackground ? 'transform translate-x-6' : ''
//                       }`}></div>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* Image Enhancement Options */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Image Enhancements</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {[
//                     { key: 'lighting', label: 'Lighting', icon: '☀️' },
//                     { key: 'composition', label: 'Contrast', icon: '🎨' },
//                     { key: 'colors', label: 'Colors', icon: '🌈' },
//                     { key: 'sharpness', label: 'Sharpness', icon: '🔍' }
//                   ].map((item) => (
//                     <div 
//                       key={item.key}
//                       className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
//                         enhancementOptions[item.key] ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                       }`}
//                       onClick={() => setEnhancementOptions(prev => ({
//                         ...prev, 
//                         [item.key]: !prev[item.key]
//                       }))}
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-2xl">{item.icon}</span>
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
//                           enhancementOptions[item.key] ? 'bg-blue-500' : 'bg-gray-200'
//                         }`}>
//                           {enhancementOptions[item.key] && (
//                             <span className="text-white text-sm">✓</span>
//                           )}
//                         </div>
//                       </div>
//                       <h4 className="font-bold text-gray-800">{item.label}</h4>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Background Intensity */}
//               <div className="mb-8">
//                 <label className="block font-semibold text-gray-700 mb-3">
//                   Background Blend: {enhancementOptions.backgroundIntensity}%
//                 </label>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   value={enhancementOptions.backgroundIntensity}
//                   onChange={(e) => setEnhancementOptions(prev => ({
//                     ...prev, 
//                     backgroundIntensity: parseInt(e.target.value)
//                   }))}
//                   className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>

//               {/* Generate Button */}
//               <div className="text-center">
//                 <button
//                   onClick={handleEnhance}
//                   disabled={loading}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 disabled:opacity-50"
//                 >
//                   {loading ? 'Processing...' : '✨ Generate Enhanced Image'}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Loading State with Progress */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="w-full max-w-md mb-6">
//                 <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-center text-gray-700 font-semibold mt-3 text-sm">
//                   {progressMessage || 'Processing...'}
//                 </p>
//                 <p className="text-center text-gray-500 text-xs mt-1">{progress}%</p>
//               </div>
//               <Loader />
//             </div>
//           )}

//           {/* Result Section */}
//           {result && (
//             <div className="mt-10 pt-8 border-t border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-700 mb-6">Enhanced Result</h2>
              
//               {detectedAesthetic && (
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
//                   <p className="text-green-800 font-semibold mb-2">✨ Aesthetic Analysis Applied</p>
//                   <p className="text-green-700 text-sm">
//                     Background automatically selected for <strong>{detectedAesthetic.mood.replace(/_/g, ' ')}</strong> aesthetic
//                   </p>
//                 </div>
//               )}

//               {/* Download Buttons */}
//               <div className="flex flex-wrap gap-4">
//                 <a
//                   href={result}
//                   download="photomonix-enhanced.png"
//                   className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
//                 >
//                   📥 Download Image
//                 </a>
                
//                 <button
//                   onClick={() => {
//                     setFile(null);
//                     setPreview(null);
//                     setResult(null);
//                     setEnhancementTime(null);
//                     setDetectedAesthetic(null);
//                   }}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
//                 >
//                   🔄 Start New
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <footer className="bg-gray-800 text-white p-6">
//           <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
//             <p>© 2024 Photomonix - AI Image Enhancement Tool</p>
//             <p className="mt-1">Powered by HuggingFace Models & Intelligent Aesthetic Analysis</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Home;
// import { useState } from "react";
// import ImageUploader from "../components/ImageUploader";
// import ImagePreview from "../components/ImagePreview";
// import Loader from "../components/Loader";
// import SimpleImageProcessor from "../api/SimpleImageProcessor";

// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [enhancementTime, setEnhancementTime] = useState(null);
//   const [progress, setProgress] = useState(0);

//   const [options, setOptions] = useState({
//     backgroundChange: true,
//     lighting: true,
//     colors: true,
//     sharpness: true,
//     composition: true,
//   });

//   const handleSelect = (image) => {
//     setFile(image);
//     setPreview(URL.createObjectURL(image));
//     setResult(null);
//   };

//   const handleEnhance = async () => {
//     if (!file) return;

//     setLoading(true);
//     const startTime = Date.now();

//     try {
//       const progressInterval = setInterval(() => {
//         setProgress((prev) => Math.min(prev + 20, 90));
//       }, 200);

//       const processed = await SimpleImageProcessor.processImage(file, options);

//       clearInterval(progressInterval);
//       setProgress(100);
//       setResult(processed.dataUrl);

//       const endTime = Date.now();
//       setEnhancementTime(endTime - startTime);

//       setTimeout(() => setProgress(0), 1000);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Processing failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             ✨ Photomonix
//           </h1>
//           <p className="text-gray-600">AI Image Enhancement & Background Replacement</p>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           <div className="p-12">
//             {!file && (
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Upload Image</h2>
//                 <ImageUploader onSelect={handleSelect} />
//               </div>
//             )}

//             {preview && (
//               <div className="mb-12">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Preview</h2>
//                 <div className="flex flex-col md:flex-row gap-8">
//                   <div className="flex-1">
//                     <ImagePreview title="Original" src={preview} />
//                   </div>
//                   {result && (
//                     <div className="flex-1">
//                       <ImagePreview title="Enhanced" src={result} />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {file && !loading && !result && (
//               <div className="mb-12">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>

//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
//                   {[
//                     { key: 'backgroundChange', label: 'Background', icon: '🎨' },
//                     { key: 'lighting', label: 'Lighting', icon: '☀️' },
//                     { key: 'colors', label: 'Colors', icon: '🌈' },
//                     { key: 'sharpness', label: 'Sharpness', icon: '🔍' },
//                     { key: 'composition', label: 'Contrast', icon: '📐' },
//                   ].map((item) => (
//                     <button
//                       key={item.key}
//                       onClick={() =>
//                         setOptions((prev) => ({
//                           ...prev,
//                           [item.key]: !prev[item.key],
//                         }))
//                       }
//                       className={`p-4 rounded-xl border-2 transition-all ${
//                         options[item.key]
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="text-2xl mb-2">{item.icon}</div>
//                       <p className="text-sm font-bold">{item.label}</p>
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   onClick={handleEnhance}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg transition-all"
//                 >
//                   ✨ Process Image
//                 </button>
//               </div>
//             )}

//             {loading && (
//               <div className="py-16 text-center">
//                 <Loader />
//                 <div className="mt-8 w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-gray-600 mt-4">{progress}%</p>
//               </div>
//             )}

//             {result && (
//               <div className="border-t pt-8">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Done! ✅</h2>
//                 {enhancementTime && (
//                   <p className="text-gray-600 mb-6">Processed in {enhancementTime}ms</p>
//                 )}
//                 <div className="flex gap-4">
//                   <a
//                     href={result}
//                     download="photomonix.png"
//                     className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center"
//                   >
//                     📥 Download
//                   </a>
//                   <button
//                     onClick={() => {
//                       setFile(null);
//                       setPreview(null);
//                       setResult(null);
//                     }}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl"
//                   >
//                     🔄 New Image
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
// import { useState } from "react";
// import ImageUploader from "../components/ImageUploader";
// import ImagePreview from "../components/ImagePreview";
// import Loader from "../components/Loader";
// import AestheticBackgroundProcessor from "../api/AestheticBackgroundProcessor";

// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [enhancementTime, setEnhancementTime] = useState(null);
//   const [aesthetic, setAesthetic] = useState(null);
//   const [progress, setProgress] = useState(0);

//   const [options, setOptions] = useState({
//     backgroundChange: true,
//     lighting: true,
//     colors: true,
//     composition: true,
//   });

//   const handleSelect = (image) => {
//     setFile(image);
//     setPreview(URL.createObjectURL(image));
//     setResult(null);
//     setAesthetic(null);
//   };

//   const handleEnhance = async () => {
//     if (!file) return;

//     setLoading(true);
//     setProgress(0);
//     const startTime = Date.now();

//     try {
//       const progressInterval = setInterval(() => {
//         setProgress((prev) => Math.min(prev + 15, 85));
//       }, 300);

//       const result = await AestheticBackgroundProcessor.processImage(file, options);

//       clearInterval(progressInterval);
//       setProgress(95);

//       setResult(result.dataUrl);
//       setAesthetic(result.aestheticAnalysis);

//       const endTime = Date.now();
//       setEnhancementTime(endTime - startTime);
//       setProgress(100);

//       setTimeout(() => setProgress(0), 1000);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Processing failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             ✨ Photomonix
//           </h1>
//           <p className="text-gray-600 text-lg">AI Image Enhancement with Aesthetic-Aware Backgrounds</p>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           <div className="p-12">
//             {/* Upload */}
//             {!file && (
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Upload Image</h2>
//                 <ImageUploader onSelect={handleSelect} />
//               </div>
//             )}

//             {/* Aesthetic Analysis */}
//             {aesthetic && (
//               <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
//                 <h3 className="font-bold text-blue-900 mb-4 text-lg">🎨 Aesthetic Analysis</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-white p-3 rounded-lg">
//                     <p className="text-sm text-blue-600 font-semibold">Mood</p>
//                     <p className="text-blue-900 font-bold capitalize">{aesthetic.mood.replace(/_/g, ' ')}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded-lg">
//                     <p className="text-sm text-blue-600 font-semibold">Style</p>
//                     <p className="text-blue-900 font-bold capitalize">{aesthetic.style.replace(/_/g, ' ')}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded-lg">
//                     <p className="text-sm text-blue-600 font-semibold">Brightness</p>
//                     <p className="text-blue-900 font-bold">{Math.round(aesthetic.avgBrightness * 100)}%</p>
//                   </div>
//                   <div className="bg-white p-3 rounded-lg">
//                     <p className="text-sm text-blue-600 font-semibold">Saturation</p>
//                     <p className="text-blue-900 font-bold">{Math.round(aesthetic.avgSaturation * 100)}%</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Preview */}
//             {preview && (
//               <div className="mb-12">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Preview</h2>
//                 <div className="flex flex-col md:flex-row gap-8">
//                   <div className="flex-1">
//                     <ImagePreview title="Original" src={preview} />
//                   </div>
//                   {result && (
//                     <div className="flex-1">
//                       <ImagePreview title="Enhanced" src={result} />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Settings */}
//             {file && !loading && !result && (
//               <div className="mb-12">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                   {[
//                     { key: 'backgroundChange', label: 'Background', icon: '🎨' },
//                     { key: 'lighting', label: 'Lighting', icon: '☀️' },
//                     { key: 'colors', label: 'Colors', icon: '🌈' },
//                     { key: 'composition', label: 'Contrast', icon: '📐' },
//                   ].map((item) => (
//                     <button
//                       key={item.key}
//                       onClick={() =>
//                         setOptions((prev) => ({
//                           ...prev,
//                           [item.key]: !prev[item.key],
//                         }))
//                       }
//                       className={`p-4 rounded-xl border-2 transition-all ${
//                         options[item.key]
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="text-3xl mb-2">{item.icon}</div>
//                       <p className="text-sm font-bold">{item.label}</p>
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   onClick={handleEnhance}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg"
//                 >
//                   ✨ Enhance with Smart Background
//                 </button>
//               </div>
//             )}

//             {/* Loading */}
//             {loading && (
//               <div className="py-16 text-center">
//                 <Loader />
//                 <div className="mt-8 w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-gray-600 mt-4 font-semibold">{progress}% - Analyzing aesthetic...</p>
//               </div>
//             )}

//             {/* Results */}
//             {result && (
//               <div className="border-t pt-8">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6">✅ Done!</h2>
//                 {enhancementTime && (
//                   <p className="text-gray-600 mb-6 font-semibold">Processed in {enhancementTime}ms</p>
//                 )}
//                 <div className="flex gap-4">
//                   <a
//                     href={result}
//                     download="photomonix-enhanced.png"
//                     className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-all"
//                   >
//                     📥 Download
//                   </a>
//                   <button
//                     onClick={() => {
//                       setFile(null);
//                       setPreview(null);
//                       setResult(null);
//                       setAesthetic(null);
//                     }}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-all"
//                   >
//                     🔄 New Image
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
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