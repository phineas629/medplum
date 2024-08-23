/* global console */
/* eslint no-console: "off" */

import { readFile } from 'fs/promises';
import esbuild from 'esbuild';
import { writeFileSync } from 'fs';

// Read the package.json file
const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf-8'));

const options = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  loader: { '.ts': 'ts' },
  resolveExtensions: ['.ts'],
  target: 'es2021',
  tsconfig: 'tsconfig.json',
  minify: true,
  sourcemap: true,
  external: ['@medplum/core', 'iconv-lite'],
};

esbuild
  .build({
    ...options,
    format: 'cjs',
    outfile: './dist/cjs/index.cjs',
  })
  .then(() => writeFileSync('./dist/cjs/package.json', '{"type": "commonjs"}'))
  .catch(console.error);

esbuild
  .build({
    ...options,
    format: 'esm',
    outfile: './dist/esm/index.mjs',
  })
  .then(() => writeFileSync('./dist/esm/package.json', '{"type": "module"}'))
  .catch(console.error);