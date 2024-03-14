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

  subsideriesList = [];
  listOfMajorCustomerList = [];

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.vendorOrgForm = this._fb.group({
      Id: [''],
      Form_Id: [''],
      Type_of_Org_Id: ['', Validators.required],
      Status_of_Company_Id: ['', Validators.required],
      RelationToNOCIL: [''],
      Subsideries: [null, Validators.required],
      AnnualProdCapacity: [''],
      ListOfMajorCustomer: [null, Validators.required],
    });
  }

  addMultipleSubsideries() {
    if (this.vendorOrgForm.get('Subsideries').value == null) {
      this.vendorOrgForm.get('Subsideries').markAllAsTouched();
    }
    else {
      console.log(this.vendorOrgForm.get('Subsideries').value);
      this.subsideriesList.push(this.vendorOrgForm.get('Subsideries').value);
      this.vendorOrgForm.get('Subsideries').reset();
    }
  }

  addMultipleMajorCustomers() {
    if (this.vendorOrgForm.get('ListOfMajorCustomer').value == null) {
      this.vendorOrgForm.get('ListOfMajorCustomer').markAllAsTouched();
    }
    else {
      console.log(this.listOfMajorCustomerList)
      this.listOfMajorCustomerList.push(this.vendorOrgForm.get('ListOfMajorCustomer').value);
      this.vendorOrgForm.get('ListOfMajorCustomer').reset();
    }
  }

  removeSubsideriesItems(i: number) {
    this.subsideriesList.splice(i, 1);
    console.log(this.subsideriesList);
  }
  removeMajorCustomerItems(i: number) {
    this.listOfMajorCustomerList.splice(i, 1);
    console.log(this.subsideriesList);
  }
}


