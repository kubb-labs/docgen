import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'cjs',
      autoExtension: false,
      syntax: 'es2021',
      bundle: false,
      dts: true,
      output: {
        filename: {
          js: '[name].cjs',
        },
      },
    },
    {
      format: 'esm',
      syntax: 'es2021',
      bundle: false,
      dts: true,
      output: {
        filename: {
          js: '[name].js',
        },
      },
    },
  ],
  source: {
    entry: {
      'index': './src/index.ts',
      'astro': './src/astro.ts',
      'rspack': './src/rspack.ts',
      'vite': './src/vite.ts',
      'webpack': './src/webpack.ts',
      'rollup': './src/rollup.ts',
      'esbuild': './src/esbuild.ts',
      'nuxt': './src/nuxt.ts',
      'types': './src/types.ts'
    },
  },
  output: {
    target: 'node',
  },
});
