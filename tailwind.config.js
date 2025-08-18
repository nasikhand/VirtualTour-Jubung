/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        bg: {
          mls: {
            "natural-gray": "#F3F3F3",
            "cool-gray": "#E9EEF2",
          },
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        customBlue: "#7892A9",
        brightOrange: "#FF7D10",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          mls: {
            yellow: "#FFFF00",
            green: "#5FD80A",
            blue: "#3898F9",
            orange: "#FF7D10",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          mls: {
            yellow1: "#E5DC03",
            yellow2: "#FFFF00",
            green1: "#378308",
            green2: "#BFFF88",
            blue1: "#1A64DB",
            blue2: "#A8D9FF",
            red1: "#B12424",
            red2: "#FBCDCD",
            orange1: "#E56903",
            orange2: "#FFEAD9",
          },
        },
        "secondary-mls": {
          "yellow-1": "#E5DC03",
          "green-1": "#378308",
          "blue-1": "#1A64DB",
          "red-1": "#B12424",
          "orange-1": "#E56903",
          "yellow-2": "#FFFF00",
          "green-2": "#BFFF88",
          "blue-2": "#A8D9FF",
          "red-2": "#FBCDCD",
          "orange-2": "#FFEAD9",
        },
        "primary-mls": {
          yellow: "#FFFF00",
          green: "#5FD80A",
          blue: "#3898F9",
          red: "#E74C4C",
          orange: "#FF7D10",
        },
        state: {
          danger: "#E74C4C",
          warning: "#FFD200",
          success: "#5FD80A",
        },
        "bg-mls": {
          "neutral-gray": "#F3F3F3",
          "cool-gray": "#E9EEF2",
        },
        "grayscale-mls": {
          black: "#292929",
          "dark-1": "#3D3D3D",
          "dark-2": "#525252",
          "dark-3": "#7C7C7C",
          "gray-1": "#DCDCDC",
          "gray-2": "#D9D9D9",
          "gray-3": "#E6E6E6",
          white: "#FCFCFC",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(220 13% 91%)",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "#ffff",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "#ffff",
          ring: "hsl(var(--sidebar-ring))",
        },
        keyframes: {
          'slide-left': {
            '0%': { transform: 'translateX(0)', opacity: 1 },
            '100%': { transform: 'translateX(-100%)', opacity: 0 },
          },
        },
        animation: {
          'slide-left': 'slide-left 0.5s ease forwards',
        },
      },
      backgroundImage: {
        "shape-1": "url(@/assets/svg/shape-1.svg)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  plugins: [require('@tailwindcss/line-clamp')],

};
