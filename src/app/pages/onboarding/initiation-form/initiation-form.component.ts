import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../../Services/master.service';
import { CompanyCode, Department, VendorType } from '../../../Models/Master';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { forkJoin } from 'rxjs';
import { Form } from '../../../Models/Registration';
import { RegistrationService } from '../../../Services/registration.service';
import { AuthResponse } from '../../../Models/authModel';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-initiation-form',
  templateUrl: './initiation-form.component.html',
  styleUrls: ['./initiation-form.component.scss']
})
export class InitiationFormComponent implements OnInit {

  initiationForm: FormGroup;
  companyCodes: CompanyCode[] = [];
  departments: Department[] = [];
  vendorTypes: VendorType[] = [];
  userData : AuthResponse;

  constructor(private _fb: FormBuilder,
    private _master: MasterService,
    private _common: CommonService,
    private _registration:RegistrationService,
    private _router:Router) {

  }
  ngOnInit() {
    // get Auth Response
    this.userData = JSON.parse(sessionStorage.getItem('userDetails')) as AuthResponse;

    // get all master data
    this.getAllMasters();

    // Form Initiation
    this.initiationForm = this._fb.group({
      Vendor_Type_Id: ['', [Validators.required]],
      Vendor_Name: ['', [Validators.required]],
      Vendor_Mail: ['', [Validators.required, Validators.email]],
      Vendor_Mobile: ['',
        [Validators.required,
        Validators.maxLength(15)]],
      Company_Code: ['', [Validators.required]],
      Department_Id: ['', [Validators.required]]
    });
  }

  // get All masters
  getAllMasters() {
    forkJoin([
      this._master.getCompanyCodes(),
      this._master.getDepartments(),
      this._master.getVendorTypes()
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.companyCodes = res[0] as CompanyCode[];
        }
        if (res[1]) {
          this.departments = res[1] as Department[];
        }
        if (res[2]) {
          this.vendorTypes = res[2] as VendorType[];
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  };

  // input validation
  keyPressValidation(event: Event, type: string) {
    return this._common.KeyPressValidation(event, type);
  }

  submitForm() {
    if (this.initiationForm.valid) {
      let form = new Form();
      form = this.initiationForm.value;
      form.Status_Id = 0;
      form.Vendor_Code = '';
      form.CreatedBy = this.userData.Employee_Id;

      this._registration.formInitiate(form).subscribe({
        next:(res)=>{
          if(res.Status === 200){
            this._common.openSnackbar(res.Message, snackbarStatus.Success);
            this.initiationForm.reset();
          }
        },
        error:(err)=>{
          this._common.openSnackbar(err, snackbarStatus.Danger);
        }
      });
    }
    else {
      this.initiationForm.markAllAsTouched();
    }
  }
}