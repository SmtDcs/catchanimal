/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#F5E6D3",
        wood: "#C4956A",
        "wood-dark": "#A07850",
        "wood-light": "#D4B896",
        primary: "#E8A87C",
        "primary-dark": "#D4906A",
        "primary-light": "#F0C4A0",
        success: "#A8D5BA",
        "success-dark": "#8CBF9E",
        coin: "#F7DC6F",
        "coin-dark": "#E0C450",
        rare: "#E8B4B4",
        "rare-dark": "#D49A9A",
        "text-primary": "#4A3728",
        "text-secondary": "#8B7355",
        "text-muted": "#B8A08A",
        "card-bg": "#FFF8F0",
        "card-border": "#E8DDD0",
      },
      fontFamily: {
        display: ["System"],
        body: ["System"],
      },
    },
  },
};
