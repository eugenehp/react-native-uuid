import REGEX from './regex.js';

/**
 * Check whether `uuid` is a valid RFC 9562 (formerly RFC 4122) UUID string:
 * versions 1-8, the nil UUID, or the max UUID. Case-insensitive.
 */
export const validate = (uuid: unknown): uuid is string => {
  return typeof uuid === 'string' && REGEX.test(uuid);
};
