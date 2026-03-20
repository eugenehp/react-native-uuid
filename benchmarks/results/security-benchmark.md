# Security Benchmark

Generated: 2026-03-20T21:05:13.478Z
Node: v25.8.1
Platform: darwin/arm64
Overall: PASS

| Check | Value | Threshold | Status |
| --- | ---: | ---: | --- |
| No v4 collisions in sample | 0 | 0 | PASS |
| No cross-batch overlap | 0 | 0 | PASS |
| Monobit z-score within bound | 0.0229 | 4 | PASS |
| Runs z-score within bound | 1.6783 | 4 | PASS |
| RNG chi-square within bound | 270.6654 | 420 | PASS |
| Malformed input crash count | 0 | 0 | PASS |

Notes:
- Monobit and runs tests are computed from variable bits in v4 UUIDs (version/variant fixed bits excluded).
- RNG chi-square evaluates distribution across 256 byte values from the internal RNG output.
- Malformed input check verifies stability against non-canonical UUID strings.
