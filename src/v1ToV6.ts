/* eslint-disable no-bitwise */
import {parse} from './parse.js';
import {unsafeStringify} from './stringify.js';

/** Reorder v1 UUID bytes into v6 layout. @internal */
export const v1ToV6Bytes = (b: ArrayLike<number>): Uint8Array =>
  Uint8Array.of(
    ((b[6] & 0x0f) << 4) | ((b[7] >> 4) & 0x0f),
    ((b[7] & 0x0f) << 4) | ((b[4] & 0xf0) >> 4),
    ((b[4] & 0x0f) << 4) | ((b[5] & 0xf0) >> 4),
    ((b[5] & 0x0f) << 4) | ((b[0] & 0xf0) >> 4),
    ((b[0] & 0x0f) << 4) | ((b[1] & 0xf0) >> 4),
    ((b[1] & 0x0f) << 4) | ((b[2] & 0xf0) >> 4),
    0x60 | (b[2] & 0x0f),
    b[3],
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
 * Convert a v1 UUID to the equivalent v6 UUID (same timestamp, clock sequence
 * and node). Accepts and returns either a string or bytes.
 */
export function v1ToV6(uuid: string): string;
export function v1ToV6(uuid: ArrayLike<number>): Uint8Array;
export function v1ToV6(uuid: string | ArrayLike<number>): string | Uint8Array {
  const bytes = v1ToV6Bytes(typeof uuid === 'string' ? parse(uuid) : uuid);
  return typeof uuid === 'string' ? unsafeStringify(bytes) : bytes;
}
