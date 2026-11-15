/* eslint-disable no-bitwise */
import {writeBytes} from './utils.js';
import {validate} from './validate.js';

/**
 * Parse a UUID string into its 16 bytes.
 *
 * @param buf - If given, bytes are written here instead of a new array.
 * @param offset - Index in `buf` to start writing at.
 * @throws TypeError('Invalid UUID') if `uuid` is not a valid UUID string
 * (see {@link validate}).
 */
export const parse = <T extends number[] | Uint8Array = number[]>(
  uuid: string,
  buf?: T,
  offset?: number,
): T => {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  // Decode fixed-position hex groups (input is validated, so this is safe).
  // Groups longer than 8 hex digits are split so each fits in 32 bits.
  let v: number;
  const bytes: number[] = [
    // time_low: 8 hex digits
    (v = parseInt(uuid.slice(0, 8), 16)) >>> 24,
    (v >>> 16) & 0xff,
    (v >>> 8) & 0xff,
    v & 0xff,
    // time_mid: 4
    (v = parseInt(uuid.slice(9, 13), 16)) >>> 8,
    v & 0xff,
    // time_hi_and_version: 4
    (v = parseInt(uuid.slice(14, 18), 16)) >>> 8,
    v & 0xff,
    // clock_seq: 4
    (v = parseInt(uuid.slice(19, 23), 16)) >>> 8,
    v & 0xff,
    // node: 12 hex digits, as 4 + 8
    (v = parseInt(uuid.slice(24, 28), 16)) >>> 8,
    v & 0xff,
    (v = parseInt(uuid.slice(28, 36), 16)) >>> 24,
    (v >>> 16) & 0xff,
    (v >>> 8) & 0xff,
    v & 0xff,
  ];

  return buf ? writeBytes(bytes, buf, offset) : (bytes as T);
};
