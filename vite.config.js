import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./", // بيشتغل على أي مسار استضافة (GitHub Pages وغيره)
  plugins: [react(), tailwindcss()],
});