export type {GenerateUUID} from './v35.js';
export type {V1Options} from './v1.js';
export type {V4Options} from './v4.js';
export type {V6Options} from './v6.js';
export type {V7Options} from './v7.js';
export type {UUIDBuffer} from './utils.js';

import {parse} from './parse.js';
import {stringify} from './stringify.js';
import {unparse} from './unparse.js';
import {validate} from './validate.js';
import {version} from './version.js';
import {rng, randomSource} from './rng.js';

import {v1} from './v1.js';
import {v3} from './v3.js';
import {v4} from './v4.js';
import {v5} from './v5.js';
import {v6} from './v6.js';
import {v7} from './v7.js';
import {v1ToV6} from './v1ToV6.js';
import {v6ToV1} from './v6ToV1.js';

import {NIL, MAX, DNS, URL, OID, X500} from './utils.js';

export {
  parse,
  stringify,
  unparse,
  validate,
  version,
  rng,
  randomSource,
  v1,
  v3,
  v4,
  v5,
  v6,
  v7,
  v1ToV6,
  v6ToV1,
  NIL,
  MAX,
  DNS,
  URL,
  OID,
  X500,
};

export const uuid = {
  parse,
  stringify,
  unparse,
  validate,
  version,
  rng,
  randomSource,
  v1,
  v3,
  v4,
  v5,
  v6,
  v7,
  v1ToV6,
  v6ToV1,
  NIL,
  MAX,
  DNS,
  URL,
  OID,
  X500,
};

export default uuid;
