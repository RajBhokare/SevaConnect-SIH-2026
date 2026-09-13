/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Primary: Deep Trust-Blue (#0F3D5C)
        primary: {
          50: '#f0f6fa',
          100: '#e1edf4',
          200: '#c2dbe8',
          300: '#94bfd6',
          400: '#5c98bd',
          500: '#0F3D5C',
          600: '#0d3550',
          700: '#0a2a40',
          800: '#082030',
          900: '#051520',
          DEFAULT: '#0F3D5C',
        },
        // 2. Accent: Warm Gold (#C9973B) - Reserved only for top-tier badge & single hero highlight
        accent: {
          50: '#fbf7ee',
          100: '#f7edd7',
          200: '#eedcb0',
          300: '#e2c37e',
          400: '#d7ab53',
          500: '#C9973B',
          600: '#b4832f',
          700: '#956823',
          800: '#734d1b',
          900: '#4d300f',
          DEFAULT: '#C9973B',
        },
        // 3. Success: Cooperative Green (#1E8A6E) - Verified & completed states only
        success: {
          50: '#eff9f6',
          100: '#daf2eb',
          200: '#b5e5d7',
          300: '#83d2be',
          400: '#4ebd9f',
          500: '#1E8A6E',
          600: '#17735b',
          700: '#135c49',
          800: '#10493b',
          900: '#0c382e',
          DEFAULT: '#1E8A6E',
        },
        // 4. Danger: Emergency / Urgent Red (#DC2626)
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#DC2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#DC2626',
        },
        // 5. AI: Subtle Violet (#7C3AED) - Used strictly for AI Ops, Forecast & Allocation
        ai: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
          DEFAULT: '#7c3aed',
        },
        // 5. Neutral: Slate Scale
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
