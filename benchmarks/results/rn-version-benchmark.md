# React Native Version Benchmark

Generated: 2026-03-20T21:00:32.958Z
Node: v25.8.1
Platform: darwin/arm64
Iterations per case: 100000

These measurements are generated with the library runtime in Node.js to provide a stable baseline comparison across supported React Native major versions.

| React Native | v1() | v3(name, DNS) | v4() | v5(name, DNS) | validate(sample) | parse(sample) | unparse(parse(sample)) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0.71 | 3,742,754 | 326,541 | 6,373,029 | 317,917 | 21,025,153 | 1,433,325 | 1,288,136 |
| 0.72 | 3,963,804 | 330,648 | 7,510,444 | 322,144 | 21,709,436 | 1,444,367 | 1,282,244 |
| 0.73 | 3,970,762 | 339,675 | 7,322,118 | 326,851 | 21,715,725 | 1,494,171 | 1,332,384 |
| 0.74 | 4,029,388 | 347,862 | 7,537,144 | 239,771 | 21,767,722 | 1,446,966 | 1,316,856 |
| 0.75 | 4,011,634 | 346,323 | 7,522,497 | 330,222 | 21,756,077 | 1,443,711 | 1,300,756 |
| 0.76 | 4,092,155 | 339,249 | 7,114,948 | 318,478 | 20,201,510 | 1,398,724 | 1,281,209 |
| 0.77 | 3,892,672 | 329,397 | 7,219,848 | 320,051 | 20,076,794 | 1,421,314 | 1,284,319 |

Unit: operations/second (higher is better).
