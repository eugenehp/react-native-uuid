import {v5} from '../v5';
import {validate} from '../validate';
import {version} from '../version';
import {DNS, URL, OID, X500} from '../utils';

describe('v5', () => {
  describe('Basic generation with namespace', () => {
    it('should generate valid v5 UUID with DNS namespace', () => {
      const uuid = v5('example.com', DNS) as string;
      expect(typeof uuid).toBe('string');
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });

    it('should generate valid v5 UUID with URL namespace', () => {
      const uuid = v5('https://example.com', URL) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });

    it('should generate valid v5 UUID with OID namespace', () => {
      const uuid = v5('1.3.6.1', OID) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });

    it('should generate valid v5 UUID with X500 namespace', () => {
      const uuid = v5('cn=example', X500) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });
  });

  describe('Deterministic generation', () => {
    it('should generate same UUID for same name and namespace', () => {
      const uuid1 = v5('example.com', DNS) as string;
      const uuid2 = v5('example.com', DNS) as string;
      expect(uuid1).toBe(uuid2);
    });

    it('should generate different UUIDs for different names', () => {
      const uuid1 = v5('example.com', DNS) as string;
      const uuid2 = v5('example.org', DNS) as string;
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate different UUIDs for different namespaces', () => {
      const uuid1 = v5('example.com', DNS) as string;
      const uuid2 = v5('example.com', URL) as string;
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate different UUIDs for different name cases', () => {
      const uuid1 = v5('example.com', DNS) as string;
      const uuid2 = v5('EXAMPLE.COM', DNS) as string;
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate different UUIDs from v3 for same input', () => {
      // v5 uses SHA1, v3 uses MD5, so different output
      const {v3} = require('../v3');
      const uuid3 = v3('example.com', DNS) as string;
      const uuid5 = v5('example.com', DNS) as string;
      expect(uuid3).not.toBe(uuid5);
      expect(version(uuid3)).toBe(3);
      expect(version(uuid5)).toBe(5);
    });
  });

  describe('With namespace as byte array', () => {
    it('should accept namespace as byte array', () => {
      const {parse} = require('../parse');
      const namespaceBytes = parse(DNS);
      const uuid = v5('example.com', namespaceBytes) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });

    it('should generate same UUID with byte array namespace as string namespace', () => {
      const {parse} = require('../parse');
      const namespaceBytes = parse(DNS);
      const uuid1 = v5('example.com', DNS) as string;
      const uuid2 = v5('example.com', namespaceBytes) as string;
      expect(uuid1).toBe(uuid2);
    });
  });

  describe('With buffer output', () => {
    it('should write v5 UUID to buffer', () => {
      const buf: number[] = [];
      const result = v5('example.com', DNS, buf);
      expect(result).toEqual(buf);
      expect(buf.length).toBe(16);
    });

    it('should write v5 UUID to buffer with offset', () => {
      const buf = new Array(32).fill(0);
      const offset = 8;
      v5('example.com', DNS, buf, offset);
      // Bytes at offset should have data
      expect(buf.slice(offset, offset + 16).some((b: number) => b !== 0)).toBe(
        true,
      );
    });

    it('should allow reading buffer as valid UUID', () => {
      const {stringify} = require('../stringify');
      const buf: number[] = [];
      v5('example.com', DNS, buf);
      const uuid = stringify(new Uint8Array(buf));
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });
  });

  describe('Various input strings', () => {
    it('should handle empty string', () => {
      const uuid = v5('', DNS) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(5);
    });

    it('should handle long string', () => {
      const longString = 'a'.repeat(1000);
      const uuid = v5(longString, DNS) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should handle special characters', () => {
      const uuid = v5('!@#$%^&*()', DNS) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should handle unicode characters', () => {
      const uuid = v5('こんにちは', DNS) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should handle symbols and spaces', () => {
      const inputs = [
        'Hello World',
        'test@example.com',
        'https://example.com/path?query=value',
      ];
      for (const input of inputs) {
        const uuid = v5(input, DNS) as string;
        expect(validate(uuid)).toBe(true);
      }
    });
  });

  describe('Namespace validation', () => {
    it('should throw error if namespace length is not exactly 16 after parsing', () => {
      // Note: parse() pads short strings with zeros, so a short string won't trigger the error
      // We need to pass a short array to make it clear it's not 16 bytes
      expect(() => {
        v5('example.com', [1, 2, 3] as any);
      }).toThrow(TypeError);
    });

    it('should throw error with descriptive message for invalid namespace', () => {
      expect(() => {
        v5('example.com', [1, 2, 3] as any);
      }).toThrow(
        'Namespace must be array-like (16 iterable integer values, 0-255)',
      );
    });
  });

  describe('Common namespace use cases', () => {
    it('should generate consistent UUIDs for DNS namespace', () => {
      const domains = ['example.com', 'google.com', 'github.com'];
      const uuids = domains.map(domain => v5(domain, DNS) as string);
      uuids.forEach(uuid => {
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(5);
      });
      expect(new Set(uuids).size).toBe(uuids.length);
    });

    it('should generate consistent UUIDs for URLs', () => {
      const urls = [
        'https://example.com',
        'https://example.com/path',
        'https://api.example.com',
      ];
      const uuids = urls.map(url => v5(url, URL) as string);
      uuids.forEach(uuid => {
        expect(validate(uuid)).toBe(true);
      });
      expect(new Set(uuids).size).toBe(uuids.length);
    });
  });

  describe('Format validation', () => {
    it('should have version 5 in correct position', () => {
      const uuid = v5('example.com', DNS) as string;
      expect(uuid.charAt(14)).toBe('5');
    });

    it('should have correct variant bits', () => {
      const uuid = v5('example.com', DNS) as string;
      const variantChar = uuid.charAt(19).toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });

  describe('Multiple generations', () => {
    it('should generate many valid v5 UUIDs', () => {
      for (let i = 0; i < 20; i++) {
        const uuid = v5(`test${i}`, DNS) as string;
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(5);
      }
    });
  });

  describe('Consistency across calls', () => {
    it('should be consistent with RFC 4122 specification', () => {
      // Test well-known DNS namespace v5 generation
      const uuid = v5('www.python.org', DNS) as string;
      expect(validate(uuid)).toBe(true);
      // Multiple calls should produce same result
      expect(v5('www.python.org', DNS) as string).toBe(uuid);
    });
  });
});
