# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive test suite with 222 tests covering all UUID functionality
- Jest configuration with ts-jest for TypeScript support
- GitHub Actions CI/CD workflow for automated testing and publishing
- .npmignore file to reduce package size by excluding source, tests, and config files
- .npmrc configuration file
- Pre-commit hooks (Husky) for code quality enforcement
- GitHub issue and pull request templates
- prettier:check script for CI/CD validation
- Enhanced TypeScript compiler options for stricter type checking

### Changed

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

### Fixed

- Fixed TypeScript 5.3 type compatibility issues with ArrayBufferLike
- Updated bytesToString() to accept ArrayBufferLike for SharedArrayBuffer support
- Improved type inference in stringToBytes() with explicit return type

### Removed

- Removed deprecated tslint dependency (ESLint is the standard)
- Removed npx calls from prettier scripts in package.json

### Security

- No vulnerabilities found in dependencies
- All tests passing with strict type checking enabled

## [2.0.4] - Previous Release

See git history for changes prior to this version.
