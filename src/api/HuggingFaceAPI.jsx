// import { analyzeImageAesthetics } from './ImageAnalyzerAPI';

// /**
//  * Enhanced image enhancement with automatic aesthetic background selection
//  */
// const enhanceImageWithAutoBackground = async (file, options, onProgress) => {
//   try {
//     const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;
    
//     if (!HF_TOKEN) {
//       throw new Error("Hugging Face token not found. Add VITE_HUGGINGFACE_TOKEN to .env");
//     }

//     // Step 1: Analyze image aesthetics
//     if (onProgress) onProgress(10, 'Analyzing image aesthetics...');
//     const aesthetic = await analyzeImageAesthetics(file);
    
//     // Merge analyzed aesthetic with user options
//     const enhancedOptions = {
//       ...options,
//       detectedAesthetic: aesthetic,
//       // If auto mode is enabled, use detected background
//       backgroundType: options.autoBackground ? aesthetic.backgroundType : options.backgroundType,
//       backgroundColor: aesthetic.backgroundColor,
//       gradientEnd: aesthetic.gradientEnd,
//     };

//     let processedImageUrl = null;
//     let finalImageUrl = await fileToDataUrl(file);

//     // Step 2: Remove background using RMBG
//     if (enhancedOptions.backgroundChange && enhancedOptions.backgroundType !== "none") {
//       if (onProgress) onProgress(25, 'Removing background...');
      
//       try {
//         const removalResponse = await fetch(
//           "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
//           {
//             method: "POST",
//             headers: {
//               "Authorization": `Bearer ${HF_TOKEN}`,
//             },
//             body: file,
//           }
//         );

//         if (removalResponse.ok) {
//           const blob = await removalResponse.blob();
//           processedImageUrl = URL.createObjectURL(blob);
//           finalImageUrl = processedImageUrl;
//         }
//       } catch (error) {
//         console.log("Background removal skipped:", error);
//       }
//     }

//     // Step 3: Enhance image quality
//     if (onProgress) onProgress(45, 'Enhancing image quality...');
//     try {
//       const enhancementResponse = await fetch(
//         "https://api-inference.huggingface.co/models/Qiliang/Real-ESRGAN",
//         {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${HF_TOKEN}`,
//           },
//           body: file,
//         }
//       );

//       if (enhancementResponse.ok) {
//         const enhancedBlob = await enhancementResponse.blob();
//         finalImageUrl = URL.createObjectURL(enhancedBlob);
//       }
//     } catch (error) {
//       console.log("Enhancement skipped, continuing with original");
//     }

//     // Step 4: Apply background with aesthetic awareness
//     if (onProgress) onProgress(65, 'Applying aesthetic background...');
//     if (enhancedOptions.backgroundChange && enhancedOptions.backgroundType !== "none") {
//       finalImageUrl = await applyAestheticBackground(
//         finalImageUrl,
//         enhancedOptions
//       );
//     }

//     // Step 5: Apply additional enhancements
//     if (onProgress) onProgress(80, 'Applying final enhancements...');
//     if (enhancedOptions.lighting || enhancedOptions.colors || enhancedOptions.sharpness || enhancedOptions.composition) {
//       finalImageUrl = await applyCanvasEnhancements(
//         finalImageUrl,
//         enhancedOptions,
//         aesthetic
//       );
//     }

//     if (onProgress) onProgress(95, 'Finalizing image...');

//     return {
//       url: finalImageUrl,
//       aesthetic: aesthetic,
//       options: enhancedOptions,
//     };

//   } catch (error) {
//     console.error('Image Enhancement Error:', error);
    
//     // Fallback: Return original image
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         resolve({
//           url: reader.result,
//           aesthetic: null,
//           options: options,
//         });
//       };
//       reader.readAsDataURL(file);
//     });
//   }
// };

// /**
//  * Applies aesthetic background with smart blending
//  */
// const applyAestheticBackground = async (imageUrl, options) => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext('2d');

//       // Create aesthetic background
//       const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      
//       const bgColor = options.backgroundColor || '#f5f5f5';
//       const gradEnd = options.gradientEnd || '#e0e0e0';

//       gradient.addColorStop(0, bgColor);
//       gradient.addColorStop(1, gradEnd);
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Add subtle pattern for depth
//       addBackgroundPattern(ctx, canvas.width, canvas.height, options.backgroundType);

//       // Blend subject onto background
//       const blendIntensity = (options.backgroundIntensity || 50) / 100;
//       ctx.globalAlpha = 0.9 + (blendIntensity * 0.1);
      
//       // Apply smart blending at edges
//       applyFeatheringEffect(ctx, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0);

//       resolve(canvas.toDataURL('image/png', 0.95));
//     };
//     img.src = imageUrl;
//   });
// };

// /**
//  * Adds subtle pattern to background based on type
//  */
// const addBackgroundPattern = (ctx, width, height, backgroundType) => {
//   ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';

//   switch (backgroundType) {
//     case 'studio_vibrant':
//     case 'studio_minimal':
//       // Subtle grid pattern
//       const gridSize = 50;
//       for (let x = 0; x < width; x += gridSize) {
//         ctx.fillRect(x, 0, 1, height);
//       }
//       for (let y = 0; y < height; y += gridSize) {
//         ctx.fillRect(0, y, width, 1);
//       }
//       break;

//     case 'outdoor_sunset':
//     case 'outdoor_nature':
//       // Radial gradient overlay for outdoor feel
//       const radGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
//       radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
//       radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
//       ctx.fillStyle = radGrad;
//       ctx.fillRect(0, 0, width, height);
//       break;

//     case 'modern_clean':
//       // Horizontal lines for modern feel
//       for (let y = 0; y < height; y += 30) {
//         ctx.fillRect(0, y, width, 1);
//       }
//       break;

//     case 'dark_minimal':
//       // Noise pattern for dark backgrounds
//       const noise = ctx.createImageData(width, height);
//       const data = noise.data;
//       for (let i = 0; i < data.length; i += 4) {
//         const val = Math.random() * 20;
//         data[i] = val;
//         data[i + 1] = val;
//         data[i + 2] = val;
//         data[i + 3] = 30;
//       }
//       ctx.putImageData(noise, 0, 0);
//       break;
//   }
// };

// /**
//  * Applies feathering effect at edges for smooth blending
//  */
// const applyFeatheringEffect = (ctx, width, height) => {
//   const featherSize = Math.min(width, height) * 0.1;
  
//   // Top feather
//   const topGrad = ctx.createLinearGradient(0, 0, 0, featherSize);
//   topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
//   topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
//   ctx.fillStyle = topGrad;
//   ctx.fillRect(0, 0, width, featherSize);

//   // Bottom feather
//   const bottomGrad = ctx.createLinearGradient(0, height - featherSize, 0, height);
//   bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
//   bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
//   ctx.fillStyle = bottomGrad;
//   ctx.fillRect(0, height - featherSize, width, featherSize);
// };

// /**
//  * Enhanced canvas-based image adjustments
//  */
// const applyCanvasEnhancements = async (imageUrl, options, aesthetic) => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext('2d');

//       // Apply color correction based on aesthetic
//       if (aesthetic && aesthetic.colorTemp === 'warm') {
//         ctx.filter = 'saturate(1.1) hue-rotate(5deg)';
//       } else if (aesthetic && aesthetic.colorTemp === 'cool') {
//         ctx.filter = 'saturate(1.1) hue-rotate(-5deg)';
//       }

//       ctx.drawImage(img, 0, 0);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       // Lighting enhancement
//       if (options.lighting) {
//         for (let i = 0; i < data.length; i += 4) {
//           const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
//           const factor = brightness > 128 ? 1.08 : 1.12;
//           data[i] = Math.min(255, data[i] * factor);
//           data[i + 1] = Math.min(255, data[i + 1] * factor);
//           data[i + 2] = Math.min(255, data[i + 2] * factor);
//         }
//       }

//       // Color saturation enhancement
//       if (options.colors) {
//         for (let i = 0; i < data.length; i += 4) {
//           const max = Math.max(data[i], data[i + 1], data[i + 2]);
//           const min = Math.min(data[i], data[i + 1], data[i + 2]);
//           const l = (max + min) / 2;
//           const s = l > 128 ? 1.15 : 1.2;

//           data[i] = Math.min(255, data[i] + (data[i] - l) * (s - 1) * 0.5);
//           data[i + 1] = Math.min(255, data[i + 1] + (data[i + 1] - l) * (s - 1) * 0.5);
//           data[i + 2] = Math.min(255, data[i + 2] + (data[i + 2] - l) * (s - 1) * 0.5);
//         }
//       }

//       // Sharpness enhancement
//       if (options.sharpness) {
//         const sharpened = applySharpeningFilter(imageData, canvas.width, canvas.height);
//         for (let i = 0; i < data.length; i++) {
//           data[i] = Math.min(255, Math.max(0, sharpened[i]));
//         }
//       }

//       // Composition adjustments
//       if (options.composition) {
//         increaseContrast(data, 1.15);
//       }

//       ctx.putImageData(imageData, 0, 0);
//       resolve(canvas.toDataURL('image/png', 0.95));
//     };
//     img.src = imageUrl;
//   });
// };

// /**
//  * Applies sharpening filter using convolution
//  */
// const applySharpeningFilter = (imageData, width, height) => {
//   const data = imageData.data;
//   const output = new Uint8ClampedArray(data);
//   const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       for (let c = 0; c < 3; c++) {
//         let sum = 0;
//         for (let ky = -1; ky <= 1; ky++) {
//           for (let kx = -1; kx <= 1; kx++) {
//             const idx = ((y + ky) * width + (x + kx)) * 4 + c;
//             sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
//           }
//         }
//         const idx = (y * width + x) * 4 + c;
//         output[idx] = Math.min(255, Math.max(0, sum / 1.2));
//       }
//     }
//   }
//   return output;
// };

// /**
//  * Increases contrast of image
//  */
// const increaseContrast = (data, factor) => {
//   const intercept = 128 * (1 - factor);
//   for (let i = 0; i < data.length; i += 4) {
//     data[i] = Math.min(255, Math.max(0, data[i] * factor + intercept));
//     data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + intercept));
//     data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + intercept));
//   }
// };

// /**
//  * Convert file to data URL
//  */
// const fileToDataUrl = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };

// export { enhanceImageWithAutoBackground, analyzeImageAesthetics };

import { analyzeImageAesthetics } from './ImageAnalyzerAPI';

/**
 * Enhanced image enhancement with automatic aesthetic background selection
 */
const enhanceImageWithAutoBackground = async (file, options, onProgress) => {
  try {
    const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;
    
    if (!HF_TOKEN) {
      throw new Error("Hugging Face token not found. Add VITE_HUGGINGFACE_TOKEN to .env");
    }

    // Step 1: Analyze image aesthetics
    if (onProgress) onProgress(10, 'Analyzing image aesthetics...');
    const aesthetic = await analyzeImageAesthetics(file);
    
    // Merge analyzed aesthetic with user options
    const enhancedOptions = {
      ...options,
      detectedAesthetic: aesthetic,
      // If auto mode is enabled, use detected background
      backgroundType: options.autoBackground ? aesthetic.backgroundType : options.backgroundType,
      backgroundColor: aesthetic.backgroundColor,
      gradientEnd: aesthetic.gradientEnd,
    };

    let processedImageUrl = null;
    let finalImageUrl = await fileToDataUrl(file);

    // Step 2: Remove background using RMBG
    if (enhancedOptions.backgroundChange && enhancedOptions.backgroundType !== "none") {
      if (onProgress) onProgress(25, 'Removing background...');
      
      try {
        const removalResponse = await fetch(
          "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HF_TOKEN}`,
            },
            body: file,
          }
        );

        if (removalResponse.ok) {
          const blob = await removalResponse.blob();
          processedImageUrl = URL.createObjectURL(blob);
          finalImageUrl = processedImageUrl;
        }
      } catch (error) {
        console.log("Background removal skipped:", error);
      }
    }

    // Step 3: Enhance image quality
    if (onProgress) onProgress(45, 'Enhancing image quality...');
    try {
      const enhancementResponse = await fetch(
        "https://api-inference.huggingface.co/models/Qiliang/Real-ESRGAN",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
          },
          body: file,
        }
      );

      if (enhancementResponse.ok) {
        const enhancedBlob = await enhancementResponse.blob();
        finalImageUrl = URL.createObjectURL(enhancedBlob);
      }
    } catch (error) {
      console.log("Enhancement skipped, continuing with original");
    }

    // Step 4: Apply background with aesthetic awareness
    if (onProgress) onProgress(65, 'Applying aesthetic background...');
    if (enhancedOptions.backgroundChange && enhancedOptions.backgroundType !== "none") {
      finalImageUrl = await applyAestheticBackground(
        finalImageUrl,
        enhancedOptions
      );
    }

    // Step 5: Apply additional enhancements
    if (onProgress) onProgress(80, 'Applying final enhancements...');
    if (enhancedOptions.lighting || enhancedOptions.colors || enhancedOptions.sharpness || enhancedOptions.composition) {
      finalImageUrl = await applyCanvasEnhancements(
        finalImageUrl,
        enhancedOptions,
        aesthetic
      );
    }

    if (onProgress) onProgress(95, 'Finalizing image...');

    return {
      url: finalImageUrl,
      aesthetic: aesthetic,
      options: enhancedOptions,
    };

  } catch (error) {
    console.error('Image Enhancement Error:', error);
    
    // Fallback: Return original image
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result,
          aesthetic: null,
          options: options,
        });
      };
      reader.readAsDataURL(file);
    });
  }
};

/**
 * Applies aesthetic background with smart blending
 */
const applyAestheticBackground = async (imageUrl, options) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Create aesthetic background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      
      const bgColor = options.backgroundColor || '#f5f5f5';
      const gradEnd = options.gradientEnd || '#e0e0e0';

      gradient.addColorStop(0, bgColor);
      gradient.addColorStop(1, gradEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle pattern for depth
      addBackgroundPattern(ctx, canvas.width, canvas.height, options.backgroundType);

      // Blend subject onto background
      const blendIntensity = (options.backgroundIntensity || 50) / 100;
      ctx.globalAlpha = 0.9 + (blendIntensity * 0.1);
      
      // Apply smart blending at edges
      applyFeatheringEffect(ctx, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png', 0.95));
    };
    img.src = imageUrl;
  });
};

/**
 * Adds subtle pattern to background based on type
 */
const addBackgroundPattern = (ctx, width, height, backgroundType) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';

  switch (backgroundType) {
    case 'studio_vibrant':
    case 'studio_minimal':
      // Subtle grid pattern
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.fillRect(x, 0, 1, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.fillRect(0, y, width, 1);
      }
      break;

    case 'outdoor_sunset':
    case 'outdoor_nature':
      // Radial gradient overlay for outdoor feel
      const radGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
      break;

    case 'modern_clean':
      // Horizontal lines for modern feel
      for (let y = 0; y < height; y += 30) {
        ctx.fillRect(0, y, width, 1);
      }
      break;

    case 'dark_minimal':
      // Noise pattern for dark backgrounds
      const noise = ctx.createImageData(width, height);
      const data = noise.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 20;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 30;
      }
      ctx.putImageData(noise, 0, 0);
      break;
  }
};

/**
 * Applies feathering effect at edges for smooth blending
 */
const applyFeatheringEffect = (ctx, width, height) => {
  const featherSize = Math.min(width, height) * 0.1;
  
  // Top feather
  const topGrad = ctx.createLinearGradient(0, 0, 0, featherSize);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, featherSize);

  // Bottom feather
  const bottomGrad = ctx.createLinearGradient(0, height - featherSize, 0, height);
  bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, height - featherSize, width, featherSize);
};

/**
 * Enhanced canvas-based image adjustments
 */
const applyCanvasEnhancements = async (imageUrl, options, aesthetic) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Apply color correction based on aesthetic
      if (aesthetic && aesthetic.colorTemp === 'warm') {
        ctx.filter = 'saturate(1.1) hue-rotate(5deg)';
      } else if (aesthetic && aesthetic.colorTemp === 'cool') {
        ctx.filter = 'saturate(1.1) hue-rotate(-5deg)';
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Lighting enhancement
      if (options.lighting) {
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const factor = brightness > 128 ? 1.08 : 1.12;
          data[i] = Math.min(255, data[i] * factor);
          data[i + 1] = Math.min(255, data[i + 1] * factor);
          data[i + 2] = Math.min(255, data[i + 2] * factor);
        }
      }

      // Color saturation enhancement
      if (options.colors) {
        for (let i = 0; i < data.length; i += 4) {
          const max = Math.max(data[i], data[i + 1], data[i + 2]);
          const min = Math.min(data[i], data[i + 1], data[i + 2]);
          const l = (max + min) / 2;
          const s = l > 128 ? 1.15 : 1.2;

          data[i] = Math.min(255, data[i] + (data[i] - l) * (s - 1) * 0.5);
          data[i + 1] = Math.min(255, data[i + 1] + (data[i + 1] - l) * (s - 1) * 0.5);
          data[i + 2] = Math.min(255, data[i + 2] + (data[i + 2] - l) * (s - 1) * 0.5);
        }
      }

      // Sharpness enhancement
      if (options.sharpness) {
        const sharpened = applySharpeningFilter(imageData, canvas.width, canvas.height);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.min(255, Math.max(0, sharpened[i]));
        }
      }

      // Composition adjustments
      if (options.composition) {
        increaseContrast(data, 1.15);
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png', 0.95));
    };
    img.src = imageUrl;
  });
};

/**
 * Applies sharpening filter using convolution
 */
const applySharpeningFilter = (imageData, width, height) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data);
  const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const idx = (y * width + x) * 4 + c;
        output[idx] = Math.min(255, Math.max(0, sum / 1.2));
      }
    }
  }
  return output;
};

/**
 * Increases contrast of image
 */
const increaseContrast = (data, factor) => {
  const intercept = 128 * (1 - factor);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] * factor + intercept));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + intercept));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + intercept));
  }
};

/**
 * Convert file to data URL
 */
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export { enhanceImageWithAutoBackground, analyzeImageAesthetics };