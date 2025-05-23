// Color palette utility functions
// Based on the Python script's color handling

/**
 * Load color palettes from the nice-color-palettes source
 * @returns {Promise<Array>} Array of color palettes
 */
export const loadColorPalettes = async () => {
  try {
    const response = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json");
    return await response.json();
  } catch (error) {
    console.error('Failed to load color palettes:', error);
    // Fallback palettes
    return [
      ['#ff3b30', '#ff9500', '#4cd2ff', '#5ac8fa', '#fc96ff'],
      ['#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#ffffff'],
      ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'],
      ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#5856d6']
    ];
  }
};

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (with or without #)
 * @returns {Object} RGB values {r, g, b}
 */
export const hexToRgb = (hex) => {
  const cleanHex = hex.replace('#', '');
  return {
    r: parseInt(cleanHex.substr(0, 2), 16),
    g: parseInt(cleanHex.substr(2, 2), 16),
    b: parseInt(cleanHex.substr(4, 2), 16)
  };
};

/**
 * Convert RGB values to hex string
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
export const rgbToHex = (r, g, b) => {
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};

/**
 * Convert RGB to HSL
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {Object} HSL values {h, s, l}
 */
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h, s, l };
};

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-1)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {Object} RGB values {r, g, b}
 */
export const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Create background colors by mixing colors from the palette
 * Based on the Python script's create_background_colors function
 * @param {Array} colorPalette - Array of hex color strings
 * @returns {Object} Background colors {bg_inner, bg_outer}
 */
export const createBackgroundColors = (colorPalette) => {
  if (!colorPalette || colorPalette.length < 2) {
    return { bg_inner: '#f0f0f0', bg_outer: '#e0e0e0' };
  }

  // Mix the first two colors of the palette
  const color1 = hexToRgb(colorPalette[0]);
  const color2 = hexToRgb(colorPalette[1]);

  // Mix colors (50% blend)
  const mixed = {
    r: (color1.r + color2.r) / 2,
    g: (color1.g + color2.g) / 2,
    b: (color1.b + color2.b) / 2
  };

  // Convert to HSL and desaturate
  const hsl = rgbToHsl(mixed.r, mixed.g, mixed.b);
  hsl.s = Math.max(0, hsl.s - 0.1); // Desaturate by 10%

  // Convert back to RGB
  const desaturated = hslToRgb(hsl.h, hsl.s, hsl.l);

  // Create lighter version (increase lightness)
  const hslLight = { ...hsl };
  hslLight.l = Math.min(1, hsl.l + 0.1);
  const lighter = hslToRgb(hslLight.h, hslLight.s, hslLight.l);

  // Create darker version (decrease lightness)
  const hslDark = { ...hsl };
  hslDark.l = Math.max(0, hsl.l - 0.1);
  const darker = hslToRgb(hslDark.h, hslDark.s, hslDark.l);

  return {
    bg_inner: rgbToHex(lighter.r, lighter.g, lighter.b),
    bg_outer: rgbToHex(darker.r, darker.g, darker.b)
  };
};

/**
 * Get two different colors from the palette
 * Based on the Python script's get_two_colors function
 * @param {Array} colorPalette - Array of hex color strings
 * @returns {Object} Two colors {foreground, background}
 */
export const getTwoColors = (colorPalette) => {
  if (!colorPalette || colorPalette.length === 0) {
    return { foreground: '#000000', background: '#ffffff' };
  }

  const colorList = [...colorPalette];
  
  // Get random index for this array of colors
  const colorIndex = Math.floor(Math.random() * colorList.length);
  
  // Set the background to the color at that array
  const background = colorList[colorIndex];
  
  // Remove that color from the options
  colorList.splice(colorIndex, 1);
  
  // Set the foreground to any other color in the array, or fallback if only one color
  const foreground = colorList.length > 0 ? 
    colorList[Math.floor(Math.random() * colorList.length)] : 
    (background === '#ffffff' ? '#000000' : '#ffffff');

  return { foreground, background };
};

/**
 * Generate a random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max (inclusive)
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Choose a random element from an array
 * @param {Array} array - Array to choose from
 * @returns {*} Random element from the array
 */
export const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
