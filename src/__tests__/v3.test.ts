import {v3} from '../v3';
import {validate} from '../validate';
import {version} from '../version';
import {DNS, URL, OID, X500} from '../utils';

describe('v3', () => {
  describe('Basic generation with namespace', () => {
    it('should generate valid v3 UUID with DNS namespace', () => {
      const uuid = v3('example.com', DNS) as string;
      expect(typeof uuid).toBe('string');
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });

    it('should generate valid v3 UUID with URL namespace', () => {
      const uuid = v3('https://example.com', URL) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });

    it('should generate valid v3 UUID with OID namespace', () => {
      const uuid = v3('1.3.6.1', OID) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });

    it('should generate valid v3 UUID with X500 namespace', () => {
      const uuid = v3('cn=example', X500) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });
  });

  describe('Deterministic generation', () => {
    it('should generate same UUID for same name and namespace', () => {
      const uuid1 = v3('example.com', DNS) as string;
      const uuid2 = v3('example.com', DNS) as string;
      expect(uuid1).toBe(uuid2);
    });

    it('should generate different UUIDs for different names', () => {
      const uuid1 = v3('example.com', DNS) as string;
      const uuid2 = v3('example.org', DNS) as string;
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate different UUIDs for different namespaces', () => {
      const uuid1 = v3('example.com', DNS) as string;
      const uuid2 = v3('example.com', URL) as string;
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate different UUIDs for different name cases', () => {
      const uuid1 = v3('example.com', DNS) as string;
      const uuid2 = v3('EXAMPLE.COM', DNS) as string;
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('With namespace as byte array', () => {
    it('should accept namespace as byte array', () => {
      const {parse} = require('../parse');
      const namespaceBytes = parse(DNS);
      const uuid = v3('example.com', namespaceBytes) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });

    it('should generate same UUID with byte array namespace as string namespace', () => {
      const {parse} = require('../parse');
      const namespaceBytes = parse(DNS);
      const uuid1 = v3('example.com', DNS) as string;
      const uuid2 = v3('example.com', namespaceBytes) as string;
      expect(uuid1).toBe(uuid2);
    });
  });

  describe('With buffer output', () => {
    it('should write v3 UUID to buffer', () => {
      const buf: number[] = [];
      const result = v3('example.com', DNS, buf);
      expect(result).toEqual(buf);
      expect(buf.length).toBe(16);
    });

    it('should write v3 UUID to buffer with offset', () => {
      const buf = new Array(32).fill(0);
      const offset = 8;
      v3('example.com', DNS, buf, offset);
      // Bytes at offset should have data
      expect(buf.slice(offset, offset + 16).some((b: number) => b !== 0)).toBe(
        true,
      );
    });

    it('should allow reading buffer as valid UUID', () => {
      const {stringify} = require('../stringify');
      const buf: number[] = [];
      v3('example.com', DNS, buf);
      const uuid = stringify(new Uint8Array(buf));
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });
  });

  describe('Various input strings', () => {
    it('should handle empty string', () => {
      const uuid = v3('', DNS) as string;
      expect(validate(uuid)).toBe(true);
      expect(version(uuid)).toBe(3);
    });

    it('should handle long string', () => {
      const longString = 'a'.repeat(1000);
      const uuid = v3(longString, DNS) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should handle special characters', () => {
      const uuid = v3('!@#$%^&*()', DNS) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should handle unicode characters', () => {
      const uuid = v3('こんにちは', DNS) as string;
      expect(validate(uuid)).toBe(true);
    });

    it('should handle symbols and spaces', () => {
      const inputs = [
        'Hello World',
        'test@example.com',
        'https://example.com/path?query=value',
      ];
      for (const input of inputs) {
        const uuid = v3(input, DNS) as string;
        expect(validate(uuid)).toBe(true);
      }
    });
  });

  describe('Namespace validation', () => {
    it('should throw error if namespace length is not exactly 16 after parsing', () => {
      // Note: parse() pads short strings with zeros,so a short string won't trigger the error
      // We need to pass a short array that ISOString make it clear it's not 16 bytes
      expect(() => {
        v3('example.com', [1, 2, 3] as any);
      }).toThrow(TypeError);
    });

    it('should throw error with descriptive message for invalid namespace', () => {
      expect(() => {
        v3('example.com', [1, 2, 3] as any);
      }).toThrow(
        'Namespace must be array-like (16 iterable integer values, 0-255)',
      );
    });

    it('should throw for a namespace string that is not a valid UUID', () => {
      expect(() => v3('example.com', 'not-a-uuid')).toThrow('Invalid UUID');
    });
  });

  describe('Common namespace use cases', () => {
    it('should generate consistent UUIDs for DNS namespace', () => {
      const domains = ['example.com', 'google.com', 'github.com'];
      const uuids = domains.map(domain => v3(domain, DNS) as string);
      // All should be valid
      uuids.forEach(uuid => {
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(3);
      });
      // All should be different
      expect(new Set(uuids).size).toBe(uuids.length);
    });

    it('should generate consistent UUIDs for URLs', () => {
      const urls = [
        'https://example.com',
        'https://example.com/path',
        'https://api.example.com',
      ];
      const uuids = urls.map(url => v3(url, URL) as string);
      uuids.forEach(uuid => {
        expect(validate(uuid)).toBe(true);
      });
      expect(new Set(uuids).size).toBe(uuids.length);
    });
  });

  describe('Format validation', () => {
    it('should have version 3 in correct position', () => {
      const uuid = v3('example.com', DNS) as string;
      expect(uuid.charAt(14)).toBe('3');
    });

    it('should have correct variant bits', () => {
      const uuid = v3('example.com', DNS) as string;
      const variantChar = uuid.charAt(19).toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });

  describe('Multiple generations', () => {
    it('should generate many valid v3 UUIDs', () => {
      for (let i = 0; i < 20; i++) {
        const uuid = v3(`test${i}`, DNS) as string;
        expect(validate(uuid)).toBe(true);
        expect(version(uuid)).toBe(3);
      }
    });
  });

  // Reference values from RFC 4122 Appendix B / Python's uuid module (issue #52)
  describe('RFC 4122 test vectors', () => {
    it('should match the RFC example for www.example.com in DNS namespace', () => {
      expect(v3('www.example.com', DNS)).toBe(
        '5df41881-3aed-3515-88a7-2f4a814cf09e',
      );
    });

    it('should match reference output for a namespace with bytes >= 0x80', () => {
      expect(v3('orderId', 'f87ff660-ef24-47a6-b9a8-d64545dd6a4e')).toBe(
        'a74019f0-f6c9-3a5c-9717-c5b25139e2d4',
      );
    });

    it('should match reference output for non-ASCII names', () => {
      expect(v3('https://example.com/héllo/日本', URL)).toBe(
        '86fd4512-767d-32fa-a6f2-f58cc7e16ad4',
      );
    });
  });

  describe('Large input', () => {
    it('should hash names larger than the engine argument limit', () => {
      expect(v3('a'.repeat(300000), DNS)).toBe(
        'a88122d3-53c1-3704-b91f-80d74d3a83ef',
      );
    });
  });
});
