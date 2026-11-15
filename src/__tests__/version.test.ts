import {version} from '../version';

describe('version', () => {
  describe('Valid UUID versions', () => {
    it('should extract version 1 from v1 UUID', () => {
      expect(version('550e8400-e29b-11d4-a716-446655440000')).toBe(1);
    });

    it('should extract version 3 from v3 UUID', () => {
      expect(version('6ba7b810-9dad-31d1-80b4-00c04fd430c8')).toBe(3);
    });

    it('should extract version 4 from v4 UUID', () => {
      expect(version('550e8400-e29b-41d4-a716-446655440000')).toBe(4);
    });

    it('should extract version 5 from v5 UUID', () => {
      expect(version('886313e1-3b8a-51d2-9b90-0c9aee199e5d')).toBe(5);
    });

    it('should handle uppercase UUID', () => {
      expect(version('550E8400-E29B-41D4-A716-446655440000')).toBe(4);
    });

    it('should handle mixed case UUID', () => {
      expect(version('550e8400-E29b-41D4-a716-446655440000')).toBe(4);
    });
  });

  describe('Invalid UUIDs', () => {
    it('should throw error for invalid UUID', () => {
      expect(() => version('invalid-uuid-string')).toThrow(TypeError);
    });

    it('should throw error for empty string', () => {
      expect(() => version('')).toThrow(TypeError);
    });

    it('should throw error for UUID with wrong version bits', () => {
      expect(() => version('550e8400-e29b-91d4-a716-446655440000')).toThrow(
        TypeError,
      );
    });

    it('should throw error for UUID with wrong variant bits', () => {
      expect(() => version('550e8400-e29b-41d4-3716-446655440000')).toThrow(
        TypeError,
      );
    });

    it('should throw error for non-string input', () => {
      expect(() => version(null as any)).toThrow(TypeError);
    });

    it('should throw error for undefined input', () => {
      expect(() => version(undefined as any)).toThrow(TypeError);
    });
  });

  describe('Edge cases', () => {
    it('should correctly extract version from second character of third segment', () => {
      // Version is at position 14 (char 3 of segment 3: XXXX)
      const uuid1 = '12345678-1234-1123-8123-123456789012';
      expect(version(uuid1)).toBe(1);

      const uuid4 = '12345678-1234-4123-8123-123456789012';
      expect(version(uuid4)).toBe(4);
    });
  });

  describe('RFC 9562 additions', () => {
    it.each([
      ['1e1041c7-10b9-662e-9234-0123456789ab', 6],
      ['017f22e2-79b0-7cc3-98c4-dc0c0c07398f', 7],
      ['320c3d4d-cc00-875b-8ec9-32d5f69181c0', 8],
      ['00000000-0000-0000-0000-000000000000', 0],
      ['ffffffff-ffff-ffff-ffff-ffffffffffff', 15],
    ])('version(%s) should be %d', (uuid, expected) => {
      expect(version(uuid)).toBe(expected);
    });
  });
});
