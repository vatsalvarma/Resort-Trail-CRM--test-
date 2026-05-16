import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f0f7f2",
          100: "#dcede2",
          200: "#bcdbc8",
          300: "#8ec1a5",
          400: "#5da07d",
          500: "#3d8060",
          600: "#2d6649",
          700: "#265239",
          800: "#1a3a2a",
          900: "#0d1f17",
          950: "#060f0b",
        },
        gold: {
          50:  "#fdf9ee",
          100: "#f9f0d0",
          200: "#f2e09d",
          300: "#e9cc62",
          400: "#d4a853",
          500: "#c9a84c",
          600: "#b8883a",
          700: "#9a6b2c",
          800: "#7d5222",
          900: "#5f3c18",
        },
        beige: {
          50:  "#fdfcfa",
          100: "#f9f6f0",
          200: "#f5f0e8",
          300: "#ede8df",
          400: "#e0d9ce",
          500: "#cfc7ba",
          600: "#b8ada0",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.3s ease-out",
        shimmer:          "shimmer 2s infinite linear",
        pulse:            "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "forest-gradient":   "linear-gradient(135deg, #0d1f17 0%, #1a3a2a 50%, #2d6649 100%)",
        "gold-gradient":     "linear-gradient(135deg, #c9a84c 0%, #d4a853 50%, #e9cc62 100%)",
      },
      boxShadow: {
        "glass":        "0 8px 32px 0 rgba(13, 31, 23, 0.37)",
        "gold":         "0 4px 24px 0 rgba(201, 168, 76, 0.25)",
        "card":         "0 2px 8px 0 rgba(0,0,0,0.08), 0 1px 3px 0 rgba(0,0,0,0.06)",
        "card-hover":   "0 8px 32px 0 rgba(0,0,0,0.12), 0 2px 8px 0 rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
