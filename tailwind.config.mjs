/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "#6B4423",
          "brown-dark": "#4A2C17",
          "brown-darker": "#3B1F0D",
          "brown-light": "#8B5A3C",
          cream: "#F7F4EF",
          "cream-dark": "#EFE6D8",
          "cream-darker": "#E8DCC8",
          gold: "#D4A853",
          "gold-light": "#E8C97A",
          "gold-dark": "#B8912E",
        },
        dark: "#1A0F0A",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in-down": "fadeInDown 0.7s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.7s ease-out forwards",
        "fade-in-right": "fadeInRight 0.7s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "drift-x": "driftX 8s ease-in-out infinite",
        "steam-1": "steam 6s ease-out infinite",
        "steam-2": "steam 8s ease-out infinite",
        "steam-3": "steam 7s ease-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "spin-slow": "spin 25s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        progress: "progress 2s ease-out forwards",
        "text-reveal": "textReveal 0.8s ease-out forwards",
        "ken-burns": "kenBurns 12s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "rotate-y": "rotateY 0.6s ease-out forwards",
        "gradient-orbit": "gradientOrbit 15s ease-in-out infinite",
        "particle-float": "particleFloat 12s ease-in-out infinite",
        "drift-y": "driftY 10s ease-in-out infinite",
        "morph-blob": "morphBlob 10s ease-in-out infinite",
        aurora: "aurora 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        driftX: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(30px)" },
        },
        steam: {
          "0%": { opacity: "0.4", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "0.2", transform: "translateY(-30px) scale(2)" },
          "100%": { opacity: "0", transform: "translateY(-60px) scale(3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        progress: {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(20px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.05) translate(-5px, -5px)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 168, 83, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 168, 83, 0.4)" },
        },
        rotateY: {
          "0%": { opacity: "0", transform: "perspective(800px) rotateY(15deg)" },
          "100%": { opacity: "1", transform: "perspective(800px) rotateY(0deg)" },
        },
        gradientOrbit: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(40px, -30px) scale(1.1)" },
          "50%": { transform: "translate(-30px, 40px) scale(0.95)" },
          "75%": { transform: "translate(-40px, -15px) scale(1.05)" },
        },
        particleFloat: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-18px) translateX(12px)" },
          "50%": { transform: "translateY(-6px) translateX(-18px)" },
          "75%": { transform: "translateY(-24px) translateX(8px)" },
        },
        driftY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-40px)" },
        },
        morphBlob: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        aurora: {
          "0%, 100%": { opacity: "0.3", transform: "translate(0, 0) rotate(0deg)" },
          "33%": { opacity: "0.5", transform: "translate(60px, -40px) rotate(120deg)" },
          "66%": { opacity: "0.2", transform: "translate(-40px, 30px) rotate(240deg)" },
          "100%": { opacity: "0.3", transform: "translate(0, 0) rotate(360deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
