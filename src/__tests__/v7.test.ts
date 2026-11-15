import {v7} from '../v7';
import {parse} from '../parse';
import {validate} from '../validate';
import {version} from '../version';

const random = [
  0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67,
  0x1c, 0x58, 0x36,
];

describe('v7', () => {
  it('should generate a valid v7 UUID', () => {
    const uuid = v7();
    expect(validate(uuid)).toBe(true);
    expect(version(uuid)).toBe(7);
  });

  it('should encode the timestamp in the first 48 bits', () => {
    const msecs = 1645557742000;
    const uuid = v7({msecs, random});
    expect(parseInt(uuid.replace(/-/g, '').slice(0, 12), 16)).toBe(msecs);
  });

  // Reference values from the uuid npm package
  it.each([
    [0, 0, '00000000-0000-7000-8000-03e1671c5836'],
    [1645557742000, undefined, '017f22e2-79b0-7bfe-a9c6-d3e1671c5836'],
    [1645557742000, 0xffffffff, '017f22e2-79b0-7fff-bfff-ffe1671c5836'],
  ])(
    'should match the reference for msecs=%d seq=%s',
    (msecs, seq, expected) => {
      expect(v7({msecs, seq, random})).toBe(expected);
    },
  );

  it('should be strictly increasing without options', () => {
    let prev = v7();
    for (let i = 0; i < 10000; i++) {
      const next = v7();
      expect(next > prev).toBe(true);
      prev = next;
    }
  });

  it('should stay increasing when the clock goes backwards', () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(2000000000000);
    const first = v7();
    now.mockReturnValue(1000000000000);
    expect(v7() > first).toBe(true);
    now.mockRestore();
  });

  it('should write to a buffer at an offset', () => {
    const buf = new Uint8Array(20);
    expect(v7({msecs: 0, seq: 0, random}, buf, 4)).toBe(buf);
    expect(Array.from(buf.slice(4))).toEqual(
      parse('00000000-0000-7000-8000-03e1671c5836'),
    );
  });

  it('should throw if fewer than 16 random bytes are given', () => {
    expect(() => v7({random: [1, 2, 3]})).toThrow(
      'Random bytes length must be >= 16',
    );
  });

  it('should use the current time when only random bytes are given', () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(1645557742000);
    expect(v7({random}).slice(0, 13)).toBe('017f22e2-79b0');
    now.mockRestore();
  });
});
