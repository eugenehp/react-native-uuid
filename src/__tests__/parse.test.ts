import {parse} from '../parse';

describe('parse', () => {
  describe('Basic parsing', () => {
    it('should parse valid UUID string to byte array', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = parse(uuid);
      expect(result).toHaveLength(16);
      expect(result[0]).toBe(0x55);
      expect(result[1]).toBe(0x0e);
      expect(result[2]).toBe(0x84);
      expect(result[3]).toBe(0x00);
    });

    it('should parse NIL UUID', () => {
      const uuid = '00000000-0000-0000-0000-000000000000';
      const result = parse(uuid);
      expect(result).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('should parse uppercase UUID', () => {
      const uuid = '550E8400-E29B-41D4-A716-446655440000';
      const result = parse(uuid);
      expect(result).toHaveLength(16);
      expect(result[0]).toBe(0x55);
    });

    it('should parse mixed case UUID', () => {
      const uuid = '550e8400-E29B-41d4-a716-446655440000';
      const result = parse(uuid);
      expect(result).toHaveLength(16);
      expect(result[0]).toBe(0x55);
    });

    it('should parse UUID with all hex characters', () => {
      const uuid = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const result = parse(uuid);
      expect(result).toEqual([
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff,
      ]);
    });
  });

  describe('Parsing with buffer and offset', () => {
    it('should parse into provided buffer', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const buf: number[] = [];
      const result = parse(uuid, buf);
      expect(result).toBe(buf);
      expect(buf).toHaveLength(16);
    });

    it('should parse with offset into buffer', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const buf: number[] = new Array(32).fill(0);
      const offset = 8;
      parse(uuid, buf, offset);
      // Check first 8 bytes are still 0
      expect(buf.slice(0, 8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
      // Check parsed UUID starts at offset
      expect(buf[offset]).toBe(0x55);
    });

    it('should fill remaining bytes with 0 if string is short', () => {
      const shortUuid = '550e8400';
      const result = parse(shortUuid);
      expect(result).toHaveLength(16);
      // Last bytes should be 0
      expect(result.slice(4)).toEqual([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it('should handle empty string', () => {
      const result = parse('');
      expect(result).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('Edge cases', () => {
    it('should parse UUID without hyphens', () => {
      const uuid = '550e8400e29b41d4a716446655440000';
      const result = parse(uuid);
      expect(result).toHaveLength(16);
      expect(result[0]).toBe(0x55);
    });

    it('should ignore invalid characters and parse valid hex', () => {
      // Only valid hex pairs are parsed
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = parse(uuid);
      expect(result).toHaveLength(16);
    });

    it('should not overflow buffer', () => {
      const veryLongString = '550e8400-e29b-41d4-a716-446655440000-extra-stuff';
      const result = parse(veryLongString);
      expect(result).toHaveLength(16);
    });

    it('should handle odd hex string length', () => {
      const result = parse('a');
      expect(result).toHaveLength(16);
    });

    it('should correctly parse each byte position', () => {
      const uuid = '01234567-89ab-cdef-0123-456789abcdef';
      const result = parse(uuid);
      expect(result[0]).toBe(0x01);
      expect(result[1]).toBe(0x23);
      expect(result[2]).toBe(0x45);
      expect(result[3]).toBe(0x67);
      expect(result[4]).toBe(0x89);
      expect(result[5]).toBe(0xab);
      expect(result[6]).toBe(0xcd);
      expect(result[7]).toBe(0xef);
      expect(result[8]).toBe(0x01);
      expect(result[9]).toBe(0x23);
      expect(result[10]).toBe(0x45);
      expect(result[11]).toBe(0x67);
      expect(result[12]).toBe(0x89);
      expect(result[13]).toBe(0xab);
      expect(result[14]).toBe(0xcd);
      expect(result[15]).toBe(0xef);
    });
  });

  describe('Round-trip conversion', () => {
    it('should pair correctly with stringify', () => {
      const {stringify} = require('../stringify');
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const parsed = parse(uuid);
      const stringified = stringify(new Uint8Array(parsed));
      expect(stringified.toLowerCase()).toBe(uuid.toLowerCase());
    });
  });
});
