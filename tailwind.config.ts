import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007BFF",
        textPrimary: "#18181B",
        textSecondary: "#64728F",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
