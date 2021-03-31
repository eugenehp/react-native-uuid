import {hexToByte} from './utils';

// **`parse()` - Parse a UUID into it's component bytes**
export const parse = (s: string, buf?: Array<number>, offset?: number) => {
  let i = (buf && offset) || 0;
  let ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, (oct: string) => {
    // Don't overflow!
    if (ii < 16 && buf) {
      buf[i + ii++] = hexToByte[oct];
    }

    return '';
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
};
