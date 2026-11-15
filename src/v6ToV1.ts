/* eslint-disable no-bitwise */
import {parse} from './parse.js';
import {unsafeStringify} from './stringify.js';

const v6ToV1Bytes = (b: ArrayLike<number>): Uint8Array =>
  Uint8Array.of(
    ((b[3] & 0x0f) << 4) | ((b[4] >> 4) & 0x0f),
    ((b[4] & 0x0f) << 4) | ((b[5] & 0xf0) >> 4),
    ((b[5] & 0x0f) << 4) | (b[6] & 0x0f),
    b[7],
    ((b[1] & 0x0f) << 4) | ((b[2] & 0xf0) >> 4),
    ((b[2] & 0x0f) << 4) | ((b[3] & 0xf0) >> 4),
    0x10 | ((b[0] & 0xf0) >> 4),
    ((b[0] & 0x0f) << 4) | ((b[1] & 0xf0) >> 4),
    b[8],
    b[9],
    b[10],
    b[11],
    b[12],
    b[13],
    b[14],
    b[15],
  );

/**
 * Convert a v6 UUID to the equivalent v1 UUID. Accepts and returns either a
 * string or bytes.
 */
export function v6ToV1(uuid: string): string;
export function v6ToV1(uuid: ArrayLike<number>): Uint8Array;
export function v6ToV1(uuid: string | ArrayLike<number>): string | Uint8Array {
  const bytes = v6ToV1Bytes(typeof uuid === 'string' ? parse(uuid) : uuid);
  return typeof uuid === 'string' ? unsafeStringify(bytes) : bytes;
}
