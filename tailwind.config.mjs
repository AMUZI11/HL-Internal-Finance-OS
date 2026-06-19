/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Premium Depth Palette
        navy: {
          light: '#EFF6FF',
          ice: '#DBEAFE',
          bright: '#3B82F6',
          deep: '#1E40AF',
          dark: '#1e3a8a',
        },
        amber: {
          cream: '#FFFBEB',
          soft: '#FDE68A',
          gold: '#F59E0B',
          deep: '#D97706',
        },
        emerald: {
          mint: '#D1FAE5',
          medium: '#10B981',
          deep: '#059669',
        },
        rose: {
          light: '#FEE2E2',
          medium: '#EF4444',
          deep: '#DC2626',
        },
        charcoal: {
          light: '#6B7280',
          medium: '#374151',
          dark: '#1F2937',
          black: '#111827',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
