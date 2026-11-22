// Generates src/api/generated/schema.ts from the vendored mobile contract, or,
// with --check, fails when the committed client no longer matches the contract.
//
//   node scripts/api-codegen.mjs           regenerate
//   node scripts/api-codegen.mjs --check   fail on drift (CI)
//   node scripts/api-codegen.mjs --check --upstream <file>
//                                          also fail when the vendored contract
//                                          differs from the given backend copy
//
// The generator lives in tools/api-codegen with its own lockfile, because
// openapi-typescript 7 peers on TypeScript 5 and the app uses TypeScript 6.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = join(root, 'contracts/mobile/openapi.yaml');
const sourcePath = join(root, 'contracts/mobile/SOURCE.json');
const outputPath = join(root, 'src/api/generated/schema.ts');

const args = process.argv.slice(2);
const check = args.includes('--check');
const upstreamIndex = args.indexOf('--upstream');
const upstream = upstreamIndex >= 0 ? args[upstreamIndex + 1] : null;

const toolDir = join(root, 'tools/api-codegen/node_modules/openapi-typescript');
let openapiTS, astToString;
try {
  const manifest = JSON.parse(readFileSync(join(toolDir, 'package.json'), 'utf8'));
  const entry = manifest.exports['.'].import;
  ({ default: openapiTS, astToString } = await import(pathToFileURL(join(toolDir, entry)).href));
} catch {
  console.error('openapi-typescript is missing. Run: npm ci --prefix tools/api-codegen');
  process.exit(2);
}

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const normalize = (text) => text.replace(/\r\n/g, '\n');

const contract = normalize(readFileSync(contractPath, 'utf8'));
const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const contractHash = sha256(contract);

const ast = await openapiTS(contract, {
  // Fields the contract marks required stay required; unknown response fields
  // are ignored at runtime, as the conventions ask.
  exportType: true,
  immutable: true,
  alphabetize: false,
});
const header = [
  '// Generated from contracts/mobile/openapi.yaml by scripts/api-codegen.mjs. Do not edit.',
  `// Contract: build-backend ${source.path} at ${source.commit}`,
  `// Contract sha256: ${contractHash}`,
  '/* eslint-disable */',
  '',
].join('\n');
const generated = header + astToString(ast);

const problems = [];
if (source.sha256 !== contractHash) {
  problems.push(
    `contracts/mobile/SOURCE.json records sha256 ${source.sha256}, but the vendored contract is ${contractHash}. ` +
      'Re-vendor the contract and update SOURCE.json together.',
  );
}
if (upstream) {
  const upstreamText = normalize(readFileSync(upstream, 'utf8'));
  if (sha256(upstreamText) !== contractHash) {
    problems.push(
      `The backend contract (${upstream}) differs from the vendored copy. ` +
        'Re-vendor it, regenerate, and adapt the client to the change.',
    );
  }
}

if (check) {
  let committed = '';
  try {
    committed = normalize(readFileSync(outputPath, 'utf8'));
  } catch {
    committed = '';
  }
  if (committed !== generated) {
    problems.push(
      `${relative(root, outputPath)} is out of date with the contract. Run: npm run api:generate`,
    );
  }
  if (problems.length) {
    for (const problem of problems) console.error(`API drift: ${problem}`);
    process.exit(1);
  }
  console.log(`API client matches the contract (${source.commit.slice(0, 7)}, sha256 ${contractHash.slice(0, 12)}).`);
} else {
  if (problems.length) {
    for (const problem of problems) console.error(`API drift: ${problem}`);
    process.exit(1);
  }
  writeFileSync(outputPath, generated);
  console.log(`Wrote ${relative(root, outputPath)}.`);
}
