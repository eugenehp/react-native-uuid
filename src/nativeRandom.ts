import {NativeModules} from 'react-native';
import {setNativeRandomSource} from './rng.js';

// Bytes fetched per native call; served 16 at a time to keep calls rare
const POOL_SIZE = 256;

type RandomModule = {getRandomBase64?: (length: number) => string | null};

const BASE64 =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_LOOKUP: {[char: string]: number} = {};
for (let i = 0; i < BASE64.length; i++) {
  BASE64_LOOKUP[BASE64[i]] = i;
}

/** Decode standard (padded) base64. @internal */
export const base64ToBytes = (b64: string): Uint8Array => {
  const clean = b64.replace(/=+$/, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let value = 0;
  let pos = 0;

  for (let i = 0; i < clean.length; i++) {
    const v = BASE64_LOOKUP[clean[i]];
    if (v === undefined) {
      throw new TypeError('Invalid base64');
    }
    // eslint-disable-next-line no-bitwise
    value = (value << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      // eslint-disable-next-line no-bitwise
      out[pos++] = (value >> bits) & 0xff;
    }
  }

  return out;
};

/**
 * Wrap the native module in a pooled random source, or return `undefined` if
 * the module isn't linked.
 * @internal
 */
export const createNativeSource = (mod: RandomModule | undefined) => {
  if (!mod || typeof mod.getRandomBase64 !== 'function') {
    return undefined;
  }
  const getRandomBase64 = mod.getRandomBase64;
  let pool: Uint8Array = new Uint8Array(0);
  let pos = 0;

  return (length: number): Uint8Array | undefined => {
    if (pos + length > pool.length) {
      let b64: string | null;
      try {
        // Synchronous native call; fails e.g. under remote JS debugging
        b64 = getRandomBase64(Math.max(POOL_SIZE, length));
      } catch {
        return undefined;
      }
      if (!b64) {
        return undefined;
      }
      pool = base64ToBytes(b64);
      pos = 0;
      if (pool.length < length) {
        return undefined;
      }
    }

    const out = pool.slice(pos, pos + length);
    // Don't keep handed-out bytes around
    pool.fill(0, pos, pos + length);
    pos += length;
    return out;
  };
};

setNativeRandomSource(
  createNativeSource(
    NativeModules && (NativeModules.RNUUIDRandom as RandomModule | undefined),
  ),
);
