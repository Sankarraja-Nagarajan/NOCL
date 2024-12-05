import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileLayoutComponent } from "./profile-layout/profile-layout.component";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../Guards/auth.guard";
import { MaterialModule } from "../material/material.module";
import { AddressProfileComponent } from './address-profile/address-profile.component';
import { ContactProfileComponent } from './contact-profile/contact-profile.component';
import { TechnicalDetailComponent } from './technical-detail/technical-detail.component';
import { CommercialDetailComponent } from './commercial-detail/commercial-detail.component';
import { BankInfoComponent } from './bank-info/bank-info.component';
import { BranchInfoComponent } from './branch-info/branch-info.component';
import { AnnualTurnoverDetailComponent } from './annual-turnover-detail/annual-turnover-detail.component';
import { OrganizationProfileComponent } from './organization-profile/organization-profile.component';
import { TransportVendorProfileComponent } from './transport-vendor-profile/transport-vendor-profile.component';
import { TankerDetailsComponent } from './tanker-details/tanker-details.component';
import { AttachmentProfileComponent } from './attachment-profile/attachment-profile.component';
import { GstFilingDetailComponent } from './gst-filing-detail/gst-filing-detail.component';

const routes: Routes = [
  {
    path: "",
    component: ProfileLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      allowed: ["Admin","Vendor"],
      notAllowed: ["PO","RM","Manager"],
    },
  },
];

@NgModule({
  declarations: [ProfileLayoutComponent, AddressProfileComponent, ContactProfileComponent, TechnicalDetailComponent, CommercialDetailComponent, BankInfoComponent, BranchInfoComponent, AnnualTurnoverDetailComponent, OrganizationProfileComponent, TransportVendorProfileComponent, TankerDetailsComponent, AttachmentProfileComponent, GstFilingDetailComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
})
export class ProfileModule {}
