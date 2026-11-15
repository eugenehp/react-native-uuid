const _byteToHex: string[] = [];
const _hexToByte: {[key: string]: number} = {};

for (let i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).slice(1);
  _hexToByte[_byteToHex[i]] = i;
}

export const byteToHex = _byteToHex;
export const hexToByte = _hexToByte;

export const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
export const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
export const OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
export const X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8';
export const NIL = '00000000-0000-0000-0000-000000000000';
export const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

/** A writable 16+ byte buffer that UUID bytes can be written into. */
export type UUIDBuffer = number[] | Uint8Array;

/**
 * UTF-8 encode a string. Throws `URIError` on lone surrogates, like the
 * `uuid` package.
 */
export const stringToBytes = (str: string): Uint8Array => {
  const encoded = encodeURIComponent(str);
  const bytes: number[] = [];

  for (let j = 0; j < encoded.length; j++) {
    if (encoded[j] === '%') {
      bytes.push(_hexToByte[encoded.slice(j + 1, j + 3).toLowerCase()]);
      j += 2;
    } else {
      bytes.push(encoded.charCodeAt(j));
    }
  }

  return new Uint8Array(bytes);
};

/**
 * Copy 16 bytes into `buf` at `offset`. Plain arrays grow as needed; typed
 * arrays must be large enough.
 */
export const writeBytes = <T extends UUIDBuffer>(
  bytes: ArrayLike<number>,
  buf: T,
  offset: number = 0,
): T => {
  if (offset < 0 || (!Array.isArray(buf) && offset + 16 > buf.length)) {
    throw new RangeError(
      `UUID byte range ${offset}:${offset + 15} is out of buffer bounds`,
    );
  }
  for (let i = 0; i < 16; i++) {
    buf[offset + i] = bytes[i];
  }
  return buf;
};
