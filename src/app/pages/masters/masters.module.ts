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
import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { RoleComponent } from './role/role.component';
import { VendorGradeComponent } from './vendors/vendor-grade/vendor-grade.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: "users",
    component: UserComponent,
    canActivate:[AuthGuard],
    data: {
      allowed: ["Admin"],
      notAllowed: ["PO","RM","Manager","Vendor"],
    },
  },
  {
    path: "roles",
    component: RoleComponent,
    canActivate:[AuthGuard],
    data: {
      allowed: ["Admin"],
      notAllowed: ["PO","RM","Manager","Vendor"],
    },
  },
  {
    path: "vendors",
    component: VendorsComponent,
    canActivate:[AuthGuard],
    data: {
      allowed: ["Admin"],
      notAllowed: ["PO","RM","Manager","Vendor"],
    },
  },
  {
    path: "reports",
    component: ReportsComponent,
    canActivate:[AuthGuard],
    data: {
      allowed: ["Admin"],
      notAllowed: ["PO","RM","Manager","Vendor"],
    },
  }
]

@NgModule({
  declarations: [
    UserComponent,
    VendorsComponent,
    VendorListComponent,
    RoleComponent,
    VendorGradeComponent,
    ReportsComponent
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
