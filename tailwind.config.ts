
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom theme colors for Ethiopian/Eritrean restaurant with exact hex values
        cream: "#F1ECE2",       // Main background (light theme)
        plum: "#4D4052",        // Text, headings, labels
        eggplant: "#301934",    // Secondary text, icons
        turmeric: "#DAA520",    // Buttons, highlights, calls-to-action
        sand: "#CDAF56",        // Borders, edges, dividers, accents
        coffee: "#5D4225",      // Tertiary elements, footer
        amber: {
          DEFAULT: "#F59E0B",   // Updated from f59e0b to #F59E0B
        },
        
        // Sidebar specific colors
        sidebar: "hsl(var(--sidebar))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-ring": "hsl(var(--sidebar-ring))",
        "sidebar-accent": "hsl(var(--sidebar-accent))",
        "sidebar-accent-foreground": "hsl(var(--sidebar-accent-foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Update gradients for the warm blend theme to use sand colors (#CDAF56)
      backgroundImage: {
        "warm-gradient": "linear-gradient(135deg, #FFFFFF 0%, #f5f5dc 100%)",
        "warm-accent": "linear-gradient(90deg, hsla(50, 57%, 57%, 1) 0%, hsla(43, 74%, 49%, 1) 100%)",
        "warm-card": "linear-gradient(109.6deg, rgba(245,245,220,0.3) 11.2%, rgba(255,255,255,1) 91.1%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
