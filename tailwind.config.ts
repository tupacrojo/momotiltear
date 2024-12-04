import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kick: {
          primary: "var(--kick-primary)",
          secondary: "var(--kick-secondary)",
          tertiary: "var(--kick-tertiary)",
          quaternary: "var(--kick-quaternary)",
          quinary: "var(--kick-quinary)",
          senary: "var(--kick-senary)",
          septenary: "var(--kick-septenary)",
          octonary: "var(--kick-octonary)",
          nonary: "var(--kick-nonary)",
          denary: "var(--kick-denary)",
          light: "var(--kick-light)",
          dark: "var(--kick-dark)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
