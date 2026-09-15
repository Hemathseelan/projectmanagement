/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        charcoal: {
          950: '#0F1115',
          900: '#15181E',
          800: '#1E222B',
          700: '#2A2F3A',
        },
        indigo: {
          50: '#EEF1FF',
          100: '#E0E4FF',
          500: '#4F51E4',
          600: '#4340C9',
          700: '#3733A3',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 17, 21, 0.04), 0 1px 12px rgba(15, 17, 21, 0.04)',
      },
    },
  },
  plugins: [],
};
