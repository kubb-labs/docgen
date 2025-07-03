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
      index: 'src/**',
    }
  },
  output: {
    target: 'node',
  },
});
