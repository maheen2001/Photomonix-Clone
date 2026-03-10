/**
 * Image Analyzer - Detects image aesthetics and style
 * Uses color analysis and pattern recognition to determine best background
 */

const analyzeImageAesthetics = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to analyze pixels
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Analyze image characteristics
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const analysis = analyzePixels(imageData);
        
        // Determine aesthetic and mood
        const aesthetic = determineAesthetic(analysis);
        
        resolve(aesthetic);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes pixel data to extract color palette and brightness info
 */
const analyzePixels = (imageData) => {
  const data = imageData.data;
  const colors = [];
  const brightness = [];
  const saturation = [];

  // Sample every nth pixel to improve performance
  const sampleRate = 4;
  
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 128) { // Only consider non-transparent pixels
      colors.push({ r, g, b });
      
      // Calculate brightness (luminance)
      const br = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      brightness.push(br);

      // Calculate saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      saturation.push(sat);
    }
  }

  // Calculate averages
  const avgBrightness = brightness.reduce((a, b) => a + b, 0) / brightness.length;
  const avgSaturation = saturation.reduce((a, b) => a + b, 0) / saturation.length;

  // Find dominant colors using simple clustering
  const dominantColors = findDominantColors(colors, 3);

  // Analyze color temperature
  const colorTemp = analyzeColorTemperature(dominantColors);

  // Detect if image is portrait or has specific composition
  const composition = detectComposition(colors, imageData.width, imageData.height);

  return {
    dominantColors,
    avgBrightness,
    avgSaturation,
    colorTemp,
    composition,
    brightness,
  };
};

/**
 * Finds dominant colors in the image using k-means-like clustering
 */
const findDominantColors = (colors, k) => {
  if (colors.length === 0) return [];
  
  // Initialize with random colors
  let centroids = colors.slice(0, k);

  for (let iteration = 0; iteration < 5; iteration++) {
    // Assign colors to nearest centroid
    const clusters = Array(k).fill(null).map(() => []);

    colors.forEach((color) => {
      let minDist = Infinity;
      let nearestCluster = 0;

      centroids.forEach((centroid, idx) => {
        const dist = Math.pow(color.r - centroid.r, 2) + 
                     Math.pow(color.g - centroid.g, 2) + 
                     Math.pow(color.b - centroid.b, 2);
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = idx;
        }
      });

      clusters[nearestCluster].push(color);
    });

    // Update centroids
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[0];
      const avg = {
        r: Math.round(cluster.reduce((sum, c) => sum + c.r, 0) / cluster.length),
        g: Math.round(cluster.reduce((sum, c) => sum + c.g, 0) / cluster.length),
        b: Math.round(cluster.reduce((sum, c) => sum + c.b, 0) / cluster.length),
      };
      return avg;
    });
  }

  return centroids.sort((a, b) => {
    const brightA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const brightB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
    return brightB - brightA; // Sort by brightness descending
  });
};

/**
 * Analyzes color temperature (warm vs cool tones)
 */
const analyzeColorTemperature = (dominantColors) => {
  if (dominantColors.length === 0) return 'neutral';

  const mainColor = dominantColors[0];
  const warmth = (mainColor.r + mainColor.g) - mainColor.b;

  if (warmth > 50) return 'warm';
  if (warmth < -50) return 'cool';
  return 'neutral';
};

/**
 * Detects image composition pattern
 */
const detectComposition = (colors, width, height) => {
  // Analyze center vs edges for portrait detection
  const centerPixels = colors.slice(0, Math.floor(colors.length * 0.3));
  const edgePixels = colors.slice(Math.floor(colors.length * 0.7));

  const centerBrightness = centerPixels.reduce((sum, c) => 
    sum + (0.299 * c.r + 0.587 * c.g + 0.114 * c.b), 0) / Math.max(1, centerPixels.length);
  
  const edgeBrightness = edgePixels.reduce((sum, c) => 
    sum + (0.299 * c.r + 0.587 * c.g + 0.114 * c.b), 0) / Math.max(1, edgePixels.length);

  // If center is brighter, likely a portrait/subject-focused image
  if (centerBrightness > edgeBrightness + 10) return 'portrait';
  if (Math.abs(width - height) > Math.max(width, height) * 0.3) return 'landscape';
  return 'product';
};

/**
 * Determines the best aesthetic and background type based on analysis
 */
const determineAesthetic = (analysis) => {
  const { dominantColors, avgBrightness, avgSaturation, colorTemp, composition } = analysis;

  let aesthetic = {
    mood: 'neutral',
    style: 'studio',
    backgroundColor: '#f5f5f5',
    gradientEnd: '#e0e0e0',
    confidence: 0.5,
  };

  // Mood detection based on brightness and saturation
  if (avgBrightness > 0.7) {
    aesthetic.mood = 'bright_and_cheerful';
  } else if (avgBrightness < 0.4) {
    aesthetic.mood = 'dark_and_moody';
  } else if (avgSaturation > 0.6) {
    aesthetic.mood = 'vibrant_and_lively';
  } else if (avgSaturation < 0.3) {
    aesthetic.mood = 'serene_and_calm';
  }

  // Style detection based on composition and color
  if (composition === 'portrait') {
    aesthetic.style = avgSaturation > 0.5 ? 'vibrant_studio' : 'minimal_studio';
    aesthetic.confidence = 0.85;
  } else if (composition === 'landscape') {
    aesthetic.style = colorTemp === 'warm' ? 'sunset_outdoor' : 'nature_outdoor';
    aesthetic.confidence = 0.8;
  } else if (composition === 'product') {
    aesthetic.style = avgBrightness > 0.6 ? 'clean_modern' : 'minimal_dark';
    aesthetic.confidence = 0.75;
  }

  // Select background based on aesthetic
  aesthetic = selectBackgroundForAesthetic(aesthetic, dominantColors, colorTemp);

  return aesthetic;
};

/**
 * Selects the best background type and colors based on aesthetic analysis
 */
const selectBackgroundForAesthetic = (aesthetic, dominantColors, colorTemp) => {
  const mainColor = dominantColors[0];
  const complementary = getComplementaryColor(mainColor);

  switch (aesthetic.style) {
    case 'vibrant_studio':
      aesthetic.backgroundColor = createGradientColor(complementary, 0.9);
      aesthetic.gradientEnd = createGradientColor(complementary, 0.7);
      aesthetic.backgroundType = 'studio_vibrant';
      break;

    case 'minimal_studio':
      aesthetic.backgroundColor = '#f8f8f8';
      aesthetic.gradientEnd = '#d5d5d5';
      aesthetic.backgroundType = 'studio_minimal';
      break;

    case 'sunset_outdoor':
      aesthetic.backgroundColor = '#ff6b6b';
      aesthetic.gradientEnd = '#ffb347';
      aesthetic.backgroundType = 'outdoor_sunset';
      break;

    case 'nature_outdoor':
      aesthetic.backgroundColor = '#4a9d6f';
      aesthetic.gradientEnd = '#87ceeb';
      aesthetic.backgroundType = 'outdoor_nature';
      break;

    case 'clean_modern':
      aesthetic.backgroundColor = '#f0f0f0';
      aesthetic.gradientEnd = '#e8e8e8';
      aesthetic.backgroundType = 'modern_clean';
      break;

    case 'minimal_dark':
      aesthetic.backgroundColor = '#2a2a2a';
      aesthetic.gradientEnd = '#1a1a1a';
      aesthetic.backgroundType = 'dark_minimal';
      break;

    default:
      aesthetic.backgroundColor = '#f5f5f5';
      aesthetic.gradientEnd = '#e0e0e0';
      aesthetic.backgroundType = 'studio';
  }

  return aesthetic;
};

/**
 * Gets complementary color for harmony
 */
const getComplementaryColor = (color) => {
  return {
    r: 255 - color.r,
    g: 255 - color.g,
    b: 255 - color.b,
  };
};

/**
 * Creates a color string from RGB object with optional brightness adjustment
 */
const createGradientColor = (color, brightness = 1) => {
  const r = Math.round(Math.min(255, color.r * brightness));
  const g = Math.round(Math.min(255, color.g * brightness));
  const b = Math.round(Math.min(255, color.b * brightness));
  return `rgb(${r}, ${g}, ${b})`;
};

export { analyzeImageAesthetics, determineAesthetic };