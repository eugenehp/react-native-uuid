/* eslint-disable no-bitwise */
import {unsafeStringify} from './stringify.js';
import {rng} from './rng.js';
import {UUIDBuffer, writeBytes} from './utils.js';

/** Options for {@link v1} and {@link v6}. Every field is optional. */
export type V1Options = {
  /** 6-byte node ID. Defaults to a random value (with the multicast bit set). */
  node?: ArrayLike<number>;
  /** 14-bit clock sequence. Defaults to a random value. */
  clockseq?: number;
  /** Time in milliseconds since the Unix epoch. Defaults to `Date.now()`. */
  msecs?: number;
  /** Extra time in 100-nanosecond units (0-9999) added to `msecs`. */
  nsecs?: number;
  /** 16 random bytes used to seed `node` and `clockseq`. */
  random?: ArrayLike<number>;
  /** Function returning 16 random bytes, used instead of `random`. */
  rng?: () => ArrayLike<number>;
};

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId: number[] | undefined;
let _clockseq: number | undefined;

// Previous uuid creation time
let _lastMSecs = 0;
let _lastNSecs = 0;

/**
 * Write a v1 UUID's 16 bytes into `b`.
 * @internal `randomNode` makes node and clockseq random per call (used by v6).
 */
export const v1Bytes = (
  opts: V1Options,
  b: Uint8Array,
  randomNode: boolean = false,
): Uint8Array => {
  let i = 0;
  let node: ArrayLike<number> | undefined =
    opts.node || (randomNode ? undefined : _nodeId);
  let clockseq =
    opts.clockseq !== undefined
      ? opts.clockseq
      : randomNode
        ? undefined
        : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    const seedBytes = opts.random || (opts.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = [
        seedBytes[0] | 0x01,
        seedBytes[1],
        seedBytes[2],
        seedBytes[3],
        seedBytes[4],
        seedBytes[5],
      ];
      if (!randomNode) {
        _nodeId = node as number[];
      }
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff;
      if (!randomNode) {
        _clockseq = clockseq;
      }
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  let msecs: number = opts.msecs !== undefined ? opts.msecs : Date.now();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  let nsecs: number = opts.nsecs !== undefined ? opts.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  const dt: number = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && opts.clockseq === undefined) {
    clockseq = (clockseq + 1) & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && opts.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  if (!randomNode) {
    _clockseq = clockseq;
  }

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = (tl >>> 24) & 0xff;
  b[i++] = (tl >>> 16) & 0xff;
  b[i++] = (tl >>> 8) & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  const tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;
  b[i++] = (tmh >>> 8) & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = ((tmh >>> 24) & 0xf) | 0x10; // include version
  b[i++] = (tmh >>> 16) & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = (clockseq >>> 8) | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return b;
};

/**
 * Generate a time-based (version 1) UUID.
 *
 * Node ID and clock sequence are random per process unless given in `options`.
 * Up to 10,000 UUIDs can be generated per millisecond.
 *
 * @param options - Override `node`, `clockseq`, `msecs`, `nsecs`, or the random source.
 * @param buf - If given, the 16 UUID bytes are written here and `buf` is returned.
 * @param offset - Index in `buf` to start writing at.
 * @returns The UUID string, or `buf` when one is passed.
 * @see https://github.com/uuidjs/uuid for API details
 */
export function v1(
  options?: V1Options,
  buf?: undefined,
  offset?: number,
): string;
export function v1<T extends UUIDBuffer>(
  options: V1Options | undefined,
  buf: T,
  offset?: number,
): T;
export function v1<T extends UUIDBuffer>(
  options?: V1Options,
  buf?: T,
  offset?: number,
): string | T {
  const bytes = v1Bytes(options || {}, new Uint8Array(16));
  return buf ? writeBytes(bytes, buf, offset) : unsafeStringify(bytes);
}
