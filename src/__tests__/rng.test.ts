import {randomSource, rng, setNativeRandomSource} from '../rng';

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

  it('should fetch random bytes in 256-byte batches', () => {
    const getRandomValues = jest.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = i;
      }
      return array;
    });
    setCrypto({getRandomValues});

    const results = Array.from({length: 17}, () => Array.from(rng()));
    // 16 results per batch of 256 bytes
    expect(getRandomValues).toHaveBeenCalledTimes(2);
    expect(results[0]).toEqual(Array.from({length: 16}, (_, i) => i));
    expect(results[1][0]).toBe(16);
    expect(new Set(results.slice(0, 16).map(r => r.join())).size).toBe(16);
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

  describe('native random source', () => {
    afterEach(() => setNativeRandomSource(undefined));

    it('should be used when crypto is unavailable', () => {
      setCrypto(undefined);
      const source = jest.fn((length: number) =>
        new Uint8Array(length).fill(7),
      );
      setNativeRandomSource(source);
      const mathRandom = jest.spyOn(Math, 'random');

      expect(Array.from(rng())).toEqual(new Array(16).fill(7));
      expect(source).toHaveBeenCalledWith(16);
      expect(mathRandom).not.toHaveBeenCalled();
      expect(randomSource()).toBe('native');
    });

    it('should not be used when crypto is available', () => {
      setCrypto({getRandomValues: (a: Uint8Array) => a.fill(1)});
      const source = jest.fn();
      setNativeRandomSource(source);

      expect(Array.from(rng())).toEqual(new Array(16).fill(1));
      expect(source).not.toHaveBeenCalled();
      expect(randomSource()).toBe('crypto');
    });

    it('should fall back to Math.random if it returns too few bytes', () => {
      setCrypto(undefined);
      setNativeRandomSource(() => undefined);
      jest.spyOn(Math, 'random').mockReturnValue(0);

      expect(Array.from(rng())).toEqual(new Array(16).fill(0));
    });
  });

  it('should report Math.random when nothing else is available', () => {
    setCrypto(undefined);
    expect(randomSource()).toBe('Math.random');
  });
});
