/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      'custom-blue': '#8a99ce',
    },
    width: {
      'custom': '340px',
    },
    height: {
      'custom': '290.25px',
    }
  },
  },
  plugins: [],
}

