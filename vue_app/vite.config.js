import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // параметр base определят директорию прямой ссылки на статические файлы (используется при разыменовывании относительных ссылок в скриптах)
  base: "/static/spa",
  //для отладки
  mode: "development",
  build: {
    //Для отладки
    sourcemap: true,
    //сюда будем выкладывать артефакты
    outDir: "./dist/spa",
    //сюда картинки и прочее midia
    assetsDir: './assets',

    rollupOptions: {
      output: {
        //название главного файла javascript
        entryFileNames: '[name].js',
        //Название остальных файлов. Если не прописать, то к имени будет дописывать случайный id
        assetFileNames: '[name].[ext]',
      },
    },
  }
})
