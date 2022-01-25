import path from 'path';

import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'

const root = path.resolve(__dirname);

export default {
  input: 'index.ts',
  output: {
    dir: 'build',
    format: 'es'
  },
  plugins: [
    typescript({
      lib: ['es5', 'es6', 'dom'],
      target: 'esnext'
    }),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(root, 'src')
        },
        {
          find: '@types',
          replacement: path.resolve(root, 'types')
        },
      ],
    })
  ]
};