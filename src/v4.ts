/* eslint-disable no-bitwise */
import {unsafeStringify} from './stringify.js';
import {rng} from './rng.js';
import {UUIDBuffer, writeBytes} from './utils.js';

/**
 * Options for {@link v4}. `random` takes precedence over `rng`.
 */
export type V4Options = {
  /** 16 random bytes to use instead of generating them. */
  random?: ArrayLike<number>;
  /** Function returning 16 random bytes. */
  rng?: () => ArrayLike<number>;
};

/**
 * Generate a random (version 4) UUID.
 *
 * Uses `crypto.randomUUID` when available and no options are given. Otherwise
 * random bytes come from {@link rng}: `crypto.getRandomValues` when available,
 * the bundled native module on React Native, otherwise `Math.random` (not
 * cryptographically secure).
 *
 * @param options - Supply your own random bytes or random source.
 * @param buf - If given, the 16 UUID bytes are written here and `buf` is returned.
 * @param offset - Index in `buf` to start writing at.
 * @returns The UUID string, or `buf` when one is passed.
 * @throws Error if fewer than 16 random bytes are supplied.
 */
export function v4(
  options?: V4Options,
  buf?: undefined,
  offset?: number,
): string;
export function v4<T extends UUIDBuffer>(
  options: V4Options | undefined,
  buf: T,
  offset?: number,
): T;
export function v4<T extends UUIDBuffer>(
  options?: V4Options,
  buf?: T,
  offset?: number,
): string | T {
  // Fast path, like the `uuid` package: the platform's native v4 generator
  if (!options && !buf) {
    const c = (globalThis as {crypto?: {randomUUID?: () => string}}).crypto;
    if (c && typeof c.randomUUID === 'function') {
      return c.randomUUID();
    }
  }

  const opts: V4Options = options && typeof options === 'object' ? options : {};
  let rnds: Uint8Array;

  if (opts.random || opts.rng) {
    const random = opts.random || opts.rng!();
    if (random.length < 16) {
      throw new Error('Random bytes length must be >= 16');
    }
    // Copy so caller-supplied bytes aren't modified
    rnds = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      rnds[i] = random[i];
    }
  } else {
    // rng() returns a fresh array we can modify
    rnds = rng();
  }

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  return buf ? writeBytes(rnds, buf, offset) : unsafeStringify(rnds);
}
