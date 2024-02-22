import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InitiationFormComponent } from './initiation-form/initiation-form.component';
import { MaterialModule } from '../material/material.module';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path:'initiation-form',
    component:InitiationFormComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    InitiationFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class OnboardingModule { }
