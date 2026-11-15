// Performance benchmark: operations/second for each API, measured in Node.js
// next to the `uuid` package in the same process. Each case runs RUNS times
// (implementations interleaved) and the best run is kept, which reduces noise
// from other load on the machine.
const fs = require('node:fs');
const path = require('node:path');

const lib = require('../dist/cjs/index.js');

const ITERATIONS = 200000;
const WARMUP = 5000;
const RUNS = 7;
const SAMPLE = '109156be-c4fb-41ea-b1b4-efe1671c5836';
const NAME = 'react-native-uuid';

const opsPerSec = fn => {
  for (let i = 0; i < WARMUP; i += 1) fn();
  const start = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i += 1) fn();
  const seconds = Number(process.hrtime.bigint() - start) / 1e9;
  return ITERATIONS / seconds;
};

const main = async () => {
  const uuid = await import('uuid');
  const uuidVersion = require('uuid/package.json').version;

  const cases = [
    ['v1()', () => lib.v1(), () => uuid.v1()],
    [
      'v3(name, DNS)',
      () => lib.v3(NAME, lib.DNS),
      () => uuid.v3(NAME, uuid.v3.DNS),
    ],
    ['v4()', () => lib.v4(), () => uuid.v4()],
    ['v4({}) (JS path)', () => lib.v4({}), () => uuid.v4({})],
    [
      'v5(name, DNS)',
      () => lib.v5(NAME, lib.DNS),
      () => uuid.v5(NAME, uuid.v5.DNS),
    ],
    ['v6()', () => lib.v6(), () => uuid.v6()],
    ['v7()', () => lib.v7(), () => uuid.v7()],
    [
      'validate(sample)',
      () => lib.validate(SAMPLE),
      () => uuid.validate(SAMPLE),
    ],
    ['parse(sample)', () => lib.parse(SAMPLE), () => uuid.parse(SAMPLE)],
    [
      'stringify(parse(sample))',
      () => lib.stringify(lib.parse(SAMPLE)),
      () => uuid.stringify(uuid.parse(SAMPLE)),
    ],
  ];

  const best = cases.map(() => ({lib: 0, uuid: 0}));
  for (let run = 0; run < RUNS; run += 1) {
    cases.forEach(([, libFn, uuidFn], i) => {
      best[i].lib = Math.max(best[i].lib, opsPerSec(libFn));
      best[i].uuid = Math.max(best[i].uuid, opsPerSec(uuidFn));
    });
  }

  const results = cases.map(([name], i) => ({
    case: name,
    opsPerSec: Math.round(best[i].lib),
    uuidOpsPerSec: Math.round(best[i].uuid),
    ratio: Number((best[i].lib / best[i].uuid).toFixed(2)),
  }));

  const generatedAt = new Date().toISOString();
  const resultsDir = path.join(__dirname, '..', 'benchmarks', 'results');

  fs.writeFileSync(
    path.join(resultsDir, 'performance-benchmark.json'),
    `${JSON.stringify(
      {
        generatedAt,
        node: process.version,
        machine: {platform: process.platform, arch: process.arch},
        iterations: ITERATIONS,
        runs: RUNS,
        uuidVersion,
        results,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  const fmt = n => n.toLocaleString('en-US');
  const md = [
    '# Performance Benchmark',
    '',
    `Generated: ${generatedAt}`,
    `Node: ${process.version}`,
    `Platform: ${process.platform}/${process.arch}`,
    `Iterations per run: ${ITERATIONS}, best of ${RUNS} runs`,
    '',
    `Operations per second in Node.js, compared with \`uuid@${uuidVersion}\` in the same process. Numbers depend on the machine and its load; compare ratios rather than absolute values. React Native engines (Hermes) are slower in absolute terms.`,
    '',
    `| Case | react-native-uuid | uuid@${uuidVersion} | Ratio |`,
    '| --- | ---: | ---: | ---: |',
    ...results.map(
      r =>
        `| ${r.case} | ${fmt(r.opsPerSec)} | ${fmt(r.uuidOpsPerSec)} | ${r.ratio.toFixed(2)}x |`,
    ),
    '',
    'Unit: operations/second (higher is better). Ratio > 1 means react-native-uuid is faster.',
    '',
  ].join('\n');
  fs.writeFileSync(
    path.join(resultsDir, 'performance-benchmark.md'),
    md,
    'utf8',
  );

  console.log(md);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
