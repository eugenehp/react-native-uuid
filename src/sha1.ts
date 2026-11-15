/* eslint-disable no-bitwise */
// SHA-1 (FIPS 180-4), operating on bytes. Only used for v5 UUIDs.

const rotl = (x: number, n: number) => (x << n) | (x >>> (32 - n));

export const sha1 = (bytes: ArrayLike<number>): Uint8Array => {
  const len = bytes.length;
  // Message + 0x80 + zero padding + 64-bit big-endian length, rounded up to 64 bytes
  const padded = new Uint8Array((((len + 8) >>> 6) + 1) * 64);
  padded.set(bytes);
  padded[len] = 0x80;
  const end = padded.length - 8;
  const hi = Math.floor(len / 0x20000000);
  const lo = (len * 8) >>> 0;
  padded[end] = (hi >>> 24) & 0xff;
  padded[end + 1] = (hi >>> 16) & 0xff;
  padded[end + 2] = (hi >>> 8) & 0xff;
  padded[end + 3] = hi & 0xff;
  padded[end + 4] = (lo >>> 24) & 0xff;
  padded[end + 5] = (lo >>> 16) & 0xff;
  padded[end + 6] = (lo >>> 8) & 0xff;
  padded[end + 7] = lo & 0xff;

  const H = [
    0x67452301,
    0xefcdab89 | 0,
    0x98badcfe | 0,
    0x10325476,
    0xc3d2e1f0 | 0,
  ];
  const W = new Int32Array(80);

  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      W[i] =
        (padded[j] << 24) |
        (padded[j + 1] << 16) |
        (padded[j + 2] << 8) |
        padded[j + 3];
    }
    for (let i = 16; i < 80; i++) {
      W[i] = rotl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    let [a, b, c, d, e] = H;

    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc | 0;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6 | 0;
      }
      const t = (rotl(a, 5) + f + e + k + W[i]) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = t;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
  }

  const out = new Uint8Array(20);
  H.forEach((w, i) => {
    out[i * 4] = (w >>> 24) & 0xff;
    out[i * 4 + 1] = (w >>> 16) & 0xff;
    out[i * 4 + 2] = (w >>> 8) & 0xff;
    out[i * 4 + 3] = w & 0xff;
  });
  return out;
};

export default sha1;
