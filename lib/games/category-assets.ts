export type CategoryAsset = {
  emoji: string;
  gradient: [string, string];
  accent: string;
};

const CATEGORY_ASSETS: Record<string, CategoryAsset> = {
  "puzzle-games": { emoji: "🧩", gradient: ["#2638c4", "#99cf16"], accent: "#2638c4" },
  "maze-games": { emoji: "🌀", gradient: ["#0081ca", "#f7e03b"], accent: "#0081ca" },
  "hidden-object-games": { emoji: "🔍", gradient: ["#e5296b", "#bc005a"], accent: "#e5296b" },
  "coloring-games": { emoji: "🎨", gradient: ["#99cf16", "#e5296b"], accent: "#99cf16" },
  "drawing-games": { emoji: "✏️", gradient: ["#2638c4", "#e5296b"], accent: "#2638c4" },
  "music-games": { emoji: "🎵", gradient: ["#bc005a", "#2638c4"], accent: "#bc005a" },
  "animal-games": { emoji: "🐾", gradient: ["#99cf16", "#0081ca"], accent: "#99cf16" },
  "dinosaur-games": { emoji: "🦕", gradient: ["#6b8e23", "#2638c4"], accent: "#6b8e23" },
  "space-games": { emoji: "🚀", gradient: ["#1a1a6e", "#0081ca"], accent: "#1a1a6e" },
  "food-games": { emoji: "🍳", gradient: ["#e5296b", "#f7e03b"], accent: "#e5296b" },
  "math-games": { emoji: "🔢", gradient: ["#2638c4", "#f7e03b"], accent: "#2638c4" },
  "reading-games": { emoji: "📚", gradient: ["#0081ca", "#99cf16"], accent: "#0081ca" },
  "science-games": { emoji: "🔬", gradient: ["#99cf16", "#2638c4"], accent: "#99cf16" },
  "geography-games": { emoji: "🌍", gradient: ["#0081ca", "#99cf16"], accent: "#0081ca" },
  "sports-games": { emoji: "⚽", gradient: ["#99cf16", "#2638c4"], accent: "#99cf16" },
  "weather-games": { emoji: "⛅", gradient: ["#0081ca", "#f7e03b"], accent: "#0081ca" },
  "history-games": { emoji: "🏛️", gradient: ["#bc005a", "#f7e03b"], accent: "#bc005a" },
  "adventure-games": { emoji: "🗺️", gradient: ["#6b8e23", "#e5296b"], accent: "#6b8e23" },
  "arcade-games": { emoji: "👾", gradient: ["#bc005a", "#2638c4"], accent: "#bc005a" },
  "edutainment-games": { emoji: "🧒", gradient: ["#67B9F4", "#99cf16"], accent: "#67B9F4" },
  "logic-puzzles": { emoji: "🧠", gradient: ["#44B66A", "#2638c4"], accent: "#44B66A" },
  "brain-games": { emoji: "🎯", gradient: ["#0C234F", "#61C1DF"], accent: "#61C1DF" },
  "logic-games": { emoji: "💡", gradient: ["#2638c4", "#e5296b"], accent: "#2638c4" },
  "memory-games": { emoji: "🃏", gradient: ["#2638c4", "#e5296b"], accent: "#2638c4" },
  "quiz-games": { emoji: "❓", gradient: ["#f7e03b", "#2638c4"], accent: "#2638c4" },
  "creative-games": { emoji: "🎨", gradient: ["#e5296b", "#99cf16"], accent: "#e5296b" },
  "creativity-games": { emoji: "✨", gradient: ["#e5296b", "#99cf16"], accent: "#e5296b" },
  "seasonal-games": { emoji: "🎃", gradient: ["#e5296b", "#f7e03b"], accent: "#e5296b" },
};

const DEFAULT_ASSET: CategoryAsset = {
  emoji: "🎮",
  gradient: ["#2638c4", "#99cf16"],
  accent: "#2638c4",
};

export function getCategoryAsset(categoryId: string): CategoryAsset {
  return CATEGORY_ASSETS[categoryId] ?? DEFAULT_ASSET;
}
