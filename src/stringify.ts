import {byteToHex} from './utils.js';
import {validate} from './validate.js';

/**
 * Convert 16 bytes to a UUID string without validating it.
 * @internal
 */
export const unsafeStringify = (
  arr: ArrayLike<number>,
  offset: number = 0,
): string =>
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();

/**
 * Convert 16 UUID bytes into a UUID string.
 *
 * @param offset - Index in `arr` to start reading from.
 * @throws TypeError if the bytes don't form a valid UUID (e.g. values outside
 * 0-255, or invalid version/variant bits).
 */
export const stringify = (
  arr: ArrayLike<number>,
  offset: number = 0,
): string => {
  const uuid = unsafeStringify(arr, offset);

  // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields
  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
};
