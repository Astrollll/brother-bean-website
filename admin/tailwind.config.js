/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#D4A853",
          "gold-light": "#E4C27A",
          "gold-dark": "#B8873A",
          brown: "#6B4423",
          "brown-dark": "#4A2E16",
          "brown-darker": "#2E1C0D",
          cream: "#F5EDE0",
          "cream-dark": "#E8DCC8",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
