/* eslint-disable no-bitwise */
const RANDOM_LENGTH = 16;

type Crypto = {getRandomValues: (array: Uint8Array) => Uint8Array};
type RandomSource = (length: number) => ArrayLike<number> | undefined;

let nativeSource: RandomSource | undefined;

/**
 * Register a secure random source, used when `crypto.getRandomValues` is
 * unavailable. Set by the React Native entry point when the bundled native
 * module is linked.
 * @internal
 */
export const setNativeRandomSource = (source: RandomSource | undefined) => {
  nativeSource = source;
};

// Filled 256 bytes at a time (like the `uuid` package): one
// getRandomValues call per 16 UUIDs is much faster than one per UUID
const POOL_SIZE = 256;
const pool = new Uint8Array(POOL_SIZE);
let poolPos = POOL_SIZE;
let poolCrypto: Crypto | undefined;

// Looked up on every call so polyfills installed after this module loads
// (e.g. `react-native-get-random-values`) are still picked up.
const getCrypto = (): Crypto | undefined => {
  const c = (globalThis as {crypto?: Crypto}).crypto;
  return c && typeof c.getRandomValues === 'function' ? c : undefined;
};

/**
 * Return 16 random bytes as a `Uint8Array`.
 *
 * Sources, in order of preference:
 * 1. `crypto.getRandomValues`: browsers, Node.js, and React Native with a
 *    polyfill such as `react-native-get-random-values`.
 * 2. The bundled native module on React Native (iOS `SecRandomCopyBytes`,
 *    Android `SecureRandom`), when linked.
 * 3. `Math.random`, which is **not** cryptographically secure.
 */
export const rng = (): Uint8Array => {
  const result = new Uint8Array(RANDOM_LENGTH);
  const crypto = getCrypto();

  if (crypto) {
    // Refill when empty, or when a different crypto (e.g. a late polyfill)
    // is installed
    if (poolCrypto !== crypto || poolPos + RANDOM_LENGTH > POOL_SIZE) {
      crypto.getRandomValues(pool);
      poolCrypto = crypto;
      poolPos = 0;
    }
    result.set(pool.subarray(poolPos, poolPos + RANDOM_LENGTH));
    // Don't keep handed-out bytes around
    pool.fill(0, poolPos, poolPos + RANDOM_LENGTH);
    poolPos += RANDOM_LENGTH;
    return result;
  }

  const bytes = nativeSource && nativeSource(RANDOM_LENGTH);
  if (bytes && bytes.length >= RANDOM_LENGTH) {
    for (let j = 0; j < RANDOM_LENGTH; j++) {
      result[j] = bytes[j];
    }
    return result;
  }

  for (let j = 0; j < RANDOM_LENGTH; j++) {
    result[j] = (Math.random() * 0x100) & 0xff;
  }

  return result;
};

/**
 * Name of the random source {@link rng} currently uses.
 */
export const randomSource = (): 'crypto' | 'native' | 'Math.random' => {
  if (getCrypto()) {
    return 'crypto';
  }
  return nativeSource ? 'native' : 'Math.random';
};
