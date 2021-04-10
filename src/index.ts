export type {GenerateUUID} from './v35';

import {parse} from './parse';
import {unparse} from './unparse';
import {validate} from './validate';
import {version} from './version';

import {v1} from './v1';
import {v3} from './v3';
import {v4} from './v4';
import {v5} from './v5';

import {NIL, DNS, URL, OID, X500} from './utils';

export default {
  parse,
  unparse,
  validate,
  version,
  v1,
  v3,
  v4,
  v5,
  NIL,
  DNS,
  URL,
  OID,
  X500,
};
