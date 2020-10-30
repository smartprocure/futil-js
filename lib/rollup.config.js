export default {
  input: './src/index.js',
  external: ['lodash/fp.js'],
  output: [
    { file: '__dist/index.cjs.js', format: 'cjs', exports: 'named' },
    { file: '__dist/index.esm.js', format: 'es', exports: 'named' },
  ],
}
