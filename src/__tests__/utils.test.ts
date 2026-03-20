import {
  DNS,
  URL,
  OID,
  X500,
  NIL,
  byteToHex,
  hexToByte,
  stringToBytes,
  bytesToString,
} from '../utils';
import {validate} from '../validate';

describe('utils', () => {
  describe('Namespace UUIDs', () => {
    it('should define DNS namespace', () => {
      expect(DNS).toBe('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
      expect(validate(DNS)).toBe(true);
    });

    it('should define URL namespace', () => {
      expect(URL).toBe('6ba7b811-9dad-11d1-80b4-00c04fd430c8');
      expect(validate(URL)).toBe(true);
    });

    it('should define OID namespace', () => {
      expect(OID).toBe('6ba7b812-9dad-11d1-80b4-00c04fd430c8');
      expect(validate(OID)).toBe(true);
    });

    it('should define X500 namespace', () => {
      expect(X500).toBe('6ba7b814-9dad-11d1-80b4-00c04fd430c8');
      expect(validate(X500)).toBe(true);
    });

    it('should define NIL UUID', () => {
      expect(NIL).toBe('00000000-0000-0000-0000-000000000000');
      expect(validate(NIL)).toBe(true);
    });

    it('should have all namespaces as valid UUIDs', () => {
      const namespaces = [DNS, URL, OID, X500, NIL];
      namespaces.forEach(ns => {
        expect(typeof ns).toBe('string');
        expect(validate(ns)).toBe(true);
      });
    });
  });

  describe('byteToHex mapping', () => {
    it('should have 256 entries', () => {
      expect(byteToHex.length).toBe(256);
    });

    it('should map 0x00 to "00"', () => {
      expect(byteToHex[0x00]).toBe('00');
    });

    it('should map 0x0f to "0f"', () => {
      expect(byteToHex[0x0f]).toBe('0f');
    });

    it('should map 0x10 to "10"', () => {
      expect(byteToHex[0x10]).toBe('10');
    });

    it('should map 0xff to "ff"', () => {
      expect(byteToHex[0xff]).toBe('ff');
    });

    it('should produce lowercase hex strings', () => {
      for (let i = 0; i < 256; i++) {
        const hex = byteToHex[i];
        expect(hex).toMatch(/^[0-9a-f]{2}$/);
      }
    });

    it('should produce 2-character strings for all values', () => {
      for (let i = 0; i < 256; i++) {
        expect(byteToHex[i]).toHaveLength(2);
      }
    });
  });

  describe('hexToByte mapping', () => {
    it('should map "00" to 0x00', () => {
      expect(hexToByte['00']).toBe(0x00);
    });

    it('should map "0f" to 0x0f', () => {
      expect(hexToByte['0f']).toBe(0x0f);
    });

    it('should map "10" to 0x10', () => {
      expect(hexToByte['10']).toBe(0x10);
    });

    it('should map "ff" to 0xff', () => {
      expect(hexToByte['ff']).toBe(0xff);
    });

    it('should have 256 entries', () => {
      expect(Object.keys(hexToByte).length).toBe(256);
    });

    it('should be inverse of byteToHex', () => {
      for (let i = 0; i < 256; i++) {
        const hex = byteToHex[i];
        expect(hexToByte[hex]).toBe(i);
      }
    });

    it('should handle lowercase hex strings', () => {
      for (let i = 0; i < 256; i++) {
        const hex = byteToHex[i];
        expect(hexToByte[hex]).toBe(i);
      }
    });
  });

  describe('stringToBytes', () => {
    it('should convert ASCII string to bytes', () => {
      const result = stringToBytes('hello');
      expect(result).toEqual(
        new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]),
      );
    });

    it('should convert empty string to empty byte array', () => {
      const result = stringToBytes('');
      expect(result.length).toBe(0);
    });

    it('should handle single character', () => {
      const result = stringToBytes('A');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(0x41);
    });

    it('should handle numbers as string', () => {
      const result = stringToBytes('123');
      expect(result.length).toBe(3);
      expect(result[0]).toBe(0x31);
      expect(result[1]).toBe(0x32);
      expect(result[2]).toBe(0x33);
    });

    it('should handle special characters', () => {
      const result = stringToBytes('!@#');
      expect(result.length).toBe(3);
      expect(result[0]).toBe(0x21);
      expect(result[1]).toBe(0x40);
      expect(result[2]).toBe(0x23);
    });

    it('should handle unicode characters with UTF8 encoding', () => {
      // "é" is UTF-8 encoded as 0xc3 0xa9
      const result = stringToBytes('é');
      // After UTF-8 encoding
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return Uint8Array', () => {
      const result = stringToBytes('test');
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe('bytesToString', () => {
    it('should convert bytes to ASCII string', () => {
      const bytes = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
      const result = bytesToString(bytes.buffer);
      expect(result).toBe('hello');
    });

    it('should handle empty bytes', () => {
      const bytes = new Uint8Array(0);
      const result = bytesToString(bytes.buffer);
      expect(result).toBe('');
    });

    it('should convert bytes to characters', () => {
      const bytes = new Uint8Array([0x41, 0x42, 0x43]);
      const result = bytesToString(bytes.buffer);
      expect(result).toBe('ABC');
    });

    it('should handle special character bytes', () => {
      const bytes = new Uint8Array([0x21, 0x40, 0x23]);
      const result = bytesToString(bytes.buffer);
      expect(result).toBe('!@#');
    });

    it('should work with array buffer', () => {
      const bytes = new Uint8Array([0x74, 0x65, 0x73, 0x74]);
      const buffer = bytes.buffer;
      const result = bytesToString(buffer);
      expect(result).toBe('test');
    });
  });

  describe('Round-trip conversions', () => {
    it('should convert string to bytes and back', () => {
      const original = 'Hello World';
      const bytes = stringToBytes(original);
      const result = bytesToString(bytes.buffer);
      expect(result).toBe(original);
    });

    it('should handle various strings', () => {
      const strings = ['', 'a', 'test', '12345', 'UUID'];
      for (const str of strings) {
        const bytes = stringToBytes(str);
        const result = bytesToString(bytes.buffer);
        expect(result).toBe(str);
      }
    });

    it('should convert byte to hex and back', () => {
      for (let i = 0; i < 256; i++) {
        const hex = byteToHex[i];
        const byte = hexToByte[hex];
        expect(byte).toBe(i);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle max byte value', () => {
      expect(byteToHex[255]).toBe('ff');
      expect(hexToByte['ff']).toBe(255);
    });

    it('should handle min byte value', () => {
      expect(byteToHex[0]).toBe('00');
      expect(hexToByte['00']).toBe(0);
    });

    it('should handle whitespace characters', () => {
      const result = stringToBytes('  ');
      // Two spaces
      expect(result.length).toBe(2);
      expect(result[0]).toBe(0x20);
    });

    it('should handle newline character', () => {
      const result = stringToBytes('\n');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(0x0a);
    });
  });
});
