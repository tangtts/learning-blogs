/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./docs/.vitepress/**/*.{js,ts,vue}",
    "./docs/**/*.md",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: "#5672cd",
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
