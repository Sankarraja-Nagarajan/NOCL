import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { AddressComponent } from './address/address.component';
import { RegistrationFormLayoutComponent } from './registration-form-layout/registration-form-layout.component';

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
    RegistrationFormLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class RegistrationModule { }
