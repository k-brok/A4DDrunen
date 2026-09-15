import * as migration_20260915_165806_init from './20260915_165806_init';

export const migrations = [
  {
    up: migration_20260915_165806_init.up,
    down: migration_20260915_165806_init.down,
    name: '20260915_165806_init'
  },
];
