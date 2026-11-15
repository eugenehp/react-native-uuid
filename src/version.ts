import {validate} from './validate.js';

/**
 * Return the version number of a UUID string: 1-8, `0` for the nil UUID, or
 * `15` for the max UUID.
 *
 * @throws TypeError if `uuid` is not valid.
 */
export const version = (uuid: string): number => {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.slice(14, 15), 16);
};
