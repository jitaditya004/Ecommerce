/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
          animation: {
      "scale-in": "scaleIn 0.35s ease-out",
    },
    keyframes: {
      scaleIn: {
        "0%": { transform: "scale(0.9)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
    },
    animation: {
      "success-bar": "successBar 1.5s ease-out forwards",
    },
    keyframes: {
      successBar: {
        "0%": { height: "100%" },
        "100%": { height: "0%" },
      },
    },


    },
  },
  plugins: [],
};
