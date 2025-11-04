import type { Config } from 'tailwindcss'

export default {
  content: ['index.html', 'src/**/*.{ts,tsx,js,jsx}'],
  theme: {  
    extend: {
      fontFamily: {
        pretendard: ['var(--font-zen-serif)'],
      },
    }, 
  },
  plugins: [],
} satisfies Config
