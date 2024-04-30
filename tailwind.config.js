/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/utils/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "2560px"
      },
      zIndex: {
        "500": "500"
      },
      colors: {
        tbfColor: {   
          darkpurple: '#6D00C2',
          lightpurple: '#a36dce',
          lighterpurple: '#d5bbe9',
          lighterpurple1: '#e3cef4',
          lighterpurple2: '#d5bbe9',
          lighterpurple3: '#f0e5f9',
          lighterpurple4: '#f6effb',
          lightgrey: '#f9f9f9',
          lightergrey: '#e8e8e8',
          middlegrey: '#e0e0e0',
          middlegrey2: '#c7c7c7',
          middlegrey3: '#9f9f9f',
          middlegrey4: '#cccccc',
          darkgrey: '#828282',
          darkergrey: '#5c5c5c',
        }
      },
      dropShadow: {
        contractedFolder: '0 0 2px rgba(0,0,0,0.1)',
        no_pos: '0 8px 5px rgba(0,0,0,0.1)',
        focus: "0 0px 2px rgba(0, 0, 0, 0.1)"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

