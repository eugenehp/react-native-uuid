import {v35} from './v35.js';
import {sha1} from './sha1.js';

/**
 * Generate a name-based (version 5, SHA-1) UUID per RFC 9562.
 *
 * Output matches the `uuid` npm package and Python's `uuid.uuid5`, e.g.
 * `v5('www.example.com', DNS)` is `'2ed6657d-e927-568b-95e1-2665a8aea6a2'`.
 *
 * Throws `TypeError('Invalid UUID')` if `namespace` is a string that is not a
 * valid UUID.
 */
export const v5 = v35(0x50, sha1);
