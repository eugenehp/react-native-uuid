/* eslint-disable no-bitwise */
const RANDOM_LENGTH = 16;

type Crypto = {getRandomValues: (array: Uint8Array) => Uint8Array};

// Looked up on every call so polyfills installed after this module loads
// (e.g. `react-native-get-random-values`) are still picked up.
const getCrypto = (): Crypto | undefined => {
  const c = (globalThis as {crypto?: Crypto}).crypto;
  return c && typeof c.getRandomValues === 'function' ? c : undefined;
};

// returns 16 random bytes as Uint8Array
// Uses the platform CSPRNG (crypto.getRandomValues) when available, which is
// the case in browsers, Node.js >= 19, and React Native with a
// `crypto.getRandomValues` polyfill. Falls back to Math.random otherwise,
// which is NOT cryptographically secure.
export const rng = () => {
  const result = new Uint8Array(RANDOM_LENGTH);
  const crypto = getCrypto();

  if (crypto) {
    crypto.getRandomValues(result);
  } else {
    for (let j = 0; j < RANDOM_LENGTH; j++) {
      result[j] = (Math.random() * 0x100) & 0xff;
    }
  }

  return result as unknown as number[];
};
