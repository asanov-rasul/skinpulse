import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          950: "#08090d",
          900: "#0c0e14",
          850: "#10131b",
          800: "#151924",
          700: "#1c2130",
          600: "#262c3f",
        },
        rarity: {
          consumer: "#b0c3d9",
          industrial: "#5e98d9",
          milspec: "#4b69ff",
          restricted: "#8847ff",
          classified: "#d32ce6",
          covert: "#eb4b4b",
          contraband: "#e4ae39",
          gold: "#e4ae39",
        },
        accent: {
          up: "#3fd67a",
          down: "#ef4a5f",
          neutral: "#7d8698",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #e4ae39 0%, #f4d794 50%, #e4ae39 100%)",
        "covert-glow": "radial-gradient(circle at 50% 0%, rgba(235,75,75,0.15), transparent 70%)",
        "classified-glow": "radial-gradient(circle at 50% 0%, rgba(211,44,230,0.15), transparent 70%)",
        "grid-fade": "linear-gradient(to bottom, transparent, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow-covert": "0 0 24px -4px rgba(235,75,75,0.35)",
        "glow-classified": "0 0 24px -4px rgba(211,44,230,0.35)",
        "glow-gold": "0 0 24px -4px rgba(228,174,57,0.4)",
      },
      animation: {
        "ticker-scroll": "ticker-scroll 40s linear infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
