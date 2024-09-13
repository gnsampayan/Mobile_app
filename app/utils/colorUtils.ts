import { ITEMS_PER_COLOR_STEP_NESTED, ITEMS_PER_COLOR_STEP_LAYER } from '../constants/constants';

const rainbowColors = [
  { r: 255, g: 0, b: 0 },    // Red
  { r: 255, g: 127, b: 0 },  // Orange
  { r: 255, g: 255, b: 0 },  // Yellow
  { r: 0, g: 255, b: 0 },    // Green
  { r: 0, g: 0, b: 255 },    // Blue
  { r: 75, g: 0, b: 130 },   // Indigo
  { r: 148, g: 0, b: 211 }   // Violet
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
  return interpolateColor(rainbowColors[colorIndex], rainbowColors[nextColorIndex], factor);
};
