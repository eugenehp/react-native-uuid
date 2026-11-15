/* eslint-disable no-bitwise */
import {unsafeStringify} from './stringify.js';
import {rng} from './rng.js';
import {UUIDBuffer, writeBytes} from './utils.js';

/** Options for {@link v7}. Every field is optional. */
export type V7Options = {
  /** Time in milliseconds since the Unix epoch. Defaults to `Date.now()`. */
  msecs?: number;
  /** 32-bit sequence number, used to order UUIDs within one millisecond. */
  seq?: number;
  /** 16 random bytes to use instead of generating them. */
  random?: ArrayLike<number>;
  /** Function returning 16 random bytes. */
  rng?: () => ArrayLike<number>;
};

// Monotonic state for calls without options
let _msecs = -Infinity;
let _seq = 0;

const v7Bytes = (
  rnds: ArrayLike<number>,
  msecs: number | undefined,
  seq: number | undefined,
): Uint8Array => {
  if (rnds.length < 16) {
    throw new Error('Random bytes length must be >= 16');
  }

  if (msecs === undefined) {
    msecs = Date.now();
  }
  if (seq === undefined) {
    seq = ((rnds[6] * 0x7f) << 24) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
  }

  const b = new Uint8Array(16);
  // 48-bit big-endian millisecond timestamp
  b[0] = (msecs / 0x10000000000) & 0xff;
  b[1] = (msecs / 0x100000000) & 0xff;
  b[2] = (msecs / 0x1000000) & 0xff;
  b[3] = (msecs / 0x10000) & 0xff;
  b[4] = (msecs / 0x100) & 0xff;
  b[5] = msecs & 0xff;
  // Version 7 + top 4 bits of seq
  b[6] = 0x70 | ((seq >>> 28) & 0x0f);
  b[7] = (seq >>> 20) & 0xff;
  // Variant + next 6 bits of seq
  b[8] = 0x80 | ((seq >>> 14) & 0x3f);
  b[9] = (seq >>> 6) & 0xff;
  // Last 6 bits of seq + 2 random bits
  b[10] = ((seq << 2) & 0xff) | (rnds[10] & 0x03);
  for (let i = 11; i < 16; i++) {
    b[i] = rnds[i];
  }
  return b;
};

/**
 * Generate a Unix-epoch time-based (version 7) UUID per RFC 9562.
 *
 * v7 UUIDs sort by creation time, which makes them a good fit for database
 * keys. Without `options`, UUIDs from this process are strictly increasing,
 * even within the same millisecond.
 *
 * @param buf - If given, the 16 UUID bytes are written here and `buf` is returned.
 * @param offset - Index in `buf` to start writing at.
 * @throws Error if fewer than 16 random bytes are supplied.
 */
export function v7(
  options?: V7Options,
  buf?: undefined,
  offset?: number,
): string;
export function v7<T extends UUIDBuffer>(
  options: V7Options | undefined,
  buf: T,
  offset?: number,
): T;
export function v7<T extends UUIDBuffer>(
  options?: V7Options,
  buf?: T,
  offset?: number,
): string | T {
  let bytes: Uint8Array;

  if (options) {
    bytes = v7Bytes(
      options.random || (options.rng || rng)(),
      options.msecs,
      options.seq,
    );
  } else {
    const now = Date.now();
    const rnds = rng();

    if (now > _msecs) {
      // New millisecond: start from a random 31-bit sequence
      _seq = (rnds[6] << 23) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
      _msecs = now;
    } else {
      // Same (or earlier) millisecond: increment, rolling into the timestamp
      _seq = (_seq + 1) | 0;
      if (_seq === 0) {
        _msecs++;
      }
    }

    bytes = v7Bytes(rnds, _msecs, _seq);
  }

  return buf ? writeBytes(bytes, buf, offset) : unsafeStringify(bytes);
}
