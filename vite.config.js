import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/website/',
  // .jar is not a Vite asset type by default, so importing the game download
  // would be parsed as JavaScript
  assetsInclude: ['**/*.jar'],
})
