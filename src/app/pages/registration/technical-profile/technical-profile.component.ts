import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TechnicalProfile } from '../../../Models/Dtos';
import { AuthResponse } from '../../../Models/authModel';
import { RegistrationService } from '../../../Services/registration.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-technical-profile',
  templateUrl: './technical-profile.component.html',
  styleUrls: ['./technical-profile.component.scss']
})
export class TechnicalProfileComponent implements OnInit {
  @Input() form_Id: number;

  technicalProfileForm: FormGroup;
  disablePlanningOption: boolean;
  authResponse: AuthResponse;

  constructor(private _fb: FormBuilder,
    private _registration:RegistrationService,
    private _common:CommonService) { }

  ngOnInit(): void {
    this.technicalProfileForm = this._fb.group({
      Is_ISO_Certified: [false],
      Other_Qms_Certified: [false],
      Planning_for_Qms: [false],
      Is_Statutory_Provisions_Adheard: [false],
      Initiatives_for_Development: [''],
    });

    this.authResponse = JSON.parse(sessionStorage.getItem("userDetails"));
    if(this.authResponse && this.authResponse.Role != "Vendor"){
      this.technicalProfileForm.disable();
    }
    // Get Form data by form Id
    this._registration.getFormData(this.form_Id,'TechnicalProfile').subscribe({
      next:(res)=>{
        if(res){
          this.technicalProfileForm.patchValue(res);
        }
      },
      error:(err)=>{
        this._common.openSnackbar(err,snackbarStatus.Danger);
      }
    });
  }

  changeOptions() {
    if (this.technicalProfileForm.get('Is_ISO_Certified').value == true || this.technicalProfileForm.get('Other_Qms_Certified').value) {
      this.technicalProfileForm.get('Planning_for_Qms').disable();
    }
    else if (this.technicalProfileForm.get('Planning_for_Qms').value == true) {
      this.technicalProfileForm.get('Is_ISO_Certified').disable();
      this.technicalProfileForm.get('Other_Qms_Certified').disable();
    }
    else {
      this.technicalProfileForm.get('Planning_for_Qms').enable();
      this.technicalProfileForm.get('Is_ISO_Certified').enable();
      this.technicalProfileForm.get('Other_Qms_Certified').enable();
    }
  }

  // Get technical Profile data, calls by layout component
  getTechnicalProfile() {
    let technicalProfile = new TechnicalProfile();
    technicalProfile = this.technicalProfileForm.value;
    technicalProfile.Id = 0;
    technicalProfile.Form_Id = this.form_Id;
    return technicalProfile;
  }
}
