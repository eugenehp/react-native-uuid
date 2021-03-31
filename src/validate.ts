import REGEX from './regex';

export const validate = (uuid: string) => {
  return typeof uuid === 'string' && REGEX.test(uuid);
};
