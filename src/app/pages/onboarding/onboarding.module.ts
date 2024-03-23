import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InitiationFormComponent } from './initiation-form/initiation-form.component';
import { MaterialModule } from '../material/material.module';
import { AuthGuard } from '../../Guards/auth.guard';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'initiator-form',
    component:InitiationFormComponent,
    canActivate:[AuthGuard]
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
