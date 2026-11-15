/* eslint-disable no-bitwise */
// MD5 (RFC 1321), operating on bytes. Only used for v3 UUIDs.

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
  9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
  16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
  21,
];

const K = new Int32Array(64);
for (let i = 0; i < 64; i++) {
  K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
}

export const md5 = (bytes: ArrayLike<number>): Uint8Array => {
  const len = bytes.length;
  // Message + 0x80 + zero padding + 64-bit length, rounded up to 64 bytes
  const padded = new Uint8Array((((len + 8) >>> 6) + 1) * 64);
  padded.set(bytes);
  padded[len] = 0x80;
  const bitLen = len * 8;
  const end = padded.length - 8;
  padded[end] = bitLen & 0xff;
  padded[end + 1] = (bitLen >>> 8) & 0xff;
  padded[end + 2] = (bitLen >>> 16) & 0xff;
  padded[end + 3] = (bitLen >>> 24) & 0xff;
  const hi = Math.floor(len / 0x20000000);
  padded[end + 4] = hi & 0xff;
  padded[end + 5] = (hi >>> 8) & 0xff;
  padded[end + 6] = (hi >>> 16) & 0xff;
  padded[end + 7] = (hi >>> 24) & 0xff;

  let a0 = 0x67452301;
  let b0 = 0xefcdab89 | 0;
  let c0 = 0x98badcfe | 0;
  let d0 = 0x10325476;
  const M = new Int32Array(16);

  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      M[i] =
        padded[j] |
        (padded[j + 1] << 8) |
        (padded[j + 2] << 16) |
        (padded[j + 3] << 24);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) & 15;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) & 15;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) & 15;
      }
      const t = (a + f + K[i] + M[g]) | 0;
      a = d;
      d = c;
      c = b;
      b = (b + ((t << S[i]) | (t >>> (32 - S[i])))) | 0;
    }

    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const out = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((w, i) => {
    out[i * 4] = w & 0xff;
    out[i * 4 + 1] = (w >>> 8) & 0xff;
    out[i * 4 + 2] = (w >>> 16) & 0xff;
    out[i * 4 + 3] = (w >>> 24) & 0xff;
  });
  return out;
};

export default md5;
