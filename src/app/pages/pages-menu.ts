import { NbMenuItem } from '@nebular/theme';
import { title } from 'process';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Onboarding',
    icon:'grid-outline',
    children: [
      {
        title: 'dashboard',
        link: 'onboarding/dashboard',
      },
      {
        title: 'initiation form',
        link: 'onboarding/initiator-form',
      }
    ]
  },
  {
    title: 'Registration',
    icon:'grid-outline',
    link: 'registration'
  },
  {
    title: 'Master',
    icon:'grid-outline',
    children: [
      {
        title: 'User',
        link: 'masters/user'
      }
    ]
  }
];
