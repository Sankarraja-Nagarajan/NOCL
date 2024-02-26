import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule, Routes } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule } from '@nebular/theme';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

const routes: Routes = [
  {
    path: "",
    redirectTo: "user",
    pathMatch: "full"
  },
  {
    path: "user",
    component: UserComponent
  },
]

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MastersModule { }
