/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",   
    "./src/**/*.{html,js}", 
  ],
  safelist: [
    'input-global',
    'select-global'
  ],
  theme: {
    extend: {
      colors: {
        'blue': '#40A9F4',
        'dark-blue': '#001E30',
        'dark-gray': '#1A1A1A',
        'light-blue': '#3B82F6',
        'ink': '#162323',
        'text-gray-600': '#666666',
        'dark': '#0E1414',
        'text-gray-500': '#8F8F8F',
        'text-gray-400': '#BCBCBC'
      },
      fontFamily: {
        'heading': ['P22MackinacPro-ExtraBold', 'serif'],
        'body': ['Roboto', 'sans-serif'],
        'sans': ['Roboto', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1340px',
        },
      },
      borderRadius: {
        'xs': '0.125rem', // 2px
        'sm': '0.25rem',  // 4px
        'md': '0.375rem', // 6px
        'lg': '0.5rem',   // 8px
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-pattren.png')",
      },
      backgroundPosition: {
        'center-bottom': 'center bottom',
      },
    },
  },
  plugins: [],
}