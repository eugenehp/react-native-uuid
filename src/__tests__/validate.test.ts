import {validate} from '../validate';

describe('validate', () => {
  describe('Valid UUIDs', () => {
    it('should validate v1 UUID', () => {
      // Valid v1 UUID
      expect(validate('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should validate v3 UUID', () => {
      // Valid v3 UUID (version bits are 3)
      expect(validate('6ba7b810-9dad-31d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should validate v4 UUID', () => {
      // Valid v4 UUID (version bits are 4)
      expect(validate('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should validate v5 UUID', () => {
      // Valid v5 UUID (version bits are 5)
      expect(validate('886313e1-3b8a-5372-9b90-0c9aee199e5d')).toBe(true);
    });

    it('should validate NIL UUID', () => {
      expect(validate('00000000-0000-0000-0000-000000000000')).toBe(true);
    });

    it('should validate uppercase UUID', () => {
      expect(validate('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });

    it('should validate mixed case UUID', () => {
      expect(validate('550e8400-E29b-41D4-a716-446655440000')).toBe(true);
    });

    it('should validate all lowercase UUID', () => {
      expect(validate('6ba7b811-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });
  });

  describe('Invalid UUIDs', () => {
    it('should reject UUID with invalid characters', () => {
      expect(validate('550e8400-e29b-41d4-a716-44665544000z')).toBe(false);
    });

    it('should reject UUID without hyphens', () => {
      expect(validate('550e8400e29b41d4a716446655440000')).toBe(false);
    });

    it('should reject UUID with incorrect number of segments', () => {
      expect(validate('550e8400-e29b-41d4-a716')).toBe(false);
    });

    it('should reject UUID with incorrect segment lengths', () => {
      expect(validate('550e840-e29b-41d4-a716-446655440000')).toBe(false);
    });

    it('should reject UUID with wrong version bits', () => {
      expect(validate('550e8400-e29b-61d4-a716-446655440000')).toBe(false);
    });

    it('should reject UUID with wrong variant bits', () => {
      expect(validate('550e8400-e29b-41d4-3716-446655440000')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validate('')).toBe(false);
    });

    it('should reject null as string', () => {
      expect(validate(null as any)).toBe(false);
    });

    it('should reject undefined as string', () => {
      expect(validate(undefined as any)).toBe(false);
    });

    it('should reject number', () => {
      expect(validate(123 as any)).toBe(false);
    });

    it('should reject object', () => {
      expect(validate({} as any)).toBe(false);
    });

    it('should reject array', () => {
      expect(validate([] as any)).toBe(false);
    });

    it('should reject string with extra spaces', () => {
      expect(validate('550e8400-e29b-41d4-a716-446655440000 ')).toBe(false);
    });

    it('should reject string with leading spaces', () => {
      expect(validate(' 550e8400-e29b-41d4-a716-446655440000')).toBe(false);
    });

    it('should reject string with internal spaces', () => {
      expect(validate('550e8400-e29b-41d4-a716-44665544 000')).toBe(false);
    });
  });
});
