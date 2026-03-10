// import { GoogleGenerativeAI } from "@google/generative-ai";

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//   console.warn("VITE_GEMINI_API_KEY not found in environment variables");
// }

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// /**
//  * Analyze image with Gemini to get object detection and background suggestions
//  */
// export async function analyzeImageWithGemini(imageDataUrl) {
//   try {
//     // Use gemini-pro-vision for image analysis
//     const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//     // Extract base64 from data URL
//     const imageBase64 = imageDataUrl.split(",")[1];

//     const prompt = `Analyze this image and provide a JSON response with these exact keys:
// {
//   "object": "Main subject in the image (e.g., person, product, animal, landscape)",
//   "objectType": "Category like portrait, product, nature, architecture, etc.",
//   "bestBackground": "One of: studio, outdoor-sunset, park, office, modern-abstract, bokeh-blur, minimalist-white, nature-green, urban-street, beach, mountains",
//   "mood": "Professional, casual, creative, serene, vibrant, dark, bright, etc.",
//   "enhancements": ["Array of enhancements like sharpen, brighten, deblur, increase-contrast, increase-saturation"],
//   "backgroundDescription": "Short description of ideal background"
// }

// IMPORTANT: Return ONLY the JSON object, nothing else.`;

//     const result = await model.generateContent([
//       prompt,
//       {
//         inlineData: {
//           data: imageBase64,
//           mimeType: "image/jpeg",
//         },
//       },
//     ]);

//     const responseText = result.response.text();
//     console.log("Gemini response:", responseText);
    
//     // Extract JSON from response
//     const jsonMatch = responseText.match(/{[\s\S]*}/);
//     if (!jsonMatch) {
//       console.error("Could not find JSON in response:", responseText);
//       throw new Error("Could not extract JSON from Gemini response");
//     }

//     const analysis = JSON.parse(jsonMatch[0]);
//     return analysis;
//   } catch (error) {
//     console.error("Gemini analysis error:", error);
//     throw error;
//   }
// }

// /**
//  * Get background image URL based on mood and background type
//  */
// export function getBackgroundImageUrl(backgroundType, mood) {
//   const backgrounds = {
//     "studio": [
//       "https://images.unsplash.com/photo-1559027615-cd1628902d4a?w=1600&q=80",
//       "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
//     ],
//     "outdoor-sunset": [
//       "https://images.unsplash.com/photo-1495566200989-26d5d8ba6e38?w=1600&q=80",
//       "https://images.unsplash.com/photo-1495567720989-cebfcc6d6881?w=1600&q=80",
//     ],
//     "park": [
//       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
//       "https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1600&q=80",
//     ],
//     "office": [
//       "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
//       "https://images.unsplash.com/photo-1557821552-17105176677c?w=1600&q=80",
//     ],
//     "modern-abstract": [
//       "https://images.unsplash.com/photo-1557672172-298e090d0f80?w=1600&q=80",
//       "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1600&q=80",
//     ],
//     "bokeh-blur": [
//       "https://images.unsplash.com/photo-1557672172-298e090d0f80?w=1600&q=80",
//       "https://images.unsplash.com/photo-1518531933037-91b2f8a9cc46?w=1600&q=80",
//     ],
//     "minimalist-white": [
//       "https://images.unsplash.com/photo-1559027615-cd1628902d4a?w=1600&q=80",
//       "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1600&q=80",
//     ],
//     "nature-green": [
//       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
//       "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1600&q=80",
//     ],
//     "urban-street": [
//       "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80",
//       "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80",
//     ],
//     "beach": [
//       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
//       "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&q=80",
//     ],
//     "mountains": [
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
//     ],
//   };

//   const bgList = backgrounds[backgroundType] || backgrounds["studio"];
//   return bgList[Math.floor(Math.random() * bgList.length)];
// }