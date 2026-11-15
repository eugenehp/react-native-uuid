import {createHash, randomBytes} from 'crypto';
import {md5} from '../md5';
import {sha1} from '../sha1';

const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex');
const ascii = (s: string) => Uint8Array.from(Buffer.from(s, 'latin1'));

describe('md5', () => {
  // RFC 1321 test suite
  it.each([
    ['', 'd41d8cd98f00b204e9800998ecf8427e'],
    ['a', '0cc175b9c0f1b6a831c399e269772661'],
    ['abc', '900150983cd24fb0d6963f7d28e17f72'],
    ['message digest', 'f96b697d7cb7938d525a2f31aaf161d0'],
    [
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
      '57edf4a22be3c955ac49da2e2107b67a',
    ],
  ])('should hash %j', (input, expected) => {
    expect(hex(md5(ascii(input)))).toBe(expected);
  });
});

describe('sha1', () => {
  // FIPS 180 test vectors
  it.each([
    ['', 'da39a3ee5e6b4b0d3255bfef95601890afd80709'],
    ['abc', 'a9993e364706816aba3e25717850c26c9cd0d89d'],
    [
      'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
      '84983e441c3bd26ebaae4aa1f95129e5e54670f1',
    ],
  ])('should hash %j', (input, expected) => {
    expect(hex(sha1(ascii(input)))).toBe(expected);
  });
});

describe('md5 and sha1 against Node crypto', () => {
  // Lengths around the 55/56/64-byte padding boundaries
  it.each([0, 1, 55, 56, 57, 63, 64, 65, 119, 120, 1000, 100000])(
    'should match for %d random bytes',
    length => {
      const bytes = randomBytes(length);
      expect(hex(md5(bytes))).toBe(
        createHash('md5').update(bytes).digest('hex'),
      );
      expect(hex(sha1(bytes))).toBe(
        createHash('sha1').update(bytes).digest('hex'),
      );
    },
  );
});
