import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        heading: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
