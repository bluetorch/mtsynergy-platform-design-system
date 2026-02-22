import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tokens/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: false, // Don't clean dist to preserve tokens.json
  outDir: 'dist',
});
