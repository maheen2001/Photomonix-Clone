/**
 * Advanced Image Processing Engine
 * Handles background removal, detection, and aesthetic analysis locally
 */

// Canvas-based image processing utilities
class ImageProcessingEngine {
  static async processImage(file, options) {
    try {
      const imageData = await this.loadImageAsCanvas(file);
      const analysis = await this.analyzeImage(imageData);
      
      let processedCanvas = imageData.canvas;

      // Step 1: Remove background if needed
      if (options.backgroundChange && options.backgroundType !== "none") {
        processedCanvas = await this.removeBackground(imageData.canvas);
      }

      // Step 2: Apply enhancements
      if (options.lighting || options.colors || options.sharpness || options.composition) {
        processedCanvas = this.applyEnhancements(processedCanvas, options, analysis);
      }

      // Step 3: Apply aesthetic background
      if (options.backgroundChange && options.backgroundType !== "none") {
        processedCanvas = this.applyAestheticBackground(
          processedCanvas,
          analysis,
          options
        );
      }

      return {
        canvas: processedCanvas,
        dataUrl: processedCanvas.toDataURL('image/png', 0.95),
        analysis: analysis
      };
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  }

  static loadImageAsCanvas(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          resolve({
            canvas,
            img,
            width: img.width,
            height: img.height
          });
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static analyzeImage(imageData) {
    const { canvas } = imageData;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const colors = [];
    const brightness = [];
    const saturation = [];

    // Sample pixels
    const sampleRate = 4;
    for (let i = 0; i < data.length; i += 4 * sampleRate) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a > 128) {
        colors.push({ r, g, b });
        
        const br = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        brightness.push(br);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        saturation.push(sat);
      }
    }

    const avgBrightness = brightness.reduce((a, b) => a + b, 0) / brightness.length;
    const avgSaturation = saturation.reduce((a, b) => a + b, 0) / saturation.length;
    const dominantColor = this.findDominantColor(colors);
    const colorTemp = this.analyzeColorTemperature(dominantColor);

    return {
      avgBrightness,
      avgSaturation,
      dominantColor,
      colorTemp,
      colors,
      brightness,
      width: imageData.width,
      height: imageData.height
    };
  }

  static findDominantColor(colors) {
    if (!colors.length) return { r: 128, g: 128, b: 128 };

    const buckets = {};
    colors.forEach(color => {
      const key = `${Math.round(color.r / 10)}${Math.round(color.g / 10)}${Math.round(color.b / 10)}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });

    const sorted = Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topColors = sorted.map(entry => {
      const key = entry[0];
      return {
        r: parseInt(key.substring(0, 2)) * 10,
        g: parseInt(key.substring(2, 4)) * 10,
        b: parseInt(key.substring(4, 6)) * 10
      };
    });

    return topColors[0] || { r: 128, g: 128, b: 128 };
  }

  static analyzeColorTemperature(color) {
    const warmth = (color.r + color.g) - color.b;
    if (warmth > 50) return 'warm';
    if (warmth < -50) return 'cool';
    return 'neutral';
  }

  static removeBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Use edge detection to find foreground
    const edgeMap = this.detectEdges(canvas);
    
    // Apply morphological operations to clean up
    this.fillBackgroundMask(data, edgeMap, canvas.width, canvas.height);

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  static detectEdges(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const edges = new Uint8Array(width * height);
    const sobel_x = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobel_y = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
            const k_idx = (ky + 1) * 3 + (kx + 1);
            gx += gray * sobel_x[k_idx];
            gy += gray * sobel_y[k_idx];
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        edges[(y * width) + x] = magnitude > 100 ? 255 : 0;
      }
    }

    return edges;
  }

  static fillBackgroundMask(data, edgeMap, width, height) {
    // Create mask where non-edge areas are made transparent
    for (let i = 0; i < edgeMap.length; i++) {
      const idx = i * 4;
      if (edgeMap[i] < 128) {
        // Background - make it transparent
        data[idx + 3] = Math.max(0, data[idx + 3] * 0.3);
      }
    }
  }

  static applyEnhancements(canvas, options, analysis) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Lighting enhancement
    if (options.lighting) {
      this.enhanceLighting(data, analysis);
    }

    // Color saturation
    if (options.colors) {
      this.enhanceColors(data, analysis);
    }

    // Contrast/Composition
    if (options.composition) {
      this.enhanceContrast(data, 1.2);
    }

    // Sharpness
    if (options.sharpness) {
      ctx.putImageData(imageData, 0, 0);
      return this.applySharpeningFilter(canvas);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  static enhanceLighting(data, analysis) {
    const target = analysis.avgBrightness > 0.5 ? 0.6 : 0.5;
    const factor = target / (analysis.avgBrightness + 0.1);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor * 1.05);
      data[i + 1] = Math.min(255, data[i + 1] * factor * 1.05);
      data[i + 2] = Math.min(255, data[i + 2] * factor * 1.05);
    }
  }

  static enhanceColors(data, analysis) {
    const saturation = analysis.avgSaturation < 0.5 ? 1.3 : 1.15;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;

      if (max > min) {
        const delta = (max - min) * (saturation - 1);
        data[i] = Math.min(255, Math.max(0, r + (r > l ? delta : -delta)));
        data[i + 1] = Math.min(255, Math.max(0, g + (g > l ? delta : -delta)));
        data[i + 2] = Math.min(255, Math.max(0, b + (b > l ? delta : -delta)));
      }
    }
  }

  static enhanceContrast(data, factor) {
    const intercept = 128 * (1 - factor);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] * factor + intercept));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + intercept));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + intercept));
    }
  }

  static applySharpeningFilter(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
    const output = new Uint8ClampedArray(data);

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

    const sharpened = ctx.createImageData(width, height);
    sharpened.data.set(output);
    ctx.putImageData(sharpened, 0, 0);
    return canvas;
  }

  static applyAestheticBackground(canvas, analysis, options) {
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = canvas.width;
    resultCanvas.height = canvas.height;
    const ctx = resultCanvas.getContext('2d');

    // Get aesthetic background colors
    const bgConfig = this.selectAestheticBackground(analysis, options);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, resultCanvas.height);
    gradient.addColorStop(0, bgConfig.color1);
    gradient.addColorStop(0.5, bgConfig.color2);
    gradient.addColorStop(1, bgConfig.color3);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

    // Add subtle pattern
    this.addBackgroundPattern(ctx, resultCanvas.width, resultCanvas.height, bgConfig.type);

    // Blend the subject image on top
    ctx.globalAlpha = 0.98;
    ctx.drawImage(canvas, 0, 0);

    // Add vignette effect
    this.addVignetteEffect(ctx, resultCanvas.width, resultCanvas.height);

    return resultCanvas;
  }

  static selectAestheticBackground(analysis, options) {
    const { avgBrightness, avgSaturation, colorTemp, dominantColor } = analysis;

    // Determine mood
    let mood = 'neutral';
    if (avgBrightness > 0.7) mood = 'bright';
    else if (avgBrightness < 0.3) mood = 'dark';
    else if (avgSaturation > 0.6) mood = 'vibrant';
    else if (avgSaturation < 0.3) mood = 'calm';

    // Select colors based on dominant color and mood
    let bgConfig = {
      type: 'default',
      color1: '#f5f5f5',
      color2: '#e0e0e0',
      color3: '#d0d0d0'
    };

    const r = dominantColor.r;
    const g = dominantColor.g;
    const b = dominantColor.b;

    // Create complementary colors
    const complement = {
      r: Math.max(0, Math.min(255, 255 - r)),
      g: Math.max(0, Math.min(255, 255 - g)),
      b: Math.max(0, Math.min(255, 255 - b))
    };

    const analogous1 = {
      r: Math.max(0, Math.min(255, r + 30)),
      g: Math.max(0, Math.min(255, g - 15)),
      b: Math.max(0, Math.min(255, b - 15))
    };

    const hex = (c) => `rgb(${c.r},${c.g},${c.b})`;

    switch (mood) {
      case 'bright':
        bgConfig = {
          type: 'bright_cheerful',
          color1: '#ffffff',
          color2: hex(analogous1),
          color3: '#f0f0f0'
        };
        break;
      case 'dark':
        bgConfig = {
          type: 'dark_moody',
          color1: '#1a1a1a',
          color2: '#2a2a2a',
          color3: '#0a0a0a'
        };
        break;
      case 'vibrant':
        bgConfig = {
          type: 'vibrant',
          color1: hex(complement),
          color2: hex(dominantColor),
          color3: hex(analogous1)
        };
        break;
      case 'calm':
        bgConfig = {
          type: 'calm_serene',
          color1: '#e8f0f8',
          color2: '#d0e0f0',
          color3: '#c0d0e8'
        };
        break;
    }

    return bgConfig;
  }

  static addBackgroundPattern(ctx, width, height, type) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';

    if (type.includes('calm') || type.includes('bright')) {
      // Subtle horizontal lines
      for (let y = 0; y < height; y += 50) {
        ctx.fillRect(0, y, width, 1);
      }
    } else if (type.includes('vibrant')) {
      // Diagonal lines for energy
      for (let x = 0; x < width + height; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - height, height);
        ctx.stroke();
      }
    } else if (type.includes('dark')) {
      // Noise for texture
      for (let i = 0; i < width * height * 0.01; i++) {
        ctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 3,
          Math.random() * 3
        );
      }
    }
  }

  static addVignetteEffect(ctx, width, height) {
    const vignette = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.05)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }
}

export default ImageProcessingEngine;