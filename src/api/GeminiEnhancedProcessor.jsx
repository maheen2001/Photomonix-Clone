//

// class GeminiEnhancedProcessor {
//   static async processImage(file, customOptions = {}) {
//     try {
//       // Step 1: Load original image
//       const canvas = await this.loadImage(file);
//       const imageDataUrl = canvas.toDataURL("image/jpeg");

//       // Step 2: Analyze with Gemini
//       console.log("Analyzing image with Gemini...");
//       let geminiAnalysis;
      
//       try {
//         geminiAnalysis = await analyzeImageWithGemini(imageDataUrl);
//         console.log("Gemini analysis:", geminiAnalysis);
//       } catch (geminiError) {
//         console.warn("Gemini analysis failed, using default analysis");
//         geminiAnalysis = this.getDefaultAnalysis();
//       }

//       // Step 3: Remove background
//       let processedCanvas = this.smartRemoveBackground(canvas);

//       // Step 4: Apply background image
//       const bgImageUrl = getBackgroundImageUrl(
//         geminiAnalysis.bestBackground,
//         geminiAnalysis.mood
//       );
//       processedCanvas = await this.applyImageBackground(
//         processedCanvas,
//         bgImageUrl
//       );

//       // Step 5: Apply enhancements based on Gemini suggestions
//       processedCanvas = this.applySmartEnhancements(
//         processedCanvas,
//         geminiAnalysis.enhancements
//       );

//       return {
//         dataUrl: processedCanvas.toDataURL("image/png", 0.95),
//         geminiAnalysis: geminiAnalysis,
//         success: true,
//       };
//     } catch (error) {
//       console.error("Processing error:", error);
//       throw error;
//     }
//   }

//   static getDefaultAnalysis() {
//     return {
//       object: "Image subject",
//       objectType: "general",
//       bestBackground: "studio",
//       mood: "professional",
//       enhancements: ["sharpen", "brighten"],
//       backgroundDescription: "Clean professional studio background"
//     };
//   }

//   static loadImage(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const img = new Image();
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d", { willReadFrequently: true });
//           ctx.drawImage(img, 0, 0);
//           resolve(canvas);
//         };
//         img.onerror = reject;
//         img.src = e.target.result;
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   }

//   static smartRemoveBackground(canvas) {
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });
//     const w = canvas.width;
//     const h = canvas.height;
//     const imageData = ctx.getImageData(0, 0, w, h);
//     const data = imageData.data;

//     // Edge detection
//     const edges = this.sobelEdgeDetection(data, w, h);
//     const mask = this.dilateMask(edges, w, h, 20);

//     // Apply mask - make background transparent
//     for (let i = 0; i < data.length; i += 4) {
//       const pixelIndex = i / 4;
//       if (mask[pixelIndex] < 50) {
//         data[i + 3] = Math.max(0, data[i + 3] * 0.15); // Make background semi-transparent
//       }
//     }

//     ctx.putImageData(imageData, 0, 0);
//     return canvas;
//   }

//   static sobelEdgeDetection(data, w, h) {
//     const edges = new Uint8Array(w * h);
//     const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
//     const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

//     for (let y = 1; y < h - 1; y++) {
//       for (let x = 1; x < w - 1; x++) {
//         let gx = 0,
//           gy = 0;

//         for (let ky = -1; ky <= 1; ky++) {
//           for (let kx = -1; kx <= 1; kx++) {
//             const idx = ((y + ky) * w + (x + kx)) * 4;
//             const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
//             const kernel_idx = (ky + 1) * 3 + (kx + 1);
//             gx += gray * sobelX[kernel_idx];
//             gy += gray * sobelY[kernel_idx];
//           }
//         }

//         const magnitude = Math.sqrt(gx * gx + gy * gy);
//         edges[y * w + x] = Math.min(255, magnitude);
//       }
//     }

//     return edges;
//   }

//   static dilateMask(edges, w, h, radius = 20) {
//     const mask = new Uint8Array(w * h);
//     const threshold = 50;

//     for (let i = 0; i < edges.length; i++) {
//       mask[i] = edges[i] > threshold ? 255 : 0;
//     }

//     // Dilate to expand foreground
//     for (let iteration = 0; iteration < 4; iteration++) {
//       const newMask = new Uint8Array(mask);
//       for (let y = radius; y < h - radius; y++) {
//         for (let x = radius; x < w - radius; x++) {
//           if (mask[y * w + x] > 200) {
//             for (let dy = -radius; dy <= radius; dy++) {
//               for (let dx = -radius; dx <= radius; dx++) {
//                 if (Math.sqrt(dx * dx + dy * dy) <= radius) {
//                   const idx = (y + dy) * w + (x + dx);
//                   newMask[idx] = Math.max(newMask[idx], 200);
//                 }
//               }
//             }
//           }
//         }
//       }
//       mask.set(newMask);
//     }

//     return mask;
//   }

//   static async applyImageBackground(canvas, bgImageUrl) {
//     return new Promise((resolve, reject) => {
//       const bgImg = new Image();
//       bgImg.crossOrigin = "anonymous";
//       bgImg.onload = () => {
//         const resultCanvas = document.createElement("canvas");
//         resultCanvas.width = canvas.width;
//         resultCanvas.height = canvas.height;
//         const ctx = resultCanvas.getContext("2d", { willReadFrequently: true });

//         // Scale and draw background image
//         const scale = Math.max(
//           canvas.width / bgImg.width,
//           canvas.height / bgImg.height
//         );
//         const x = (canvas.width - bgImg.width * scale) / 2;
//         const y = (canvas.height - bgImg.height * scale) / 2;

//         ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);

//         // Apply slight blur to background for depth
//         ctx.filter = "blur(3px)";
//         ctx.drawImage(
//           bgImg,
//           x,
//           y,
//           bgImg.width * scale,
//           bgImg.height * scale
//         );
//         ctx.filter = "none";

//         // Draw subject on top
//         ctx.globalAlpha = 0.98;
//         ctx.drawImage(canvas, 0, 0);

//         // Add vignette
//         const vignette = ctx.createRadialGradient(
//           canvas.width / 2,
//           canvas.height / 2,
//           0,
//           canvas.width / 2,
//           canvas.height / 2,
//           Math.max(canvas.width, canvas.height) * 0.7
//         );
//         vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
//         vignette.addColorStop(1, "rgba(0, 0, 0, 0.2)");
//         ctx.fillStyle = vignette;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         resolve(resultCanvas);
//       };
//       bgImg.onerror = () => {
//         console.warn("Failed to load background image, using canvas fallback");
//         resolve(canvas); // Fallback to original if background fails
//       };
//       bgImg.src = bgImageUrl;
//     });
//   }

//   static applySmartEnhancements(canvas, enhancements) {
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;

//     // Apply each enhancement suggested by Gemini
//     if (enhancements && (enhancements.includes("sharpen") || enhancements.includes("deblur"))) {
//       ctx.putImageData(imageData, 0, 0);
//       return this.applySharpeningFilter(canvas, 1.5);
//     }

//     if (enhancements && enhancements.includes("brighten")) {
//       for (let i = 0; i < data.length; i += 4) {
//         if (data[i + 3] > 128) {
//           data[i] = Math.min(255, data[i] * 1.15);
//           data[i + 1] = Math.min(255, data[i + 1] * 1.15);
//           data[i + 2] = Math.min(255, data[i + 2] * 1.15);
//         }
//       }
//     }

//     if (enhancements && enhancements.includes("increase-contrast")) {
//       const factor = 1.25;
//       const intercept = 128 * (1 - factor);
//       for (let i = 0; i < data.length; i += 4) {
//         if (data[i + 3] > 128) {
//           data[i] = Math.min(255, Math.max(0, data[i] * factor + intercept));
//           data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + intercept));
//           data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + intercept));
//         }
//       }
//     }

//     if (enhancements && enhancements.includes("increase-saturation")) {
//       for (let i = 0; i < data.length; i += 4) {
//         if (data[i + 3] > 128) {
//           const max = Math.max(data[i], data[i + 1], data[i + 2]);
//           const min = Math.min(data[i], data[i + 1], data[i + 2]);
//           const l = (max + min) / 2;

//           if (max !== min) {
//             data[i] = Math.min(255, Math.max(0, data[i] + (data[i] - l) * 0.35));
//             data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (data[i + 1] - l) * 0.35));
//             data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (data[i + 2] - l) * 0.35));
//           }
//         }
//       }
//     }

//     ctx.putImageData(imageData, 0, 0);
//     return canvas;
//   }

//   static applySharpeningFilter(canvas, strength = 1.5) {
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     const width = canvas.width;
//     const height = canvas.height;

//     // Advanced sharpening kernel
//     const kernel = [-1, -1, -1, -1, 9 * strength, -1, -1, -1, -1];
//     const output = new Uint8ClampedArray(data);

//     for (let y = 1; y < height - 1; y++) {
//       for (let x = 1; x < width - 1; x++) {
//         if (data[(y * width + x) * 4 + 3] > 128) {
//           for (let c = 0; c < 3; c++) {
//             let sum = 0;
//             for (let ky = -1; ky <= 1; ky++) {
//               for (let kx = -1; kx <= 1; kx++) {
//                 const idx = ((y + ky) * width + (x + kx)) * 4 + c;
//                 sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
//               }
//             }
//             const idx = (y * width + x) * 4 + c;
//             output[idx] = Math.min(255, Math.max(0, sum / (9 * strength)));
//           }
//         }
//       }
//     }

//     const sharpened = ctx.createImageData(width, height);
//     sharpened.data.set(output);
//     ctx.putImageData(sharpened, 0, 0);
//     return canvas;
//   }
// }

// export default GeminiEnhancedProcessor;