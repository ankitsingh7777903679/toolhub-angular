/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#1a8fe3',
                secondary: '#6f56ec',
                accent: '#F66213',
                danger: '#D61C4E',
            },
            fontFamily: {
                'k2d': ['K2D', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
