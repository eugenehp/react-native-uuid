import uuid from '../index';
import {v1} from '../v1';
import {v3} from '../v3';
import {v4} from '../v4';
import {v5} from '../v5';
import {parse} from '../parse';
import {unparse} from '../unparse';
import {validate} from '../validate';
import {version} from '../version';
import {DNS, URL, NIL} from '../utils';

describe('Integration Tests', () => {
  describe('Default export', () => {
    it('should export all functions as default', () => {
      expect(uuid.v1).toBeDefined();
      expect(uuid.v3).toBeDefined();
      expect(uuid.v4).toBeDefined();
      expect(uuid.v5).toBeDefined();
      expect(uuid.parse).toBeDefined();
      expect(uuid.unparse).toBeDefined();
      expect(uuid.validate).toBeDefined();
      expect(uuid.version).toBeDefined();
    });

    it('should export namespace constants', () => {
      expect(uuid.DNS).toBe(DNS);
      expect(uuid.URL).toBe(URL);
      expect(uuid.NIL).toBe(NIL);
      expect(uuid.OID).toBeDefined();
      expect(uuid.X500).toBeDefined();
    });

    it('should use exported functions correctly', () => {
      const uuidStr = uuid.v4() as string;
      expect(uuid.validate(uuidStr)).toBe(true);
      expect(uuid.version(uuidStr)).toBe(4);
    });
  });

  describe('UUID generation and validation workflow', () => {
    it('should generate and validate v1 UUID', () => {
      const uuidStr = uuid.v1() as string;
      expect(uuid.validate(uuidStr)).toBe(true);
      expect(uuid.version(uuidStr)).toBe(1);
    });

    it('should generate and validate v4 UUID', () => {
      const uuidStr = uuid.v4() as string;
      expect(uuid.validate(uuidStr)).toBe(true);
      expect(uuid.version(uuidStr)).toBe(4);
    });

    it('should generate and validate v3 UUID', () => {
      const uuidStr = uuid.v3('example.com', uuid.DNS) as string;
      expect(uuid.validate(uuidStr)).toBe(true);
      expect(uuid.version(uuidStr)).toBe(3);
    });

    it('should generate and validate v5 UUID', () => {
      const uuidStr = uuid.v5('example.com', uuid.DNS) as string;
      expect(uuid.validate(uuidStr)).toBe(true);
      expect(uuid.version(uuidStr)).toBe(5);
    });
  });

  describe('Parse and stringify round-trip', () => {
    it('should parse and stringify v4 UUID', () => {
      const original = uuid.v4() as string;
      const parsed = uuid.parse(original);
      const stringified = uuid.unparse(parsed as any) as string;
      expect(stringified.toLowerCase()).toBe(original.toLowerCase());
    });

    it('should parse and stringify v1 UUID', () => {
      const original = uuid.v1() as string;
      const parsed = uuid.parse(original);
      const stringified = uuid.unparse(parsed as any) as string;
      expect(stringified.toLowerCase()).toBe(original.toLowerCase());
    });

    it('should handle NIL UUID round-trip', () => {
      const parsed = uuid.parse(uuid.NIL);
      const stringified = uuid.unparse(parsed);
      expect(stringified).toBe(uuid.NIL);
    });

    it('should maintain data through multiple round-trips', () => {
      let current = uuid.v4();
      for (let i = 0; i < 5; i++) {
        const parsed = uuid.parse(current);
        current = uuid.unparse(parsed);
        expect(uuid.validate(current)).toBe(true);
      }
    });
  });

  describe('UUID comparison and uniqueness', () => {
    it('should generate unique v4 UUIDs', () => {
      const uuids = new Set(
        Array.from({length: 100}, () => uuid.v4()),
      );
      expect(uuids.size).toBe(100);
    });

    it('should generate consistent v3 UUIDs for same input', () => {
      const uuid1 = uuid.v3('example.com', uuid.DNS) as string;
      const uuid2 = uuid.v3('example.com', uuid.DNS) as string;
      expect(uuid1).toBe(uuid2);
    });

    it('should generate consistent v5 UUIDs for same input', () => {
      const uuid1 = uuid.v5('example.com', uuid.DNS) as string;
      const uuid2 = uuid.v5('example.com', uuid.DNS) as string;
      expect(uuid1).toBe(uuid2);
    });

    it('should generate different UUIDs for different inputs', () => {
      const uuid1 = uuid.v3('example.com', uuid.DNS) as string;
      const uuid2 = uuid.v3('example.org', uuid.DNS) as string;
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('Mixed version operations', () => {
    it('should handle different UUID versions', () => {
      const v1_uuid = uuid.v1() as string;
      const v3_uuid = uuid.v3('test', uuid.DNS) as string;
      const v4_uuid = uuid.v4() as string;
      const v5_uuid = uuid.v5('test', uuid.DNS) as string;

      expect(uuid.version(v1_uuid)).toBe(1);
      expect(uuid.version(v3_uuid)).toBe(3);
      expect(uuid.version(v4_uuid)).toBe(4);
      expect(uuid.version(v5_uuid)).toBe(5);
    });

    it('should validate all version types', () => {
      const uuids = [
        uuid.v1() as string,
        uuid.v3('test', uuid.DNS) as string,
        uuid.v4() as string,
        uuid.v5('test', uuid.DNS) as string,
      ];

      uuids.forEach(u => {
        expect(uuid.validate(u)).toBe(true);
      });
    });
  });

  describe('Buffer operations', () => {
    it('should write v1 to buffer and read back', () => {
      const buf = new Uint8Array(16);
      uuid.v1({} as any, buf);
      const result = uuid.unparse(Array.from(buf));
      expect(uuid.validate(result)).toBe(true);
      expect(uuid.version(result)).toBe(1);
    });

    it('should write v4 to buffer and read back', () => {
      const buf = new Array<number>();
      uuid.v4(undefined, buf);
      const result = uuid.unparse(buf);
      expect(uuid.validate(result)).toBe(true);
      expect(uuid.version(result)).toBe(4);
    });

    it('should write v3 to buffer and read back', () => {
      const buf: number[] = [];
      uuid.v3('test', uuid.DNS, buf);
      const result = uuid.unparse(buf);
      expect(uuid.validate(result)).toBe(true);
      expect(uuid.version(result)).toBe(3);
    });

    it('should write v5 to buffer and read back', () => {
      const buf: number[] = [];
      uuid.v5('test', uuid.DNS, buf);
      const result = uuid.unparse(buf);
      expect(uuid.validate(result)).toBe(true);
      expect(uuid.version(result)).toBe(5);
    });
  });

  describe('Invalid UUID handling', () => {
    it('should reject invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        'zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
        '550e8400-e29b-61d4-a716-446655440000', // wrong version
      ];

      invalidUUIDs.forEach(u => {
        expect(uuid.validate(u)).toBe(false);
      });
    });

    it('should throw on version of invalid UUID', () => {
      expect(() => uuid.version('invalid')).toThrow(TypeError);
    });

    it('should handle null/undefined gracefully', () => {
      expect(uuid.validate(null as any)).toBe(false);
      expect(uuid.validate(undefined as any)).toBe(false);
    });
  });

  describe('Namespace operations', () => {
    it('should use all namespace constants', () => {
      const namespaces = [
        {ns: uuid.DNS, name: 'DNS'},
        {ns: uuid.URL, name: 'URL'},
        {ns: uuid.OID, name: 'OID'},
        {ns: uuid.X500, name: 'X500'},
      ];

      for (const {ns, name} of namespaces) {
        const v3_uuid = uuid.v3(`test-${name}`, ns) as string;
        const v5_uuid = uuid.v5(`test-${name}`, ns) as string;

        expect(uuid.validate(v3_uuid)).toBe(true);
        expect(uuid.validate(v5_uuid)).toBe(true);
        expect(uuid.version(v3_uuid)).toBe(3);
        expect(uuid.version(v5_uuid)).toBe(5);
      }
    });

    it('should handle namespace as byte array', () => {
      const nsBytes = uuid.parse(uuid.DNS);
      const v3_uuid = uuid.v3('test', nsBytes) as string;
      const v5_uuid = uuid.v5('test', nsBytes) as string;

      expect(uuid.validate(v3_uuid)).toBe(true);
      expect(uuid.validate(v5_uuid)).toBe(true);
    });
  });

  describe('Use case scenarios', () => {
    it('should generate consistent IDs for database records', () => {
      const userId = 'user123';
      const recordId = uuid.v5(userId, uuid.DNS) as string;
      const recordId2 = uuid.v5(userId, uuid.DNS) as string;

      expect(recordId).toBe(recordId2);
      expect(uuid.validate(recordId)).toBe(true);
    });

    it('should generate unique session IDs', () => {
      const sessionIds = new Set(
        Array.from({length: 50}, () => uuid.v4()),
      );
      expect(sessionIds.size).toBe(50);
    });

    it('should track UUID through operations', () => {
      const original = uuid.v4();

      // Parse it
      const parsed = uuid.parse(original);
      expect(parsed).toHaveLength(16);

      // Convert back
      const stringified = uuid.unparse(parsed);
      expect(stringified.toLowerCase()).toBe(original.toLowerCase());

      // Validate at each step
      expect(uuid.validate(original)).toBe(true);
      expect(uuid.validate(stringified)).toBe(true);

      // Check version
      expect(uuid.version(original)).toBe(4);
      expect(uuid.version(stringified)).toBe(4);
    });
  });

  describe('Performance considerations', () => {
    it('should generate many v4 UUIDs quickly', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        uuid.v4();
      }
      const elapsed = Date.now() - start;
      // Should be fast (less than 5 seconds for 1000 UUIDs)
      expect(elapsed).toBeLessThan(5000);
    });

    it('should validate many UUIDs quickly', () => {
      const uuids = Array.from({length: 100}, () => uuid.v4());
      const start = Date.now();
      uuids.forEach(u => uuid.validate(u));
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000);
    });

    it('should parse/stringify quickly', () => {
      const testUuid = uuid.v4() as string;
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        const parsed = uuid.parse(testUuid);
        uuid.unparse(Array.from(parsed as any));
      }
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });
  });
});
