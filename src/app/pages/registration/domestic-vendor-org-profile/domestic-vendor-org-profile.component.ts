import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MajorCustomer, Subsideries, VendorOrganizationProfile } from '../../../Models/Dtos';
import { MatDialog } from '@angular/material/dialog';
import { AddMajorCustomerDialogComponent } from '../../../Dialogs/attachment-dialog/add-major-customer-dialog/add-major-customer-dialog.component';
import { CompanyStatus, OrganizationType } from '../../../Models/Master';
import { MasterService } from '../../../Services/master.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { forkJoin } from 'rxjs';
import { RegistrationService } from '../../../Services/registration.service';
import { AuthResponse } from '../../../Models/authModel';


@Component({
  selector: 'ngx-domestic-vendor-org-profile',
  templateUrl: './domestic-vendor-org-profile.component.html',
  styleUrls: ['./domestic-vendor-org-profile.component.scss']
})
export class DomesticVendorOrgProfileComponent {
  @Input() form_Id: number;
  
  vendorOrgForm: FormGroup;
  subsideriesList: Subsideries[] = [];
  listOfMajorCustomerList: MajorCustomer[] = [];
  orgTypes: OrganizationType[] = [];
  companyStatuses: CompanyStatus[] = [];
  authResponse: AuthResponse;

  constructor(private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _master: MasterService,
    private _common: CommonService,
    private _registration: RegistrationService) { }

  ngOnInit(): void {
    this.vendorOrgForm = this._fb.group({
      Type_of_Org_Id: ['', Validators.required],
      Status_of_Company_Id: ['', Validators.required],
      RelationToNocil: [false],
      Subsideries: [null],
      Annual_Prod_Capacity: [''],
    });

    this.authResponse = JSON.parse(sessionStorage.getItem("userDetails"));
    if(this.authResponse && this.authResponse.Role != "Vendor"){
      this.vendorOrgForm.disable();
    }
    // get master data
    this.getAllMasters();
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
    vendorOrganizationProfile.Form_Id = this.form_Id;
    return vendorOrganizationProfile;
  }

  // validation
  keyPressValidation(event: Event, type: string) {
    return this._common.KeyPressValidation(event, type);
  }

  addMultipleSubsideries() {
    if (this.vendorOrgForm.get('Subsideries').value == null) {
      this.vendorOrgForm.get('Subsideries').markAllAsTouched();
    }
    else {
      let subsidery = new Subsideries();
      subsidery.Form_Id = this.form_Id;
      subsidery.Id = 0;
      subsidery.Subsidery_Name = this.vendorOrgForm.get('Subsideries').value;
      this.subsideriesList.push(subsidery);
      this.vendorOrgForm.get('Subsideries').reset();
    }
  }

  addMultipleMajorCustomers() {
    if (this.vendorOrgForm.get('ListOfMajorCustomer').value == null) {
      this.vendorOrgForm.get('ListOfMajorCustomer').markAllAsTouched();
    }
    else {
      let majorCustomer = new MajorCustomer();
      majorCustomer.Form_Id = this.form_Id;
      majorCustomer.Id = 0;
      majorCustomer.Location = '',
        majorCustomer.Customer_Name = this.vendorOrgForm.get('ListOfMajorCustomer').value;
      this.listOfMajorCustomerList.push(majorCustomer);
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

  addMajorCustomer() {
    const dialogRef = this._dialog.open(AddMajorCustomerDialogComponent, {
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          if (this.listOfMajorCustomerList.length == 0) {
            this.listOfMajorCustomerList = res;
          }
          else {
            this.listOfMajorCustomerList.push(...res);
          }
        }
      }
    });
  }

  getSubsideries() {
    return this.subsideriesList;
  }

  getMajorCustomers() {
    return this.listOfMajorCustomerList;
  }

  getAllMasters() {
    forkJoin([
      this._master.getOrganizationTypes(),
      this._master.getCompanyStatuses(),
      this._registration.getFormData(this.form_Id, 'VendorOrganizationProfile'),
      this._registration.getFormData(this.form_Id, 'Subsideries'),
      this._registration.getFormData(this.form_Id, 'MajorCustomers')
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.orgTypes = res[0] as OrganizationType[];
        }
        if (res[1]) {
          this.companyStatuses = res[1] as CompanyStatus[];
        }
        if (res[2]) {
          this.vendorOrgForm.patchValue(res[2]);
        }
        if (res[3]) {
          this.subsideriesList = res[3] as Subsideries[];
        }
        if (res[4]) {
          this.listOfMajorCustomerList = res[4] as MajorCustomer[];
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }
}


