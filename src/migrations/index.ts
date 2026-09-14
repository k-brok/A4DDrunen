import * as migration_20260914_193712_init from './20260914_193712_init';

export const migrations = [
  {
    up: migration_20260914_193712_init.up,
    down: migration_20260914_193712_init.down,
    name: '20260914_193712_init'
  },
];
