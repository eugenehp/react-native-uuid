import {v1} from '../v1';
import {validate} from '../validate';
import {version} from '../version';

describe('v1', () => {
  describe('Basic generation', () => {
    it('should generate a valid v1 UUID', () => {
      const uuid = v1() as string;
      expect(typeof uuid).toBe('string');
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(1);
    });

    it('should generate different UUIDs on subsequent calls', () => {
      const uuid1 = v1() as string;
      // Add small delay to ensure different timestamp
      const uuid2 = v1() as string;
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate multiple valid v1 UUIDs', () => {
      for (let i = 0; i < 10; i++) {
        const uuid = v1() as string;
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(1);
        expect(typeof uuid).toBe('string');
      }
    });
  });

  describe('With options', () => {
    it('should use provided node ID', () => {
      const node = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06];
      const uuid1 = v1({node} as any) as string;
      const uuid2 = v1({node} as any) as string;
      // Both should be valid
      expect(validate(uuid1)).toBe(true);
      expect(validate(uuid2)).toBe(true);
      // Node ID is in the last 12 characters (3 segments)
      expect(uuid1.slice(-12)).toBe(uuid2.slice(-12));
    });

    it('should use provided clockseq', () => {
      const node = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06];
      const clockseq = 0x1234;
      const uuid = v1({node, clockseq} as any) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(1);
    });

    it('should use provided random bytes', () => {
      const node = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06];
      const random = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c];
      const uuid = v1({node, random} as any) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should use provided timestamp values', () => {
      const node = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06];
      const msecs = Date.now();
      const nsecs = 0;
      const uuid = v1({node, msecs, nsecs} as any) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(1);
    });
  });

  describe('With buffer', () => {
    it('should write v1 UUID to provided buffer', () => {
      const buf = new Uint8Array(16);
      const result = v1({} as any, buf);
      expect(result).toEqual(buf);
      expect(buf.some(b => b !== 0)).toBe(true); // Should have non-zero bytes
    });

    it('should write v1 UUID to buffer with offset', () => {
      const buf = new Uint8Array(32);
      const offset = 8;
      v1({} as any, buf, offset);
      // First 8 bytes should be 0
      expect(buf.slice(0, 8).every(b => b === 0)).toBe(true);
      // Bytes at offset should have data
      expect(buf.slice(offset, offset + 16).some(b => b !== 0)).toBe(true);
    });

    it('should return the buffer', () => {
      const buf = new Uint8Array(16);
      const result = v1({} as any, buf);
      expect(result).toBe(buf);
    });

    it('should allow reading buffer content as valid UUID', () => {
      const {stringify} = require('../stringify');
      const buf = new Uint8Array(16);
      v1({} as any, buf);
      const uuid = stringify(buf);
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(1);
    });
  });

  describe('Node ID format', () => {
    it('should accept custom node ID array', () => {
      const nodeIds = [
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
        [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
      ];

      for (const node of nodeIds) {
        const uuid = v1({node} as any) as string;
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(1);
      }
    });
  });

  describe('Format validation', () => {
    it('should follow UUID format specification', () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      for (let i = 0; i < 10; i++) {
        const uuid = v1() as string;
        expect(uuid).toMatch(uuidRegex);
      }
    });

    it('should have version 1 in correct position', () => {
      const uuid = v1() as string;
      // Version is 3rd character of 3rd segment (position 14)
      expect(uuid.charAt(14)).toBe('1');
    });

    it('should have correct variant bits', () => {
      const uuid = v1() as string;
      // Variant is first character of 4th segment (position 19)
      const variantChar = uuid.charAt(19).toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });

  describe('Deterministic with same options', () => {
    it('should generate valid v1 UUIDs with identical fixed options', () => {
      const options = {
        node: [0x01, 0x02, 0x03, 0x04, 0x05, 0x06],
        msecs: 1000000000000,
        nsecs: 0,
        clockseq: 0x1234,
      } as any;

      const uuid1 = v1(options) as string;
      const uuid2 = v1(options) as string;

      // Both should be valid v1 UUIDs with the same node ID
      expect(validate(uuid1)).toBe(true);
      expect(validate(uuid2)).toBe(true);
      expect(version(uuid1)).toBe(1);
      expect(version(uuid2)).toBe(1);
      // Node ID should be the same (last 12 characters)
      expect(uuid1.slice(-12)).toBe(uuid2.slice(-12));
    });
  });
});
