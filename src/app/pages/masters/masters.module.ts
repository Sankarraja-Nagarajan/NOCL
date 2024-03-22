import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule } from '@nebular/theme';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VendorsComponent } from './vendors/vendors.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthGuard } from '../../Guards/auth.guard';
import { MaterialModule } from '../material/material.module';

const routes: Routes = [
  {
    path: "users",
    component: UserComponent,
    canActivate:[AuthGuard]
  },
  {
    path: "vendors",
    component: VendorsComponent,
    canActivate:[AuthGuard]
  }
]

@NgModule({
  declarations: [
    UserComponent,
    VendorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MaterialModule
  ]
})
export class MastersModule { }
