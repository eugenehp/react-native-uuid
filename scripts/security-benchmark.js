/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const uuid = require('../dist/index.js').default;
const {rng} = require('../dist/rng.js');

const CONFIG = {
  uuidSamples: 100000,
  rngSamples: 200000,
  restartBatchSize: 25000,
  malformedSamples: 5000,
};

const THRESHOLDS = {
  maxCollisions: 0,
  maxCrossBatchOverlap: 0,
  monobitMaxZScore: 4,
  runsMaxZScore: 4,
  rngChiSquareMax: 420,
  malformedCrashCountMax: 0,
};

const countBits = (n) => {
  let x = n;
  let c = 0;
  while (x) {
    x &= x - 1;
    c += 1;
  }
  return c;
};

const variableBitsFromUuidBytes = (bytes) => {
  const bits = [];

  for (let i = 0; i < bytes.length; i += 1) {
    let startBit = 7;
    let endBit = 0;

    if (i === 6) {
      startBit = 3;
      endBit = 0;
    } else if (i === 8) {
      startBit = 5;
      endBit = 0;
    }

    for (let bit = startBit; bit >= endBit; bit -= 1) {
      bits.push((bytes[i] >> bit) & 1);
    }
  }

  return bits;
};

const randomHex = (length) => {
  let output = '';
  for (let i = 0; i < length; i += 1) {
    output += Math.floor(Math.random() * 16).toString(16);
  }
  return output;
};

const malformedCandidate = () => {
  const pick = Math.floor(Math.random() * 6);

  switch (pick) {
    case 0:
      return randomHex(31);
    case 1:
      return `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(13)}`;
    case 2:
      return `${randomHex(8)} ${randomHex(4)} ${randomHex(4)} ${randomHex(4)} ${randomHex(12)}`;
    case 3:
      return `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}-extra`;
    case 4:
      return `${randomHex(8)}-${randomHex(4)}-zzzz-${randomHex(4)}-${randomHex(12)}`;
    default:
      return `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}`;
  }
};

const run = () => {
  const startedAt = new Date().toISOString();

  const uuidSet = new Set();
  let totalVariableBits = 0;
  let ones = 0;
  let runs = 0;
  let previousBit = null;

  for (let i = 0; i < CONFIG.uuidSamples; i += 1) {
    const id = uuid.v4();
    uuidSet.add(id);

    const bytes = uuid.parse(id);
    const bits = variableBitsFromUuidBytes(bytes);

    totalVariableBits += bits.length;

    for (let j = 0; j < bits.length; j += 1) {
      const bit = bits[j];
      ones += bit;

      if (previousBit === null) {
        runs = 1;
      } else if (bit !== previousBit) {
        runs += 1;
      }

      previousBit = bit;
    }
  }

  const collisions = CONFIG.uuidSamples - uuidSet.size;

  const firstBatch = new Set();
  for (let i = 0; i < CONFIG.restartBatchSize; i += 1) {
    firstBatch.add(uuid.v4());
  }

  let crossBatchOverlap = 0;
  for (let i = 0; i < CONFIG.restartBatchSize; i += 1) {
    const id = uuid.v4();
    if (firstBatch.has(id)) crossBatchOverlap += 1;
  }

  const pi = ones / totalVariableBits;
  const monobitZScore = Math.abs((ones - totalVariableBits / 2) / Math.sqrt(totalVariableBits / 4));
  const expectedRuns = 2 * totalVariableBits * pi * (1 - pi);
  const varianceRuns = (2 * totalVariableBits * pi * (1 - pi) * (2 * totalVariableBits * pi * (1 - pi) - 1)) / (totalVariableBits - 1);
  const runsZScore = Math.abs((runs - expectedRuns) / Math.sqrt(Math.max(varianceRuns, 1e-9)));

  const histogram = new Array(256).fill(0);
  for (let i = 0; i < CONFIG.rngSamples; i += 1) {
    const bytes = rng();
    for (let j = 0; j < bytes.length; j += 1) {
      histogram[bytes[j]] += 1;
    }
  }

  const totalHistogram = CONFIG.rngSamples * 16;
  const expectedBin = totalHistogram / 256;
  let chiSquare = 0;
  for (let i = 0; i < histogram.length; i += 1) {
    const delta = histogram[i] - expectedBin;
    chiSquare += (delta * delta) / expectedBin;
  }

  let malformedCrashes = 0;
  let malformedValidatedAsTrue = 0;

  for (let i = 0; i < CONFIG.malformedSamples; i += 1) {
    const candidate = malformedCandidate();

    try {
      if (uuid.validate(candidate)) malformedValidatedAsTrue += 1;
      uuid.parse(candidate);
    } catch (error) {
      malformedCrashes += 1;
    }
  }

  const checks = [
    {
      name: 'No v4 collisions in sample',
      value: collisions,
      threshold: THRESHOLDS.maxCollisions,
      pass: collisions <= THRESHOLDS.maxCollisions,
    },
    {
      name: 'No cross-batch overlap',
      value: crossBatchOverlap,
      threshold: THRESHOLDS.maxCrossBatchOverlap,
      pass: crossBatchOverlap <= THRESHOLDS.maxCrossBatchOverlap,
    },
    {
      name: 'Monobit z-score within bound',
      value: Number(monobitZScore.toFixed(4)),
      threshold: THRESHOLDS.monobitMaxZScore,
      pass: monobitZScore <= THRESHOLDS.monobitMaxZScore,
    },
    {
      name: 'Runs z-score within bound',
      value: Number(runsZScore.toFixed(4)),
      threshold: THRESHOLDS.runsMaxZScore,
      pass: runsZScore <= THRESHOLDS.runsMaxZScore,
    },
    {
      name: 'RNG chi-square within bound',
      value: Number(chiSquare.toFixed(4)),
      threshold: THRESHOLDS.rngChiSquareMax,
      pass: chiSquare <= THRESHOLDS.rngChiSquareMax,
    },
    {
      name: 'Malformed input crash count',
      value: malformedCrashes,
      threshold: THRESHOLDS.malformedCrashCountMax,
      pass: malformedCrashes <= THRESHOLDS.malformedCrashCountMax,
    },
  ];

  const allPassed = checks.every((c) => c.pass);

  const payload = {
    generatedAt: startedAt,
    machine: {
      platform: process.platform,
      arch: process.arch,
      node: process.version,
    },
    config: CONFIG,
    thresholds: THRESHOLDS,
    metrics: {
      collisions,
      crossBatchOverlap,
      monobit: {
        totalBits: totalVariableBits,
        ones,
        pi,
        zScore: monobitZScore,
      },
      runs: {
        runs,
        expectedRuns,
        zScore: runsZScore,
      },
      rngChiSquare: {
        value: chiSquare,
        bins: 256,
        expectedPerBin: expectedBin,
      },
      malformedInput: {
        samples: CONFIG.malformedSamples,
        validatedAsTrue: malformedValidatedAsTrue,
        crashes: malformedCrashes,
      },
    },
    checks,
    pass: allPassed,
  };

  const resultsDir = path.join(__dirname, '..', 'benchmarks', 'results');
  const jsonPath = path.join(resultsDir, 'security-benchmark.json');
  const mdPath = path.join(resultsDir, 'security-benchmark.md');

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const rows = checks.map(
    (c) => `| ${c.name} | ${c.value} | ${c.threshold} | ${c.pass ? 'PASS' : 'FAIL'} |`,
  );

  const markdown = [
    '# Security Benchmark',
    '',
    `Generated: ${startedAt}`,
    `Node: ${process.version}`,
    `Platform: ${process.platform}/${process.arch}`,
    `Overall: ${allPassed ? 'PASS' : 'FAIL'}`,
    '',
    '| Check | Value | Threshold | Status |',
    '| --- | ---: | ---: | --- |',
    ...rows,
    '',
    'Notes:',
    '- Monobit and runs tests are computed from variable bits in v4 UUIDs (version/variant fixed bits excluded).',
    '- RNG chi-square evaluates distribution across 256 byte values from the internal RNG output.',
    '- Malformed input check verifies stability against non-canonical UUID strings.',
  ].join('\n');

  fs.writeFileSync(mdPath, `${markdown}\n`, 'utf8');

  console.log(`Saved JSON results to ${jsonPath}`);
  console.log(`Saved Markdown results to ${mdPath}`);

  if (!allPassed) {
    console.error('Security benchmark failed one or more thresholds.');
    process.exit(1);
  }
};

run();
