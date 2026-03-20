/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const RESULTS_DIR = path.join(ROOT, 'benchmarks', 'results');
const FIGURES_DIR = path.join(ROOT, 'figures');

const readJson = (fileName) =>
  JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, fileName), 'utf8'));

const writeFile = (name, content) => {
  fs.writeFileSync(path.join(FIGURES_DIR, name), `${content}\n`, 'utf8');
  console.log(`Generated ./figures/${name}`);
};

const palette = ['#1f77b4', '#e4572e', '#17bebb', '#ffc914', '#6a4c93', '#2e8540', '#d7263d'];

const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

  const estimateTextWidth = (text, pxPerChar = 7) => String(text).length * pxPerChar;

const svgShell = (width, height, body, title) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(
  title,
)}">
  <style>
    .bg { fill: #ffffff; }
    .title { font: 700 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #111827; }
    .axis { font: 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #374151; }
    .label { font: 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #374151; }
    .legend { font: 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #111827; }
    .note { font: 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #6b7280; }
    .grid { stroke: #e5e7eb; stroke-width: 1; }
  </style>
  <rect class="bg" width="100%" height="100%" />
  ${body}
</svg>`;

const makeRnBenchmarkChart = (rnJson) => {
  const legendWidth = Math.max(...rnJson.cases.map((c) => estimateTextWidth(c, 7.2))) + 70;
  const width = 1080 + legendWidth;
  const height = 760;
  const margin = { top: 90, right: legendWidth, bottom: 100, left: 80 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const versions = rnJson.matrix.map((m) => m.reactNative);
  const cases = rnJson.cases;
  const maxY = Math.max(...rnJson.matrix.flatMap((m) => m.results.map((r) => r.opsPerSec)));

  const x = (i) => margin.left + (i * plotW) / (versions.length - 1);
  const y = (v) => margin.top + plotH - (v / maxY) * plotH;

  let body = `<text class="title" x="${margin.left}" y="44">React Native Benchmark (ops/sec by RN version)</text>`;
  body += `<text class="note" x="${margin.left}" y="64">Generated from ./benchmarks/results/rn-version-benchmark.json</text>`;

  for (let i = 0; i <= 5; i += 1) {
    const gy = margin.top + (i * plotH) / 5;
    const gv = Math.round(maxY - (i * maxY) / 5).toLocaleString('en-US');
    body += `<line class="grid" x1="${margin.left}" y1="${gy}" x2="${margin.left + plotW}" y2="${gy}" />`;
    body += `<text class="axis" x="${margin.left - 10}" y="${gy + 4}" text-anchor="end">${gv}</text>`;
  }

  body += `<line stroke="#111827" stroke-width="1.5" x1="${margin.left}" y1="${margin.top + plotH}" x2="${margin.left + plotW}" y2="${margin.top + plotH}" />`;
  body += `<line stroke="#111827" stroke-width="1.5" x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotH}" />`;

  versions.forEach((v, i) => {
    body += `<text class="axis" x="${x(i)}" y="${margin.top + plotH + 24}" text-anchor="middle">${esc(v)}</text>`;
  });

  cases.forEach((caseName, caseIndex) => {
    const color = palette[caseIndex % palette.length];
    const points = rnJson.matrix
      .map((m, i) => {
        const match = m.results.find((r) => r.case === caseName);
        return `${x(i)},${y(match.opsPerSec)}`;
      })
      .join(' ');

    body += `<polyline fill="none" stroke="${color}" stroke-width="2.2" points="${points}" />`;

    rnJson.matrix.forEach((m, i) => {
      const match = m.results.find((r) => r.case === caseName);
      body += `<circle cx="${x(i)}" cy="${y(match.opsPerSec)}" r="3" fill="${color}" />`;
    });

    const lx = width - margin.right + 20;
    const ly = margin.top + caseIndex * 24;
    body += `<line x1="${lx}" y1="${ly}" x2="${lx + 20}" y2="${ly}" stroke="${color}" stroke-width="3" />`;
    body += `<text class="legend" x="${lx + 28}" y="${ly + 4}">${esc(caseName)}</text>`;
  });

  return svgShell(width, height, body, 'React Native benchmark line chart');
};

const makeSecurityChart = (securityJson) => {
  const leftLabelWidth = Math.max(...securityJson.checks.map((c) => estimateTextWidth(c.name, 6.8))) + 40;
  const rightValueWidth =
    Math.max(...securityJson.checks.map((c) => estimateTextWidth(`${c.value} / ${c.threshold}`, 6.8))) + 24;
  const width = leftLabelWidth + 620 + rightValueWidth + 28;
  const height = 560;
  const margin = { top: 90, right: rightValueWidth + 20, bottom: 70, left: leftLabelWidth };
  const plotW = width - margin.left - margin.right;
  const rowH = 60;

  const checks = securityJson.checks;

  const ratio = (c) => {
    if (c.threshold === 0) return c.value === 0 ? 0 : 1;
    return c.value / c.threshold;
  };

  let body = `<text class="title" x="${margin.left}" y="44">Security Benchmark Threshold Utilization</text>`;
  body += `<text class="note" x="${margin.left}" y="64">Generated from ./benchmarks/results/security-benchmark.json</text>`;

  body += `<line stroke="#111827" stroke-width="1.5" x1="${margin.left}" y1="${margin.top + checks.length * rowH}" x2="${margin.left + plotW}" y2="${margin.top + checks.length * rowH}" />`;

  for (let i = 0; i <= 5; i += 1) {
    const x = margin.left + (i * plotW) / 5;
    const pct = `${i * 20}%`;
    body += `<line class="grid" x1="${x}" y1="${margin.top - 20}" x2="${x}" y2="${margin.top + checks.length * rowH}" />`;
    body += `<text class="axis" x="${x}" y="${margin.top + checks.length * rowH + 22}" text-anchor="middle">${pct}</text>`;
  }

  checks.forEach((c, i) => {
    const y = margin.top + i * rowH;
    const r = Math.min(Math.max(ratio(c), 0), 1);
    const bw = r * plotW;
    const color = c.pass ? '#1f9d55' : '#d7263d';

    body += `<text class="label" x="${margin.left - 12}" y="${y + 24}" text-anchor="end">${esc(c.name)}</text>`;
    body += `<rect x="${margin.left}" y="${y + 8}" width="${plotW}" height="20" fill="#f3f4f6" />`;
    body += `<rect x="${margin.left}" y="${y + 8}" width="${bw}" height="20" fill="${color}" />`;
    body += `<text class="label" x="${width - 12}" y="${y + 23}" text-anchor="end">${esc(String(c.value))} / ${esc(
      String(c.threshold),
    )}</text>`;
  });

  return svgShell(width, height, body, 'Security benchmark threshold utilization');
};

const makeTestChart = (testJson) => {
  const width = 900;
  const height = 420;
  const margin = { top: 90, right: 60, bottom: 80, left: 90 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const values = [
    { name: 'Passed', value: testJson.numPassedTests, color: '#1f9d55' },
    { name: 'Failed', value: testJson.numFailedTests, color: '#d7263d' },
    { name: 'Pending', value: testJson.numPendingTests, color: '#f59e0b' },
    { name: 'Todo', value: testJson.numTodoTests, color: '#6366f1' },
  ];

  const maxY = Math.max(...values.map((v) => v.value), 1);
  const barW = plotW / values.length - 30;

  let body = `<text class="title" x="${margin.left}" y="44">Test Result Summary</text>`;
  body += `<text class="note" x="${margin.left}" y="64">Generated from ./benchmarks/results/test-results.json</text>`;

  for (let i = 0; i <= 4; i += 1) {
    const gy = margin.top + (i * plotH) / 4;
    const gv = Math.round(maxY - (i * maxY) / 4).toLocaleString('en-US');
    body += `<line class="grid" x1="${margin.left}" y1="${gy}" x2="${margin.left + plotW}" y2="${gy}" />`;
    body += `<text class="axis" x="${margin.left - 10}" y="${gy + 4}" text-anchor="end">${gv}</text>`;
  }

  body += `<line stroke="#111827" stroke-width="1.5" x1="${margin.left}" y1="${margin.top + plotH}" x2="${margin.left + plotW}" y2="${margin.top + plotH}" />`;

  values.forEach((item, i) => {
    const x = margin.left + i * (plotW / values.length) + 15;
    const h = (item.value / maxY) * plotH;
    const y = margin.top + plotH - h;

    body += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${item.color}" />`;
    body += `<text class="axis" x="${x + barW / 2}" y="${margin.top + plotH + 22}" text-anchor="middle">${esc(item.name)}</text>`;
    body += `<text class="label" x="${x + barW / 2}" y="${y - 8}" text-anchor="middle">${item.value.toLocaleString(
      'en-US',
    )}</text>`;
  });

  return svgShell(width, height, body, 'Test results bar chart');
};

const rn = readJson('rn-version-benchmark.json');
const security = readJson('security-benchmark.json');
const test = readJson('test-results.json');

writeFile('rn-benchmark-chart.svg', makeRnBenchmarkChart(rn));
writeFile('security-benchmark-chart.svg', makeSecurityChart(security));
writeFile('test-results-chart.svg', makeTestChart(test));
