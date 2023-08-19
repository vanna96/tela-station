import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 8080,
    // host: 'localhost'
    // host: '192.168.1.120'
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ]
    // alias: {
    //   '@components': path.resolve(__dirname, './src/components'),
    //   'assets': path.resolve(__dirname, './src/assets'),
    //   'utilies' : path.resolve(__dirname, './src/utilies'),
    //   'models' : path.resolve(__dirname, './src/models'),
    // },
  },
})
