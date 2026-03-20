/* eslint-disable no-bitwise */
// const randombytes = require('randombytes');
// export const rng = () => randombytes(16);

const min = 0;
const max = 256;
const RANDOM_LENGTH = 16;

// returns pseudo random 16 bytes as Uint8Array
// Using Uint8Array ensures compatibility with crypto.getRandomValues() API
// and provides better performance than regular Arrays
export const rng = () => {
  let result = new Uint8Array(RANDOM_LENGTH);

  for (let j = 0; j < RANDOM_LENGTH; j++) {
    result[j] = 0xff & (Math.random() * (max - min) + min);
  }

  return result as unknown as number[];
};
