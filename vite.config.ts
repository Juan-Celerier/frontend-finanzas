import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate recharts into its own chunk
          recharts: ["recharts"],
          // Vendor chunk for other dependencies
          vendor: ["react", "react-dom"],
        },
      },
    },
    // Enable source maps for better debugging in production
    sourcemap: false,
    // Minify for smaller bundle size
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["recharts"],
  },
});
