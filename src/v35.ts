/* eslint-disable no-bitwise */
import {stringify} from './stringify';
import {parse} from './parse';
import {stringToBytes, bytesToString} from './utils';

export type GenerateUUID = (
  value: string | Uint8Array,
  namespace: string | number[],
  buf?: number[],
  offset?: number,
) => string | number[];

export const v35 = (
  name: string,
  version: number,
  hashfunc: (s: string) => string,
): GenerateUUID => {
  const generateUUID = (
    value: string | Uint8Array,
    namespace: string | number[],
    buf?: number[],
    offset: number = 0,
  ): string | number[] => {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = parse(namespace);
    }

    if (namespace && namespace.length !== 16) {
      throw TypeError(
        'Namespace must be array-like (16 iterable integer values, 0-255)',
      );
    }

    // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g.
    // `bytes = hashfunc([...namespace, ... value])`
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = stringToBytes(hashfunc(bytesToString(bytes)));

    bytes[6] = (bytes[6] & 0x0f) | version;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    if (buf) {
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }
    }

    return buf ? buf : stringify(bytes);
  };

  return generateUUID;
};
