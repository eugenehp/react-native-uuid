/* eslint-disable no-bitwise */
import {unparse} from './unparse';
import {rng} from './rng';

// https://github.com/DavidAnson/generateRandomUUID/blob/master/generateRandomUUID.js

type V4Options = {
  random: number[];
  rng?: () => number[];
};

// **`v4()` - Generate random UUID**
// See https://github.com/broofa/node-uuid for API details
export const v4 = (
  options?: V4Options | string,
  buf?: Array<number>,
  offset?: number,
) => {
  // Deprecated - 'format' argument, as supported in v1.2
  let i = (buf && offset) || 0;

  // buf = new Array<number>(16);

  let rnds: number[] = rng();

  if (options && !(options instanceof String)) {
    if ((options as V4Options).random) {
      rnds = (options as V4Options).random;
    }
    if ((options as V4Options).rng) {
      rnds = (options as V4Options).rng!();
    }
  }

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
};
