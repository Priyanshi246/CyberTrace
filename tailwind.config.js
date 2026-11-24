/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102A56',
          deep: '#091A35',
          mid: '#173a70',
          light: '#24498a',
        },
        royal: '#2563EB',
        accent: {
          cyan: '#38BDF8',
          cyanDark: '#0284C7',
        },
        ice: '#F4F8FF',
        risk: {
          high: '#DC2626',
          medium: '#F59E0B',
          low: '#16A34A',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,42,86,0.08), 0 8px 24px rgba(16,42,86,0.06)',
        'card-hover': '0 4px 12px rgba(16,42,86,0.12), 0 12px 32px rgba(16,42,86,0.10)',
        deep: '0 12px 40px rgba(9,26,53,0.35)',
      },
    },
  },
  plugins: [],
};
