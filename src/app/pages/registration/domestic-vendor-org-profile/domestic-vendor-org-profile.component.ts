import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorOrganizationProfile } from '../../../Models/Dtos';
// import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-domestic-vendor-org-profile',
  templateUrl: './domestic-vendor-org-profile.component.html',
  styleUrls: ['./domestic-vendor-org-profile.component.scss']
})
export class DomesticVendorOrgProfileComponent {

  vendorOrgForm: FormGroup;
  formId: number = 1;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.vendorOrgForm = this._fb.group({
      Type_of_Org_Id: ['', Validators.required],
      Status_of_Company_Id: ['', Validators.required],
      RelationToNOCIL: [''],
      Subsideries: [''],
      AnnualProdCapacity: [''],
      ListOfMajorCustomer: [''],
    });
  }

  // Make sure the Vendor Organization Profile Form is valid
  isValid() {
    if (this.vendorOrgForm.valid) {
      return true;
    }
    else {
      this.vendorOrgForm.markAllAsTouched();
      return false;
    }
  }

  // Get Vendor Organization Profile data, calls by layout component
  getDomesticVendorOrgProfile() {
    let vendorOrganizationProfile = new VendorOrganizationProfile();
    vendorOrganizationProfile = this.vendorOrgForm.value;
    vendorOrganizationProfile.Id = 0;
    vendorOrganizationProfile.Form_Id = this.formId;
    return vendorOrganizationProfile;
  }
}
