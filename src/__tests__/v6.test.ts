import {v1} from '../v1';
import {v6} from '../v6';
import {v1ToV6} from '../v1ToV6';
import {v6ToV1} from '../v6ToV1';
import {parse} from '../parse';
import {validate} from '../validate';
import {version} from '../version';

// Reference values from the uuid npm package
const options = {
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date('2011-11-01').getTime(),
  nsecs: 5678,
};
const V1 = '710b962e-041c-11e1-9234-0123456789ab';
const V6 = '1e1041c7-10b9-662e-9234-0123456789ab';

describe('v6', () => {
  it('should generate a valid v6 UUID', () => {
    const uuid = v6();
    expect(validate(uuid)).toBe(true);
    expect(version(uuid)).toBe(6);
  });

  it('should produce the reference UUID for fixed options', () => {
    expect(v6(options)).toBe(V6);
  });

  it('should sort by creation time', () => {
    const uuids = Array.from({length: 1000}, () => v6());
    expect([...uuids].sort()).toEqual(uuids);
  });

  it('should use a random node for each UUID by default', () => {
    expect(v6().slice(-12)).not.toBe(v6().slice(-12));
  });

  it('should write to a buffer at an offset', () => {
    const buf = new Uint8Array(20);
    expect(v6(options, buf, 2)).toBe(buf);
    expect(Array.from(buf.slice(2, 18))).toEqual(parse(V6));
  });
});

describe('v1ToV6 / v6ToV1', () => {
  it('should convert strings', () => {
    expect(v1ToV6(V1)).toBe(V6);
    expect(v6ToV1(V6)).toBe(V1);
  });

  it('should convert bytes', () => {
    expect(Array.from(v1ToV6(parse(V1)))).toEqual(parse(V6));
    expect(Array.from(v6ToV1(parse(V6)))).toEqual(parse(V1));
  });

  it('should round-trip generated UUIDs', () => {
    for (let i = 0; i < 100; i++) {
      const uuid = v1();
      expect(v6ToV1(v1ToV6(uuid))).toBe(uuid);
    }
  });

  it('should throw for invalid UUID strings', () => {
    expect(() => v1ToV6('nope')).toThrow(TypeError);
    expect(() => v6ToV1('nope')).toThrow(TypeError);
  });
});
