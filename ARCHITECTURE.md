# Architecture

This document provides a technical deep-dive into the architecture and design of react-native-uuid.

## Overview

react-native-uuid is a lightweight TypeScript library that brings UUID (Universally Unique Identifier) generation to React Native environments. The architecture is designed around three core principles:

1. **Simplicity** - Minimal API surface with sensible defaults
2. **Compatibility** - Works across different JavaScript environments (React Native, Node.js, Browsers)
3. **Standards Compliance** - Full RFC 4122 implementation

## Module Structure

```
src/
├── index.ts           # Main entry point and public API
├── v1.ts              # Time-based UUID generation
├── v3.ts              # MD5 name-based UUID generation
├── v4.ts              # Random UUID generation
├── v5.ts              # SHA1 name-based UUID generation
├── validate.ts        # UUID validation logic
├── parse.ts           # UUID string parsing
├── stringify.ts       # UUID bytes to string conversion
├── unparse.ts         # Alias for stringify
├── utils.ts           # Shared utility functions
├── rng.ts             # Random number generator interface
├── regex.ts           # UUID regex pattern
├── md5.ts             # MD5 hashing algorithm
├── sha1.ts            # SHA1 hashing algorithm
├── version.ts         # Version extraction utility
└── v35.ts             # Shared logic for v3 and v5
```

## Core Components

### 1. Entry Point (`index.ts`)

The main entry point exports the public API:

```typescript
export default {
  v1,
  v3,
  v4,
  v5,
  parse,
  stringify,
  validate,
  version,
};
```

This provides a clean, modular interface where consumers can either:
- Use default exports: `uuid.v4()`
- Import named exports: `import { v4 } from 'react-native-uuid'`

### 2. Version-Specific Generators

Each UUID version (v1, v3, v4, v5) is implemented in its own module with specific characteristics:

#### Version 1 (Time-based)
- **File**: `v1.ts`
- **Use Case**: Sequential IDs based on machine MAC and timestamp
- **Characteristics**: Predictable, sortable, reveals timestamp information
- **Inputs**: Optional node identifier and clock sequence

```typescript
export function v1(options?, buffer?, offset?): string
```

#### Version 3 (MD5 Name-based)
- **File**: `v3.ts`
- **Use Case**: Deterministic IDs from names using MD5 hashing
- **Characteristics**: Same input always produces same UUID
- **Inputs**: Namespace UUID + name string

#### Version 4 (Random)
- **File**: `v4.ts`
- **Use Case**: Random IDs for most general purpose applications
- **Characteristics**: Random bits, cryptographically appropriate
- **Inputs**: Optional RNG function

#### Version 5 (SHA1 Name-based)
- **File**: `v5.ts`
- **Use Case**: Like v3, but with stronger SHA1 hashing
- **Characteristics**: Same input produces same UUID
- **Inputs**: Namespace UUID + name string

### 3. Hashing Algorithms

#### MD5 (`md5.ts`)
- Implements RFC 1321 MD5 message digest algorithm
- 128-bit hash output
- Used by UUID v3
- Functions:
  - `md5(msg: string | number[]): string` - Returns hex digest

#### SHA1 (`sha1.ts`)
- Implements FIPS 180-1 SHA1 algorithm
- 160-bit hash output
- Used by UUID v5
- More secure than MD5
- Functions:
  - `sha1(msg: string | number[]): string` - Returns hex digest

### 4. Utility Functions

#### Regex (`regex.ts`)
```typescript
export const REGEX = /^(?:xxxxxxxx-?xxxx-?[1-5]xxx-?[89ab]xxx-?xxxxxxxxxxxx|00000000-?0000-?0000-?0000-?000000000000)$/i
```
- Validates UUID format
- Supports both with and without hyphens
- Case-insensitive matching

#### Parse (`parse.ts`)
Converts UUID string to byte array:
```typescript
export function parse(uuid: string): Uint8Array
```
- Strips validation of input format
- Returns 16-byte result
- Used internally by stringify operations

#### Stringify (`stringify.ts`) / Unparse (`unparse.ts`)
Converts byte array back to UUID string:
```typescript
export function stringify(arr: ArrayLike<number>): string
```
- Formats bytes as hyphenated UUID string
- Ensures RFC 4122 formatting
- `unparse.ts` is an alias for backward compatibility

#### Validate (`validate.ts`)
Validates UUID format:
```typescript
export function validate(uuid: string): boolean
```
- Uses regex pattern matching
- Supports both hyphenated and non-hyphenated formats
- Case-insensitive

#### Version (`version.ts`)
Extracts version and variant from UUID:
```typescript
export function version(uuid: string): number
export function getVariant(uuid: Uint8Array): string
```

#### Utils (`utils.ts`)
Shared utility functions:
- `byteToHex()` - Convert byte to hex string
- `hexToByte()` - Convert hex string to byte
- Byte manipulation helpers

### 5. Random Number Generator (`rng.ts`)

Abstracts the RNG interface, allowing custom implementations:

```typescript
export type RngFunction = () => number[];
```

The default RNG:
- Uses `Math.random()` for general use
- May use cryptographic APIs when available
- Generates 16-byte arrays

## Design Patterns

### 1. Functional Approach
All UUID generators are pure functions:
- No side effects (except for v1 which maintains state for sequence numbers)
- Deterministic (except v4)
- Easy to test and reason about

### 2. Composition
Complex operations are built from simpler functions:
```
v3/v5 generators
  ↓
  hash (md5/sha1)
  + namespace + name
  ↓
  stringify
  + version/variant bits
```

### 3. Type Safety
Full TypeScript implementation provides:
- Compile-time type checking
- Better IDE autocompletion
- Self-documenting code

### 4. Module Separation
Each concern is isolated:
- Algorithms in their own files
- Utilities grouped logically
- Clear dependencies

## Data Flow

### UUID v4 Generation Flow
```
uuid.v4()
  ↓
  v4.ts: v4()
    ├─ Get RNG (default or custom)
    ├─ Generate 16 random bytes
    ├─ Set version bits (010 in 13-15 bits of time_hi_and_version)
    ├─ Set variant bits (10 in 6-7 bits of clock_seq_hi_and_reserved)
    └─ Call stringify()
       ├─ Convert bytes to hex
       └─ Format as: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  ↓
  Return: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
```

### UUID v5 (Name-based) Flow
```
uuid.v5(name, namespace)
  ↓
  v5.ts: v5()
    ├─ Parse namespace UUID to bytes
    ├─ Combine namespace bytes + name string
    ├─ Hash with SHA1
    └─ Call stringify() with version=5, variant=10
  ↓
  Return: "886313e1-3b8a-5372-9b90-0c9aee199e5d"
```

## Performance Considerations

### Algorithm Complexity
- **v1**: O(1) - timestamp + sequence lookup
- **v3**: O(n) - MD5 hash of name (n = name length)
- **v4**: O(1) - random number generation
- **v5**: O(n) - SHA1 hash of name (n = name length)

### Memory Usage
- Each UUID generation: ~200-300 bytes temporary
- No persistent caches or buffers
- Minimal heap impact

### Optimization Strategies
1. **Hash memoization**: For v3/v5, consider caching results for repeated namespaces
2. **RNG pooling**: Pre-generate random bytes in batches if needed
3. **String interning**: UUID strings are typically short strings, minimal GC impact

## Compatibility

### JavaScript Environments
- **Node.js**: Full support via `Math.random()`
- **React Native**: Full support via `Math.random()`
- **Browsers**: Full support with crypto API fallback
- **TypeScript**: Full type definitions included

### React Native Specific
- No native modules required
- Works in core threads and background threads
- Compatible with Expo projects
- No platform-specific code paths

## Testing Strategy

The codebase includes tests for:
1. **Format Validation**: Ensure output matches RFC 4122
2. **Version/Variant**: Correct bit patterns for each version
3. **Determinism**: v1, v3, v5 produce consistent results
4. **Randomness**: v4 produces different UUIDs with high probability
5. **Edge Cases**: Empty strings, special characters, buffer boundaries
6. **Cross-version**: Parse and stringify round-trip correctly

## Future Considerations

### Potential Enhancements
1. **NIL UUID**: Support for 00000000-0000-0000-0000-000000000000
2. **MAX UUID**: Support for ffffffff-ffff-ffff-ffff-ffffffffffff
3. **Namespace Constants**: Pre-defined DNS, URL, OID, X.500 namespaces
4. **Performance Profiling**: Detailed benchmarks for each version
5. **Custom Formatting**: Support for non-hyphenated output

### Deprecated Features
- `v6` and `v7` (time-based sortable) - Future RFC additions
- Custom clock sequence - Already supported via options

## Contributing

When contributing to the architecture:
1. Maintain the modular structure
2. Keep pure functions where possible
3. Add TypeScript types for new features
4. Update documentation with architectural impact
5. Consider performance implications for new additions

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
