import { analyzeImageWithGemini, getBackgroundImageUrl } from "./geminiAnalyzer";
import { removeBackground, upscaleImage, applyCanvasEnhancements, fileToDataUrl } from "./HuggingFaceAPI";

class GeminiEnhancedProcessor {
  /**
   * Orchestrates the full AI processing flow:
   * 1. Gemini Scene Analysis
   * 2. High-res Upscaling (ESRGAN)
   * 3. Professional Background Removal (RMBG)
   * 4. Smart Background Replacement
   * 5. Canvas-based Enhancements
   */
  static async processImage(file, customOptions = {}) {
    try {
      // Step 1: Analyze with Gemini
      console.log("Analyzing image with Gemini...");
      const originalDataUrl = await fileToDataUrl(file);
      let geminiAnalysis;

      try {
        geminiAnalysis = await analyzeImageWithGemini(originalDataUrl);
        console.log("Gemini analysis:", geminiAnalysis);
      } catch (geminiError) {
        console.warn("Gemini analysis failed, using default analysis");
        geminiAnalysis = this.getDefaultAnalysis();
      }

      // Step 2: High-resolution Upscaling
      console.log("Upscaling image quality...");
      let workingImageUrl = originalDataUrl;
      try {
        workingImageUrl = await upscaleImage(file);
      } catch (upscaleError) {
        console.warn("Upscaling failed, continuing with original quality");
      }

      // Step 3: Professional Background Removal
      console.log("Removing background...");
      let subjectImageUrl = workingImageUrl;
      try {
        // We need a blob for the HF API
        const response = await fetch(workingImageUrl);
        const blob = await response.blob();
        subjectImageUrl = await removeBackground(blob);
      } catch (removalError) {
        console.warn("Professional background removal failed, using fallback...");
        // Fallback or keep current if it fails
      }

      // Step 4: Add intelligent Background
      console.log("Applying smart background...");
      const bgImageUrl = getBackgroundImageUrl(
        geminiAnalysis.bestBackground,
        geminiAnalysis.mood
      );

      const subjectCanvas = await this.loadImageFromUrl(subjectImageUrl);
      const FinalCanvas = await this.applyImageBackground(
        subjectCanvas,
        bgImageUrl
      );

      // Step 5: Final Canvas Enhancements
      console.log("Applying final smart enhancements...");
      const finalResultUrl = await applyCanvasEnhancements(
        FinalCanvas.toDataURL("image/png"),
        {
          lighting: geminiAnalysis.enhancements.includes("brighten"),
          colors: geminiAnalysis.enhancements.includes("increase-saturation"),
          sharpness: geminiAnalysis.enhancements.includes("sharpen"),
          composition: geminiAnalysis.enhancements.includes("increase-contrast")
        },
        null // We could pass more aesthetic info here if needed
      );

      return {
        dataUrl: finalResultUrl,
        geminiAnalysis: geminiAnalysis,
        success: true,
      };
    } catch (error) {
      console.error("Processing error:", error);
      throw error;
    }
  }

  static getDefaultAnalysis() {
    return {
      object: "Image subject",
      objectType: "general",
      bestBackground: "studio",
      mood: "professional",
      enhancements: ["sharpen", "brighten"],
      backgroundDescription: "Clean professional studio background"
    };
  }

  static loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static async applyImageBackground(canvas, bgImageUrl) {
    return new Promise((resolve) => {
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.onload = () => {
        const resultCanvas = document.createElement("canvas");
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        const ctx = resultCanvas.getContext("2d", { willReadFrequently: true });

        // Step 1: Draw and Scale Background
        const scale = Math.max(
          canvas.width / bgImg.width,
          canvas.height / bgImg.height
        );
        const x = (canvas.width - bgImg.width * scale) / 2;
        const y = (canvas.height - bgImg.height * scale) / 2;

        // Apply slight blur to background for depth of field
        ctx.filter = "blur(4px) brightness(0.9)";
        ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
        ctx.filter = "none";

        // Step 2: Draw Subject with very subtle feathering
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.drawImage(canvas, 0, 0);
        ctx.shadowBlur = 0;

        // Step 3: Add cinematic vignette
        const vignette = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.8
        );
        vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
        vignette.addColorStop(1, "rgba(0, 0, 0, 0.3)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        resolve(resultCanvas);
      };
      bgImg.onerror = () => {
        console.warn("Background load failed, returning subject only");
        resolve(canvas);
      };
      bgImg.src = bgImageUrl;
    });
  }
}

export default GeminiEnhancedProcessor;
