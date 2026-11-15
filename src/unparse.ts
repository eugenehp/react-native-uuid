import {unsafeStringify} from './stringify.js';

/**
 * Convert 16 UUID bytes (as returned by {@link parse}) into a UUID string.
 *
 * Unlike {@link stringify}, the result is not validated, so any 16 bytes are
 * accepted.
 *
 * @param offset - Index in `buf` to start reading from.
 */
export const unparse = (buf: ArrayLike<number>, offset?: number): string =>
  unsafeStringify(buf, offset || 0);
