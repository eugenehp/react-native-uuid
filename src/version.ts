import {validate} from './validate';

export const version = (uuid: string) => {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
};
