import react from '@vitejs/plugin-react'
import docgen from "unplugin-docgen/vite"
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    docgen()
  ],
})
