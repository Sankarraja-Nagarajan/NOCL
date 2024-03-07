import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-domestic-vendor-org-profile',
  templateUrl: './domestic-vendor-org-profile.component.html',
  styleUrls: ['./domestic-vendor-org-profile.component.scss']
})
export class DomesticVendorOrgProfileComponent {

  vendorOrgForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.vendorOrgForm = this._fb.group({
      Id: [''],
      Form_Id: [''],
      Type_of_Org_Id: ['',Validators.required],
      Status_of_Company_Id: ['',Validators.required],
      RelationToNOCIL: [''],
      Subsideries: [''],
      AnnualProdCapacity: [''],
      ListOfMajorCustomer: [''],
    });
  }
}
