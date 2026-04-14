/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63" },
        surface: { 50: "#f0f4f8", 100: "#e2e8f0", 800: "#1a2236", 900: "#111827", 950: "#0a0f1a" },
        emerald: { 400: "#34d399", 500: "#10b981", 600: "#059669" },
      },
      fontFamily: {
        display: ['"DM Sans"', "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
