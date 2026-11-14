import {rng} from '../rng';

describe('rng', () => {
  const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

  const setCrypto = (value: unknown) => {
    Object.defineProperty(globalThis, 'crypto', {
      value,
      configurable: true,
      writable: true,
    });
  };

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalCrypto) {
      Object.defineProperty(globalThis, 'crypto', originalCrypto);
    } else {
      delete (globalThis as any).crypto;
    }
  });

  it('should return 16 bytes', () => {
    const bytes = rng();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(16);
  });

  it('should use crypto.getRandomValues when available', () => {
    const getRandomValues = jest.fn((array: Uint8Array) => {
      array.fill(0xab);
      return array;
    });
    setCrypto({getRandomValues});
    const mathRandom = jest.spyOn(Math, 'random');

    expect(Array.from(rng())).toEqual(new Array(16).fill(0xab));
    expect(getRandomValues).toHaveBeenCalledTimes(1);
    expect(mathRandom).not.toHaveBeenCalled();
  });

  it('should pick up a crypto polyfill installed after import', () => {
    setCrypto(undefined);
    const getRandomValues = jest.fn((array: Uint8Array) => array.fill(1));
    setCrypto({getRandomValues});

    rng();
    expect(getRandomValues).toHaveBeenCalled();
  });

  it('should fall back to Math.random when crypto is unavailable', () => {
    setCrypto(undefined);
    const mathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(Array.from(rng())).toEqual(new Array(16).fill(0x80));
    expect(mathRandom).toHaveBeenCalledTimes(16);
  });

  it('should fall back to Math.random when getRandomValues is missing', () => {
    setCrypto({});
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(Array.from(rng())).toEqual(new Array(16).fill(0));
  });
});
