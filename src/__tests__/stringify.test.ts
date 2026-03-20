import {stringify} from '../stringify';

describe('stringify', () => {
  describe('Basic stringification', () => {
    it('should convert byte array to UUID string', () => {
      const bytes = new Uint8Array([
        0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4, 0xa7, 0x16, 0x44, 0x66,
        0x55, 0x44, 0x00, 0x00,
      ]);
      const result = stringify(bytes);
      expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should convert zero bytes to NIL UUID', () => {
      const bytes = new Uint8Array(16).fill(0);
      const result = stringify(bytes);
      expect(result).toBe('00000000-0000-0000-0000-000000000000');
    });

    it('should convert mixed FF and random bytes', () => {
      // Create a valid UUID with version and variant bits set
      const bytes = new Uint8Array([
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x4f, 0xff, 0x8f, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff,
      ]);
      const result = stringify(bytes);
      // Should have version 4 and variant bits set
      expect(result.charAt(14)).toBe('4');
      expect(['8', '9', 'a', 'b']).toContain(result.charAt(19).toLowerCase());
    });

    it('should handle array with mixed values', () => {
      const bytes = new Uint8Array([
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0x4d, 0xef, 0x81, 0x23, 0x45, 0x67,
        0x89, 0xab, 0xcd, 0xef,
      ]);
      const result = stringify(bytes);
      expect(result).toBe('01234567-89ab-4def-8123-456789abcdef');
    });
  });

  describe('Offset parameter', () => {
    it('should use offset to read from array', () => {
      const bytes = new Uint8Array([
        0x00, 0x00, 0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4, 0xa7, 0x16,
        0x44, 0x66, 0x55, 0x44, 0x00, 0x00, 0x00, 0x00,
      ]);
      const result = stringify(bytes, 2);
      expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should default offset to 0', () => {
      const bytes = new Uint8Array([
        0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4, 0xa7, 0x16, 0x44, 0x66,
        0x55, 0x44, 0x00, 0x00,
      ]);
      const result1 = stringify(bytes);
      const result2 = stringify(bytes, 0);
      expect(result1).toBe(result2);
    });

    it('should correctly handle large offset', () => {
      const bytes = new Uint8Array(32).fill(0);
      // Fill bytes at offset 16
      bytes.set(
        [
          0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4, 0xa7, 0x16, 0x44,
          0x66, 0x55, 0x44, 0x00, 0x00,
        ],
        16,
      );
      const result = stringify(bytes, 16);
      expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('Format validation', () => {
    it('should always return valid UUID format', () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      for (let i = 0; i < 10; i++) {
        const bytes = new Uint8Array(16);
        // Fill with random bytes but set version and variant bits
        for (let j = 0; j < 16; j++) {
          bytes[j] = Math.floor(Math.random() * 256);
        }
        // Set version to 4 and variant to reserved
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const result = stringify(bytes);
        expect(result).toMatch(uuidRegex);
      }
    });

    it('should use lowercase hex characters', () => {
      const bytes = new Uint8Array([
        0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x4a, 0xbb, 0x8c, 0xdd, 0xee, 0xff,
        0xaa, 0xbb, 0xcc, 0xdd,
      ]);
      const result = stringify(bytes);
      expect(result).toMatch(/^[0-9a-f-]+$/);
      expect(result).not.toMatch(/[A-F]/);
    });
  });

  describe('Hyphen placement', () => {
    it('should have hyphens at correct positions', () => {
      const bytes = new Uint8Array([
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0x4d, 0xef, 0x81, 0x23, 0x56, 0x78,
        0x9a, 0xbc, 0xde, 0xf0,
      ]);
      const result = stringify(bytes);
      expect(result[8]).toBe('-');
      expect(result[13]).toBe('-');
      expect(result[18]).toBe('-');
      expect(result[23]).toBe('-');
    });

    it('should have correct segment lengths', () => {
      const bytes = new Uint8Array([
        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0x4d, 0xef, 0x81, 0x23, 0x56, 0x78,
        0x9a, 0xbc, 0xde, 0xf0,
      ]);
      const result = stringify(bytes);
      const parts = result.split('-');
      expect(parts[0]).toHaveLength(8);
      expect(parts[1]).toHaveLength(4);
      expect(parts[2]).toHaveLength(4);
      expect(parts[3]).toHaveLength(4);
      expect(parts[4]).toHaveLength(12);
    });
  });

  describe('Round-trip conversion', () => {
    it('should pair correctly with parse', () => {
      const {parse} = require('../parse');
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const bytes = new Uint8Array(parse(uuid));
      const stringified = stringify(bytes);
      expect(stringified.toLowerCase()).toBe(uuid.toLowerCase());
    });

    it('should maintain data through multiple round trips', () => {
      const {parse} = require('../parse');
      const original = '550e8400-e29b-41d4-a716-446655440000';
      let current = original.toLowerCase();

      for (let i = 0; i < 5; i++) {
        const bytes = new Uint8Array(parse(current));
        current = stringify(bytes);
      }

      expect(current).toBe(original.toLowerCase());
    });
  });
});
