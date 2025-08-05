export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        iosBlue: "#007AFF",
        iosGray: "#f2f2f7",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
