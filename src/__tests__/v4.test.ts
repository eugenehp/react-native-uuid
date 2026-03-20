import {v4} from '../v4';
import {validate} from '../validate';
import {version} from '../version';

describe('v4', () => {
  describe('Basic generation', () => {
    it('should generate a valid v4 UUID', () => {
      const uuid = v4();
      expect(typeof uuid).toBe('string');
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(4);
    });

    it('should generate random UUIDs', () => {
      const uuid1 = v4();
      const uuid2 = v4();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate multiple valid v4 UUIDs', () => {
      for (let i = 0; i < 20; i++) {
        const uuid = v4();
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(4);
        expect(typeof uuid).toBe('string');
      }
    });

    it('should have reasonable distribution of values', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(v4());
      }
      // Should have unique UUIDs (with extremely high probability)
      expect(uuids.size).toBe(100);
    });
  });

  describe('With custom random bytes', () => {
    it('should use provided random bytes', () => {
      const random = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78,
        0x9a, 0xbc, 0xde, 0xf0,
      ];
      const uuid = v4({random});
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(4);
    });

    it('should generate consistent UUID with same random bytes', () => {
      const random = [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78,
        0x9a, 0xbc, 0xde, 0xf0,
      ];
      const uuid1 = v4({random});
      const uuid2 = v4({random});
      expect(uuid1).toBe(uuid2);
    });

    it('should apply version and variant bits correctly', () => {
      const random = [
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff,
      ];
      const uuid = v4({random});
      // Version should be 4
      expect(uuid.charAt(14)).toBe('4');
      // Variant bits should be 10
      const variantChar = uuid.charAt(19).toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });

  describe('With custom RNG function', () => {
    it('should use provided RNG function', () => {
      let callCount = 0;
      const rng = () => {
        callCount++;
        return [
          0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78,
          0x9a, 0xbc, 0xde, 0xf0,
        ];
      };
      const uuid = v4({rng} as any);
      expect(callCount).toBeGreaterThan(0);
      expect(validate(uuid)).toBe(true);
    });

    it('should generate deterministic UUID with deterministic RNG', () => {
      const rng = () => [
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78,
        0x9a, 0xbc, 0xde, 0xf0,
      ];
      const uuid1 = v4({rng} as any);
      const uuid2 = v4({rng} as any);
      expect(uuid1).toBe(uuid2);
    });
  });

  describe('With buffer', () => {
    it('should write v4 UUID to provided buffer', () => {
      const buf = new Array<number>(16);
      const result = v4(undefined, buf);
      expect(result).toEqual(buf);
      expect(buf.some(b => b !== undefined && b !== 0)).toBe(true);
    });

    it('should write v4 UUID to buffer with offset', () => {
      const buf = new Array<number>(32).fill(0);
      const offset = 8;
      v4(undefined, buf, offset);
      // Bytes at offset should have data
      expect(buf.slice(offset, offset + 16).some(b => b !== 0)).toBe(true);
    });

    it('should return the buffer', () => {
      const buf = new Array<number>(16);
      const result = v4(undefined, buf);
      expect(result).toBe(buf);
    });

    it('should allow reading buffer content as valid UUID', () => {
      const {stringify} = require('../stringify');
      const buf = new Array<number>();
      v4(undefined, buf);
      const uuid = stringify(new Uint8Array(buf));
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(4);
    });
  });

  describe('Format validation', () => {
    it('should follow UUID format specification', () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      for (let i = 0; i < 10; i++) {
        const uuid = v4();
        expect(uuid).toMatch(uuidRegex);
      }
    });

    it('should have version 4 in correct position', () => {
      const uuid = v4();
      // Version is 3rd character of 3rd segment (position 14)
      expect(uuid.charAt(14)).toBe('4');
    });

    it('should have correct variant bits', () => {
      const uuid = v4();
      // Variant is first character of 4th segment (position 19)
      const variantChar = uuid.charAt(19).toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });

  describe('Deprecated format argument', () => {
    it('should handle string format argument (deprecated)', () => {
      // The function accepts string as first argument even though it's deprecated
      const uuid = v4('some-format-string' as any);
      expect(validate(uuid)).toBe(true);
    });
  });

  describe('Randomness properties', () => {
    it('should generate UUIDs with good distribution', () => {
      const uuids = Array.from({length: 100}, () => v4());
      const hexChars = new Set<string>();

      for (const uuid of uuids) {
        const chars = uuid.replace(/-/g, '').split('');
        chars.forEach(c => hexChars.add(c));
      }

      // Should have variety of hex characters
      expect(hexChars.size).toBeGreaterThan(8);
    });

    it('should have non-zero random bytes in most cases', () => {
      const uuids = Array.from({length: 50}, () => v4());
      const hasZeroes = uuids.filter(uuid => uuid.includes('00')).length;
      // Some should have zeros, but not all
      expect(hasZeroes).toBeLessThan(50);
    });
  });
});
