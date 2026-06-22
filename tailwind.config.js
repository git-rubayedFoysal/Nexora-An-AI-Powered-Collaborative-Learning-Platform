export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#080c1a", 2: "#0d1225", 3: "#131929", 4: "#1a1f35" },
        violet: { DEFAULT: "#7c5af7", light: "#a384ff", dark: "#5b3fd4" },
        teal: {
          DEFAULT: "#0fbf8a",
          light: "#3dd9a8",
          dim: "rgba(15,191,138,0.12)",
        },
        amber: { DEFAULT: "#f5a623", dim: "rgba(245,166,35,0.12)" },
        coral: {
          DEFAULT: "#f05a5a",
          light: "#ff7b7b",
          dim: "rgba(240,90,90,0.12)",
        },
        slate: { DEFAULT: "#8892a4", dark: "#545d72", light: "#b8c0ce" },
        glass: {
          DEFAULT: "rgba(255,255,255,0.04)",
          2: "rgba(255,255,255,0.07)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          2: "rgba(255,255,255,0.14)",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      keyframes: {
        shimmer: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-glow-teal": {
          "0%,100%": { boxShadow: "0 0 0 0 transparent" },
          "50%": { boxShadow: "0 0 16px 4px rgba(15,191,138,0.28)" },
        },
        "pulse-glow-amber": {
          "0%,100%": { boxShadow: "0 0 0 0 transparent" },
          "50%": { boxShadow: "0 0 16px 4px rgba(245,166,35,0.28)" },
        },
        "pulse-glow-coral": {
          "0%,100%": { boxShadow: "0 0 0 0 transparent" },
          "50%": { boxShadow: "0 0 16px 4px rgba(240,90,90,0.28)" },
        },
      },
      animation: {
        shimmer: "shimmer 4s ease infinite",
        "fade-up": "fade-up .4s ease both",
        float: "float 3.5s ease-in-out infinite",
        "pulse-teal": "pulse-glow-teal 3s ease-in-out infinite",
        "pulse-amber": "pulse-glow-amber 3s ease-in-out infinite",
        "pulse-coral": "pulse-glow-coral 3s ease-in-out infinite",
      },
      backgroundImage: {
        mesh: "radial-gradient(ellipse 70% 50% at 15% 0%,rgba(124,90,247,.2) 0%,transparent 60%),radial-gradient(ellipse 55% 60% at 85% 95%,rgba(15,191,138,.1) 0%,transparent 55%)",
      },
    },
  },
};
