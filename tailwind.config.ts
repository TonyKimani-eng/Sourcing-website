import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#edf4ff",
          100: "#d7e6ff",
          500: "#1e66b1",
          700: "#0d3d6f",
          800: "#0a2d55",
          900: "#061f3d",
          950: "#031426"
        },
        teal: {
          400: "#20c5b4",
          500: "#11a99d",
          600: "#0b857e"
        },
        gold: {
          400: "#f5c85f",
          500: "#d9a92d",
          600: "#b88419"
        },
        ember: {
          500: "#ff4a1c",
          600: "#e63a12"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(3, 20, 38, 0.10)",
        glow: "0 20px 70px rgba(17, 169, 157, 0.28)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
