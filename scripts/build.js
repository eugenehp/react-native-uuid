// Builds CommonJS (dist/cjs) and ES module (dist/esm) outputs, each with its
// own type declarations and a package.json marking its module format.
const {execFileSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const tsc = require.resolve('typescript/bin/tsc');

fs.rmSync(dist, {recursive: true, force: true});

for (const [dir, module, type] of [
  ['cjs', 'commonjs', 'commonjs'],
  ['esm', 'es2020', 'module'],
]) {
  const outDir = path.join(dist, dir);
  execFileSync(
    process.execPath,
    [tsc, '-p', 'tsconfig.build.json', '--module', module, '--outDir', outDir],
    {cwd: root, stdio: 'inherit'},
  );
  fs.writeFileSync(
    path.join(outDir, 'package.json'),
    JSON.stringify({type}, null, 2) + '\n',
  );
}
