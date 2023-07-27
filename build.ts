import { build } from 'esbuild';

import { rm, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

await rm('dist', { recursive: true, force: true });
await mkdir('dist');

const scriptDist = join('dist', 'script.js');
const workerDist = join('dist', 'worker.js');

await build({
	entryPoints: ['src/index.ts'],
	platform: 'browser',
	format: 'iife',
	bundle: true,
	minify: true,
	outfile: scriptDist,
	logLevel: 'info',
});

const scriptDistContents = await readFile(scriptDist, { encoding: 'utf8' });

await build({
	entryPoints: ['src/worker.ts'],
	platform: 'neutral',
	format: 'esm',
	bundle: true,
	minify: true,
	outfile: workerDist,
	define: { TENABLE_SCRIPT: JSON.stringify(scriptDistContents) },
	logLevel: 'info',
});
