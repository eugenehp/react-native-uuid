import {unsafeStringify} from './stringify.js';
import {v1Bytes, V1Options} from './v1.js';
import {v1ToV6Bytes} from './v1ToV6.js';
import {UUIDBuffer, writeBytes} from './utils.js';

/** Options for {@link v6}. Same as {@link V1Options}. */
export type V6Options = V1Options;

/**
 * Generate a reordered time-based (version 6) UUID per RFC 9562.
 *
 * Like {@link v1}, but the timestamp is stored most-significant first, so v6
 * UUIDs sort by creation time. Node ID and clock sequence are random for
 * every UUID unless given in `options`.
 *
 * @param buf - If given, the 16 UUID bytes are written here and `buf` is returned.
 * @param offset - Index in `buf` to start writing at.
 */
export function v6(
  options?: V6Options,
  buf?: undefined,
  offset?: number,
): string;
export function v6<T extends UUIDBuffer>(
  options: V6Options | undefined,
  buf: T,
  offset?: number,
): T;
export function v6<T extends UUIDBuffer>(
  options?: V6Options,
  buf?: T,
  offset?: number,
): string | T {
  const bytes = v1ToV6Bytes(v1Bytes(options || {}, new Uint8Array(16), true));
  return buf ? writeBytes(bytes, buf, offset) : unsafeStringify(bytes);
}
