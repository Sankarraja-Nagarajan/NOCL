import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../../../Services/login.service';
import { VendorBranch } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-vendor-branches',
  templateUrl: './vendor-branches.component.html',
  styleUrls: ['./vendor-branches.component.scss']
})
export class VendorBranchesComponent implements OnInit {
  @Input() form_Id: number;

  vendorBranches: VendorBranch[] = [];
  dataSource = new MatTableDataSource(this.vendorBranches);

  displayedColumns: string[] = [
    'name',
    'designation',
    'mobileNo',
    'emailId',
    'location',
    'action'
  ];
  VendorBranchForm: FormGroup;

  constructor(private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService) { }

  ngOnInit(): void {
    this.VendorBranchForm = this._fb.group({
      Name: ['', [Validators.required]],
      Designation: [''],
      Email_Id: ['', [Validators.email]],
      Mobile_No: ['', [Validators.required, Validators.maxLength(15)]],
      Location: ['', [Validators.required]]
    });

    // Get vendor branches by form Id
    this._registration.getFormData(this.form_Id, 'VendorBranches').subscribe({
      next: (res) => {
        if (res) {
          this.vendorBranches = res;
          this.dataSource = new MatTableDataSource(this.vendorBranches);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  // Allow (numbers, plus, and space) for Mobile & Phone
  keyPressValidation(event, type) {
    return this._commonService.KeyPressValidation(event, type)
  }

  addVendorBranch() {
    if (this.VendorBranchForm.valid) {
      this.vendorBranches.push(this.VendorBranchForm.value);
      this.dataSource._updateChangeSubscription();
      this.VendorBranchForm.reset();
    }
    else {
      this.VendorBranchForm.markAllAsTouched();
    }
  }

  removeVendorBranch(i: number) {
    this.vendorBranches.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Make sure the vendorBranches array has at least one value
  isValid() {
    if (this.vendorBranches.length > 0) {
      return true;
    }
    else {
      this.VendorBranchForm.markAllAsTouched();
      return false;
    }
  }

  // Get vendorBranches array, calls by layout component
  getVendorBranches() {
    this.vendorBranches.forEach((element) => {
      element.Branch_Id = 0;
      element.Form_Id = this.form_Id;
    });
    return this.vendorBranches;
  }
}