import {v35} from './v35.js';
import {md5} from './md5.js';

/**
 * Generate a name-based (version 3, MD5) UUID per RFC 9562.
 *
 * Output matches the `uuid` npm package and Python's `uuid.uuid3`, e.g.
 * `v3('www.example.com', DNS)` is `'5df41881-3aed-3515-88a7-2f4a814cf09e'`.
 *
 * Prefer {@link v5} for new code. Throws `TypeError('Invalid UUID')` if
 * `namespace` is a string that is not a valid UUID.
 */
export const v3 = v35(0x30, md5);
