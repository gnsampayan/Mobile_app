import { ITEMS_PER_COLOR_STEP_NESTED, ITEMS_PER_COLOR_STEP_LAYER } from '../constants/constants';

const rainbowColors = [
  { r: 90, g: 0, b: 0 },    // Red
  { r: 141, g: 81, b: 26 },  // Orange
  { r: 173, g: 153, b: 45 },  // Yellow
  { r: 17, g: 83, b: 19 },    // Green
  { r: 44, g: 60, b: 100 },    // Blue
  { r: 81, g: 52, b: 98 },   // Indigo
  { r: 111, g: 49, b: 101 }   // Violet
];

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const interpolateColor = (color1: RGBColor, color2: RGBColor, factor: number): string => {
  const r = Math.round(color1.r + factor * (color2.r - color1.r));
  const g = Math.round(color1.g + factor * (color2.g - color1.g));
  const b = Math.round(color1.b + factor * (color2.b - color1.b));
  return `rgb(${r},${g},${b})`;
};

export const getColorForIndex = (index: number, isNested: boolean, layerIndex: number) => {
  const ITEMS_PER_COLOR_STEP = isNested ? ITEMS_PER_COLOR_STEP_NESTED : ITEMS_PER_COLOR_STEP_LAYER;
  const adjustedIndex = index + layerIndex * ITEMS_PER_COLOR_STEP;
  const colorIndex = Math.floor(adjustedIndex / ITEMS_PER_COLOR_STEP) % rainbowColors.length;
  const nextColorIndex = (colorIndex + 1) % rainbowColors.length;
  const factor = (adjustedIndex % ITEMS_PER_COLOR_STEP) / ITEMS_PER_COLOR_STEP;

  // Ensure the very first item starts with red
  if (index === 0 && layerIndex === 0) {
    return `rgb(${rainbowColors[0].r},${rainbowColors[0].g},${rainbowColors[0].b})`;
  }

  return interpolateColor(rainbowColors[colorIndex], rainbowColors[nextColorIndex], factor);
};
