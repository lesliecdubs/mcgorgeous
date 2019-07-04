import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/mcgorgeous.common.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
},{
  input: 'src/index.js',
  output: {
    file: 'dist/mcgorgeous.js',
    format: 'umd',
    name: 'mcgorgeous'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
},{
  input: 'src/index.js',
  output: {
    file: 'dist/mcgorgeous.min.js',
    format: 'umd',
    name: 'mcgorgeous'
  },
  plugins: [
    resolve(),
    uglify(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
},{
  input: 'src/index.js',
  output: {
    file: 'dist/mcgorgeous.esm.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}];