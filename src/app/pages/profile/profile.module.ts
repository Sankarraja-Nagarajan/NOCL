import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileLayoutComponent } from "./profile-layout/profile-layout.component";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../Guards/auth.guard";
import { MaterialModule } from "../material/material.module";
import { AddressProfileComponent } from './address-profile/address-profile.component';
import { ContactProfileComponent } from './contact-profile/contact-profile.component';

const routes: Routes = [
  {
    path: "",
    component: ProfileLayoutComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [ProfileLayoutComponent, AddressProfileComponent, ContactProfileComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
})
export class ProfileModule {}
