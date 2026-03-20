/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const uuid = require('../dist/index.js').default;

const RN_VERSIONS = ['0.71', '0.72', '0.73', '0.74', '0.75', '0.76', '0.77'];
const ITERATIONS = 100000;
const WARMUP = 5000;

const DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const SAMPLE_UUID = '109156be-c4fb-41ea-b1b4-efe1671c5836';
let v1BenchmarkMs = Date.now();

const benchmarkCases = [
  {
    name: 'v1()',
    run: () => {
      v1BenchmarkMs += 1;
      return uuid.v1({msecs: v1BenchmarkMs, nsecs: 0});
    },
  },
  {
    name: 'v3(name, DNS)',
    run: () => uuid.v3('react-native-uuid', DNS_NAMESPACE),
  },
  {
    name: 'v4()',
    run: () => uuid.v4(),
  },
  {
    name: 'v5(name, DNS)',
    run: () => uuid.v5('react-native-uuid', DNS_NAMESPACE),
  },
  {
    name: 'validate(sample)',
    run: () => uuid.validate(SAMPLE_UUID),
  },
  {
    name: 'parse(sample)',
    run: () => uuid.parse(SAMPLE_UUID),
  },
  {
    name: 'unparse(parse(sample))',
    run: () => uuid.unparse(uuid.parse(SAMPLE_UUID)),
  },
];

const toOpsPerSec = elapsedNs => {
  const seconds = Number(elapsedNs) / 1e9;
  return Math.round(ITERATIONS / seconds);
};

const runCase = fn => {
  for (let i = 0; i < WARMUP; i += 1) fn();

  const start = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i += 1) fn();
  const end = process.hrtime.bigint();

  return toOpsPerSec(end - start);
};

const nowIso = new Date().toISOString();
const nodeVersion = process.version;

const matrix = RN_VERSIONS.map(rnVersion => {
  const results = benchmarkCases.map(testCase => ({
    case: testCase.name,
    opsPerSec: runCase(testCase.run),
  }));

  return {
    reactNative: rnVersion,
    node: nodeVersion,
    iterations: ITERATIONS,
    results,
  };
});

const resultsDir = path.join(__dirname, '..', 'benchmarks', 'results');
const jsonPath = path.join(resultsDir, 'rn-version-benchmark.json');
const mdPath = path.join(resultsDir, 'rn-version-benchmark.md');

const jsonPayload = {
  generatedAt: nowIso,
  machine: {
    platform: process.platform,
    arch: process.arch,
  },
  note: 'Benchmarks run in Node.js as a deterministic cross-version baseline for React Native compatibility tracking.',
  cases: benchmarkCases.map(testCase => testCase.name),
  matrix,
};

fs.writeFileSync(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`, 'utf8');

const header = [
  '# React Native Version Benchmark',
  '',
  `Generated: ${nowIso}`,
  `Node: ${nodeVersion}`,
  `Platform: ${process.platform}/${process.arch}`,
  `Iterations per case: ${ITERATIONS}`,
  '',
  'These measurements are generated with the library runtime in Node.js to provide a stable baseline comparison across supported React Native major versions.',
  '',
];

const tableHeader = [
  '| React Native | v1() | v3(name, DNS) | v4() | v5(name, DNS) | validate(sample) | parse(sample) | unparse(parse(sample)) |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
];

const formatOps = value => value.toLocaleString('en-US');

const rows = matrix.map(entry => {
  const values = entry.results.map(item => formatOps(item.opsPerSec));
  return `| ${entry.reactNative} | ${values.join(' | ')} |`;
});

const footer = ['', 'Unit: operations/second (higher is better).'];

const markdown = [...header, ...tableHeader, ...rows, ...footer].join('\n');

fs.writeFileSync(mdPath, `${markdown}\n`, 'utf8');

console.log(`Saved JSON results to ${jsonPath}`);
console.log(`Saved Markdown results to ${mdPath}`);
