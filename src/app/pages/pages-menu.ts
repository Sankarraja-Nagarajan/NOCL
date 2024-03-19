import { NbMenuItem } from '@nebular/theme';
import { title } from 'process';
import { AuthResponse } from '../Models/authModel';

export class Sample{

  role:string = '';
  userData : any;

   getMenuItems(): NbMenuItem[] {


    const userData = sessionStorage.getItem('userDetails');
    if (userData == undefined || userData == null) {
      this.userData = null;
    } else {
      this.userData = JSON.parse(userData);
      this.role = this.userData.Role;
    }
  
  
    const MENU_ITEMS: NbMenuItem[] = [
      {
        title: 'dashboard',
        link: 'onboarding/dashboard',
        hidden: this.role == 'Admin',
      },
      {
        title: 'initiation form',
        link: 'onboarding/initiator-form',
        hidden: this.role == 'Admin',
  
      },
      {
        title: 'Registration',
        icon: 'grid-outline',
        link: 'registration'
      },
      {
        title: 'Master',
        icon: 'grid-outline',
        hidden: this.role != 'Admin',
        children: [
          {
            title: 'Users',
            link: 'masters/users'
          },
          {
            title: 'Vendors',
            link: 'masters/vendors',
  
          }
        ]
      }
    ];
    return MENU_ITEMS;
  }
}