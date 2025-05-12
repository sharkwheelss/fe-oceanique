import type { Config } from 'tailwindcss'

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                sharemono: ['Share Tech Mono', 'monospace'],
            },
        },
    },
    content: ['src/**/*.{js,ts,jsx,tsx}'], // pastikan ini sesuai struktur proyekmu
    plugins: [],
}
export default config