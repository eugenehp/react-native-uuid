import {randomBytes} from 'crypto';

describe('nativeRandom', () => {
  const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.dontMock('react-native');
    if (originalCrypto) {
      Object.defineProperty(globalThis, 'crypto', originalCrypto);
    }
  });

  const load = (nativeModules: unknown) => {
    jest.doMock('react-native', () => ({NativeModules: nativeModules}), {
      virtual: true,
    });
    return require('../index.native') as typeof import('../index.native');
  };

  it('should use the native module when it is linked', () => {
    const getRandomBase64 = jest.fn((length: number) =>
      randomBytes(length).toString('base64'),
    );
    const uuid = load({RNUUIDRandom: {getRandomBase64}}).default;
    const mathRandom = jest.spyOn(Math, 'random');

    expect(uuid.randomSource()).toBe('native');
    const ids = Array.from({length: 40}, () => uuid.v4());
    expect(new Set(ids).size).toBe(40);
    expect(ids.every(id => uuid.validate(id))).toBe(true);
    // 40 UUIDs x 16 bytes = 640 bytes, fetched in 256-byte batches
    expect(getRandomBase64).toHaveBeenCalledTimes(3);
    expect(mathRandom).not.toHaveBeenCalled();
    mathRandom.mockRestore();
  });

  it('should fall back to Math.random when the module is missing', () => {
    const uuid = load({}).default;
    expect(uuid.randomSource()).toBe('Math.random');
    expect(uuid.validate(uuid.v4())).toBe(true);
  });

  it('should fall back when the native call throws', () => {
    const uuid = load({
      RNUUIDRandom: {
        getRandomBase64: () => {
          throw new Error('sync calls unavailable');
        },
      },
    }).default;
    const mathRandom = jest.spyOn(Math, 'random');
    expect(uuid.validate(uuid.v4())).toBe(true);
    expect(mathRandom).toHaveBeenCalled();
    mathRandom.mockRestore();
  });

  it('should decode base64', () => {
    load({});
    const {base64ToBytes} =
      require('../nativeRandom') as typeof import('../nativeRandom');
    for (const length of [0, 1, 2, 3, 16, 255, 256]) {
      const bytes = randomBytes(length);
      expect(Buffer.from(base64ToBytes(bytes.toString('base64')))).toEqual(
        bytes,
      );
    }
    expect(() => base64ToBytes('!!!!')).toThrow(TypeError);
  });
});
