/* eslint-disable no-bitwise */
import {unsafeStringify} from './stringify.js';
import {parse} from './parse.js';
import {DNS, URL, UUIDBuffer, stringToBytes, writeBytes} from './utils.js';

/** A name-based UUID generator ({@link v3} or {@link v5}). */
export interface GenerateUUID {
  (
    value: string | ArrayLike<number>,
    namespace: string | ArrayLike<number>,
  ): string;
  <T extends UUIDBuffer>(
    value: string | ArrayLike<number>,
    namespace: string | ArrayLike<number>,
    buf: T,
    offset?: number,
  ): T;
  /** The DNS namespace UUID. */
  readonly DNS: string;
  /** The URL namespace UUID. */
  readonly URL: string;
}

export const v35 = (
  version: number,
  hashfunc: (bytes: Uint8Array) => Uint8Array,
): GenerateUUID => {
  function generateUUID<T extends UUIDBuffer>(
    value: string | ArrayLike<number>,
    namespace: string | ArrayLike<number>,
    buf?: T,
    offset?: number,
  ): string | T {
    const name = typeof value === 'string' ? stringToBytes(value) : value;
    const ns = typeof namespace === 'string' ? parse(namespace) : namespace;

    if (!ns || ns.length !== 16) {
      throw TypeError(
        'Namespace must be array-like (16 iterable integer values, 0-255)',
      );
    }

    // Compute hash of namespace and value, Per 4.3
    const input = new Uint8Array(16 + name.length);
    input.set(ns);
    input.set(name, 16);
    const bytes = hashfunc(input);

    bytes[6] = (bytes[6] & 0x0f) | version;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    return buf ? writeBytes(bytes, buf, offset) : unsafeStringify(bytes);
  }

  return Object.assign(generateUUID as GenerateUUID, {DNS, URL});
};
