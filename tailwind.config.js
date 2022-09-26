/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs'],
  theme: {
    extend: {
      spacing: {
        '600px': '600px',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
