import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "assets/[name].js"
      }
    }
  },
  experimental: {
    renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
      console.log(filename,'????', typeof filename)
      return `./${filename}`;
      if (type === 'public') {
        return 'https://www.domain.com/' + filename
      }
      else if (path.extname(hostId) === '.js') {
        return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
      }
      else {
        return 'https://cdn.domain.com/assets/' + filename
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: './src/auto-imports.d.ts', 
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: './src/components.d.ts',
    }),
  ],
})
