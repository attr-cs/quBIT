/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors:{
                brand: {
                    surface: "#e9e9e9",
                    card: "#f8f8f8",
                    write: "#222",
                }
            }
        }
    },
    plugins: [],
}