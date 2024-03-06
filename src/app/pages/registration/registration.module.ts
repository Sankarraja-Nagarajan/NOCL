import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { AddressComponent } from './address/address.component';
import { RegistrationFormLayoutComponent } from './registration-form-layout/registration-form-layout.component';
import { DomesticVendorPersonalInfoComponent } from './domestic-vendor-personal-info/domestic-vendor-personal-info.component';
import { ContactsComponent } from './contacts/contacts.component';
import { VendorBranchesComponent } from './vendor-branches/vendor-branches.component';

const routes: Routes=[
  {
    path:'address',
    component:AddressComponent
  },
  {
    path:'registration',
    component:RegistrationFormLayoutComponent
  },
  {
    path:'',
    redirectTo:'registration',
    pathMatch:'full'
  }
];

@NgModule({
  declarations: [
    AddressComponent,
    RegistrationFormLayoutComponent,
    DomesticVendorPersonalInfoComponent,
    ContactsComponent,
    VendorBranchesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class RegistrationModule { }
