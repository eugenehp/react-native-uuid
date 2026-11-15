# Performance Benchmark

Generated: 2026-11-15T00:56:00.172Z
Node: v26.0.0
Platform: darwin/arm64
Iterations per run: 200000, best of 7 runs

Operations per second in Node.js, compared with `uuid@14.0.3` in the same process. Numbers depend on the machine and its load; compare ratios rather than absolute values. React Native engines (Hermes) are slower in absolute terms.

| Case | react-native-uuid | uuid@14.0.3 | Ratio |
| --- | ---: | ---: | ---: |
| v1() | 4,093,611 | 599,707 | 6.83x |
| v3(name, DNS) | 948,068 | 479,856 | 1.98x |
| v4() | 10,034,032 | 7,219,793 | 1.39x |
| v4({}) (JS path) | 1,941,020 | 953,805 | 2.04x |
| v5(name, DNS) | 705,070 | 540,528 | 1.30x |
| v6() | 2,028,092 | 816,994 | 2.48x |
| v7() | 1,699,905 | 729,792 | 2.33x |
| validate(sample) | 16,829,173 | 18,252,062 | 0.92x |
| parse(sample) | 3,355,768 | 3,333,630 | 1.01x |
| stringify(parse(sample)) | 1,578,673 | 1,742,130 | 0.91x |

Unit: operations/second (higher is better). Ratio > 1 means react-native-uuid is faster.
