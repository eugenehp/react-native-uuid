let _byteToHex: string[] = [];
let _hexToByte: {[key: string]: number} = {};

for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

export const byteToHex = _byteToHex;
export const hexToByte = _hexToByte;

export const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
export const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
export const OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
export const X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8';
export const NIL = '00000000-0000-0000-0000-000000000000';

export const stringToBytes = (str: string): Uint8Array => {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = new Uint8Array(str.length);

  for (let j = 0; j < str.length; ++j) {
    bytes[j] = str.charCodeAt(j);
  }

  return bytes as any as Uint8Array;
};

export const bytesToString = (buf: ArrayBufferLike) => {
  const bufferView = new Uint8Array(buf, 0, (buf as any).byteLength);
  return String.fromCharCode.apply(null, Array.from(bufferView));
};
