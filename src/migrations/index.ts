import * as migration_20260915_165806_init from './20260915_165806_init';
import * as migration_20260922_094703_Update_Signup_System from './20260922_094703_Update_Signup_System';
import * as migration_20260922_194504_Add_Sponsor_Background from './20260922_194504_Add_Sponsor_Background';
import * as migration_20260923_111620_Add_volunteer_position from './20260923_111620_Add_volunteer_position';
import * as migration_20260924_090709_Add_infoCard from './20260924_090709_Add_infoCard';

export const migrations = [
  {
    up: migration_20260915_165806_init.up,
    down: migration_20260915_165806_init.down,
    name: '20260915_165806_init',
  },
  {
    up: migration_20260922_094703_Update_Signup_System.up,
    down: migration_20260922_094703_Update_Signup_System.down,
    name: '20260922_094703_Update_Signup_System',
  },
  {
    up: migration_20260922_194504_Add_Sponsor_Background.up,
    down: migration_20260922_194504_Add_Sponsor_Background.down,
    name: '20260922_194504_Add_Sponsor_Background',
  },
  {
    up: migration_20260923_111620_Add_volunteer_position.up,
    down: migration_20260923_111620_Add_volunteer_position.down,
    name: '20260923_111620_Add_volunteer_position',
  },
  {
    up: migration_20260924_090709_Add_infoCard.up,
    down: migration_20260924_090709_Add_infoCard.down,
    name: '20260924_090709_Add_infoCard'
  },
];
