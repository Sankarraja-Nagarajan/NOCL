import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomesticVendorPersonalData } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { AuthResponse } from '../../../Models/authModel';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-domestic-vendor-personal-info',
  templateUrl: './domestic-vendor-personal-info.component.html',
  styleUrls: ['./domestic-vendor-personal-info.component.scss']
})
export class DomesticVendorPersonalInfoComponent implements OnInit {
  @Input() form_Id: number;
  
  domesticVendorForm: FormGroup;
  years: number[] = [];
  authResponse: AuthResponse;

  constructor(private _fb: FormBuilder, 
    private _commonService: CommonService,
    private _registration:RegistrationService) {
  }

  ngOnInit(): void {
    //Generate years for Plant Installation Year
    this.generateYears();
    
    // Domestic vendor personal info form initialization
    this.domesticVendorForm = this._fb.group({
      Organization_Name: ['', [Validators.required]],
      Plant_Installation_Year: ['', [Validators.required]],
      GSTIN: ['', [Validators.pattern('^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{2})+$')]]
    });

    this.authResponse = JSON.parse(sessionStorage.getItem("userDetails"));
    if(this.authResponse && this.authResponse.Role != "Vendor"){
      this.domesticVendorForm.disable();
    }
    // Get Form data by form Id
    this._registration.getFormData(this.form_Id,'DomesticVendorPersonalData').subscribe({
      next:(res)=>{
        if(res){
          this.domesticVendorForm.patchValue(res);
        }
      },
      error:(err)=>{
        this._commonService.openSnackbar(err,snackbarStatus.Danger);
      }
    });
  }

  getDetails() {

  }

  //generate years
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  //allown only numbers for Year
  keyPressValidation(event: Event) {
    return this._commonService.KeyPressValidation(event, 'number');
  }

  // Make sure the domesticVendorForm is valid
  isValid() {
    if (this.domesticVendorForm.valid) {
      return true;
    }
    else {
      this.domesticVendorForm.markAllAsTouched();
      return false;
    }
  }

  // Get Domestic Vendor Personal Data, calls by layout component
  getDomesticVendorPersonalInfo() {
    let domesticVendorPersonalData = new DomesticVendorPersonalData();
    domesticVendorPersonalData = this.domesticVendorForm.value;
    domesticVendorPersonalData.Domestic_Personal_Info_Id = 0;
    domesticVendorPersonalData.Form_Id = parseInt(sessionStorage.getItem('Form_Id'));
    return domesticVendorPersonalData;
  }
}
