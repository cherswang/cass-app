import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [
    uni(),
    {
      name: 'fix-output-format',
      configResolved(config) {
        if (config.build && config.build.rollupOptions && config.build.rollupOptions.output) {
          const output = config.build.rollupOptions.output;
          if (Array.isArray(output)) {
            output.forEach(outputOption => {
              if (outputOption.format === 'iife' || outputOption.format === 'umd') {
                outputOption.manualChunks = undefined;
              }
            });
          } else if (output) {
            if (output.format === 'iife' || output.format === 'umd') {
              output.manualChunks = undefined;
            }
          }
        }
      }
    }
  ]
})