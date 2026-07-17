const esbuild = require('esbuild');
const { cp, mkdir, rm, watch } = require('node:fs');
const { promisify } = require('node:util');
const path = require('node:path');

const copy = promisify(cp);
const makeDirectory = promisify(mkdir);
const remove = promisify(rm);
const rootDirectory = path.resolve(__dirname, '..');
const sourceDirectory = path.join(rootDirectory, 'src');
const buildDirectory = path.join(rootDirectory, 'build');
const isWatch = process.argv.includes('--watch');

const copyStaticFiles = async () => {
  await makeDirectory(buildDirectory, { recursive: true });
  await copy(sourceDirectory, buildDirectory, {
    recursive: true,
    force: true,
    filter: (source) => !source.endsWith('.ts'),
  });
};

const buildOptions = {
  entryPoints: {
    all: path.join(sourceDirectory, 'main.ts'),
    highlight: path.join(rootDirectory, 'node_modules', 'highlight.js', 'styles', 'github.css'),
  },
  bundle: true,
  outdir: buildDirectory,
  platform: 'browser',
  sourcemap: true,
  target: ['es2015'],
};

const main = async () => {
  await remove(buildDirectory, { recursive: true, force: true });
  await copyStaticFiles();

  if (!isWatch) {
    await esbuild.build(buildOptions);
    return;
  }

  const context = await esbuild.context(buildOptions);
  await context.watch();
  const server = await context.serve({
    servedir: buildDirectory,
    port: 8042,
  });

  watch(sourceDirectory, { recursive: true }, (_event, filename) => {
    if (filename && !filename.endsWith('.ts')) {
      copyStaticFiles().catch((error) => console.error(error));
    }
  });

  console.log(`Serving API Explorer at http://${server.host}:${server.port}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
