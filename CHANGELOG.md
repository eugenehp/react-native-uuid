# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2026-11-14

See [Migrating from 2.x](README.md#migrating-from-2x).

### Breaking

- `v3()` and `v5()` now return RFC 9562 compliant UUIDs that match the `uuid` npm package and Python's `uuid` module. Previously the hex text of the hash digest was used as the UUID bytes, so **every v3/v5 value differs from 2.x**. Re-generate any stored v3/v5 UUIDs. ([#52](https://github.com/eugenehp/react-native-uuid/issues/52), [#18](https://github.com/eugenehp/react-native-uuid/issues/18))
- `parse()` throws `TypeError('Invalid UUID')` for invalid input instead of returning zero-filled bytes. `v3()` and `v5()` throw the same error for an invalid namespace string.
- `validate()` and `version()` accept UUID versions 6-8 and the max UUID.
- The package uses an `exports` map. Deep imports such as `react-native-uuid/dist/v4` no longer work; import from `react-native-uuid`. Internal helpers that were only reachable that way (`md5`, `sha1`, `bytesToString`, etc.) were removed or replaced.
- Build output moved to `dist/cjs` (CommonJS) and `dist/esm` (ES modules).
- `v4()` no longer accepts the legacy string `format` argument.
- Minimum Node.js version is now 22 (npm 10). Node.js 18 and 20 are end-of-life; CI tests Node.js 22, 24 and 26 and publishes with 26.
- React Native 0.74 or newer is required (declared as an optional peer dependency). React Native apps need `pod install` and a native rebuild to link the new native random module.

### Added

- `v6()` and `v7()` (RFC 9562), plus `v1ToV6()` and `v6ToV1()`. Output matches the `uuid` package; `v7()` is strictly increasing within a process.
- `MAX` constant, and `v3.DNS` / `v3.URL` / `v5.DNS` / `v5.URL` properties, matching `uuid`.
- `stringify()`, `rng()` and `randomSource()` exported from the package entry point.
- Named exports (`import {v4} from 'react-native-uuid'`) alongside the default `uuid` object, so bundlers can drop unused code.
- ES module build, with type declarations for both CommonJS and ESM consumers.
- Exported types: `V1Options`, `V4Options`, `V6Options`, `V7Options`, `UUIDBuffer`, `GenerateUUID`.
- `v3()` / `v5()` accept a plain number array as the name.
- API docs (`docs/`) regenerated for the public API with descriptions for every function. `npm run docs` works again (config in `typedoc.json`).

### Changed

- Generators return `string` when called without `buf` and the buffer's type when called with one, so `as string` casts are no longer needed.
- `buf` accepts `number[]` or `Uint8Array` for every generator. Writing past the end of a `Uint8Array`, or at a negative offset, throws `RangeError`.
- `v4()` no longer modifies the `options.random` array passed in, and throws if it has fewer than 16 bytes.
- Faster: `v3()`/`v5()` ~3-4x, `parse()` ~3.5x, `v4()` ~1.5x (uses `crypto.randomUUID` when available) compared with 2.x. Random bytes from `crypto.getRandomValues` are fetched in 256-byte batches.
- MD5 and SHA-1 rewritten to operate on bytes (verified against RFC 1321 / FIPS 180 vectors and Node.js `crypto`).

### Security

- `rng()` (used by `v1()`, `v4()`, `v6()` and `v7()`) uses, in order: `crypto.getRandomValues`; a bundled native module on React Native (iOS `SecRandomCopyBytes`, Android `SecureRandom`), so apps are secure **without a polyfill**; `Math.random` only as a last resort.
- npm releases are published from CI with trusted publishing (OIDC) and provenance, without a long-lived npm token.

### Fixed

- `v1()` without options no longer throws "Can't create more than 10M uuids/sec" after ~10,000 calls.
- `v1()` honors `clockseq: 0`, `msecs: 0` and `nsecs: 0` instead of replacing them with defaults.
- `v3()` / `v5()` no longer overflow the stack for names larger than ~100 KB.
- `V1Options` and `V4Options` fields are optional, so partial options type-check.
- `v4()` prefers `options.random` over `options.rng`, matching `uuid`.
- The CI publish job now runs on `v*` tag pushes; previously the workflow never triggered on tags.

### Tooling and maintenance

- ESLint 10 with flat config (`eslint.config.js`) and `typescript-eslint`, replacing the deprecated `@react-native-community/eslint-config`. Scripts are linted too.
- Jest 30, TypeScript 5.9, TypeDoc 0.28, lint-staged 17, Husky 9 hook format.
- Removed unused Babel setup, `metro-react-native-babel-preset` and `react-test-renderer`.
- npm `overrides` for patched `glob` / `minimatch` in dev dependencies.
- Prettier checks all files, including Markdown and YAML.
- `npm run check:package` validates exports and types with `publint` and `arethetypeswrong` (run in CI).
- `npm run size` enforces bundle size limits with `size-limit` (run in CI).
- Jest enforces coverage thresholds (95% statements/lines/functions, 90% branches); CI runs tests with coverage.
- The performance benchmark (`npm run bench:perf`, formerly `bench:rn`) compares against the `uuid` package. The previous version ran the same Node.js code under React Native version labels, which was misleading.
- GitHub Actions updated to `checkout`, `setup-node` and `upload-artifact` v7; removed the deprecated Dependabot `reviewers` option (reviews come from `CODEOWNERS`).
- CI publishes pre-release versions (e.g. `3.1.0-rc.0`) under the `next` dist-tag, and refuses to publish if the tag doesn't match `package.json`.
- Release process documented in `CONTRIBUTING.md`.

#### Added

- Comprehensive test suite with 222 tests covering all UUID functionality
- Jest configuration with ts-jest for TypeScript support
- GitHub Actions CI/CD workflow for automated testing and publishing
- .npmignore file to reduce package size by excluding source, tests, and config files
- .npmrc configuration file
- Pre-commit hooks (Husky) for code quality enforcement
- GitHub issue and pull request templates
- prettier:check script for CI/CD validation
- Enhanced TypeScript compiler options for stricter type checking
- Added `uuid` named export so you can auto-import this library

#### Changed

- Updated Node.js minimum requirement from 10.0.0 to 18.0.0 (LTS)
- Updated npm minimum requirement from 6.0.0 to 9.0.0
- TypeScript target from ES2015 to ES2020
- TypeScript strict mode enforced with explicit compiler options
- Updated all dev dependencies to latest backward-compatible versions:
  - @babel/core: ^7.12.9 → ^7.24.0
  - @babel/runtime: ^7.12.5 → ^7.24.0
  - @react-native-community/eslint-config: ^2.0.0 → ^3.2.0
  - @types/jest: ^26.0.20 → ^29.5.0
  - eslint: ^7.14.0 → ^8.57.0
  - metro-react-native-babel-preset: ^0.64.0 → ^0.77.0
  - react-test-renderer: 17.0.1 → ^17.0.2
  - typedoc: ^0.20.35 → ^0.25.4
  - typescript: ^4.4.0 → ^5.3.0
  - Added prettier: ^3.2.0 as explicit dependency
- Enhanced .gitignore with modern patterns for IDE files, coverage, and build artifacts
- Updated Prettier configuration, removed deprecated jsxBracketSameLine option
- Updated CONTRIBUTING.md with modern development process
- Updated README.md with Node 18+ requirement and new npm scripts

#### Fixed

- Fixed TypeScript 5.3 type compatibility issues with ArrayBufferLike
- Updated bytesToString() to accept ArrayBufferLike for SharedArrayBuffer support
- Improved type inference in stringToBytes() with explicit return type

#### Removed

- Removed deprecated tslint dependency (ESLint is the standard)
- Removed npx calls from prettier scripts in package.json

#### Security

- No vulnerabilities found in dependencies
- All tests passing with strict type checking enabled

## [2.0.4] - Previous Release

See git history for changes prior to this version.
