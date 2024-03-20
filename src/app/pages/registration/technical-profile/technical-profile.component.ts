import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TechnicalProfile } from '../../../Models/Dtos';
import { AuthResponse } from '../../../Models/authModel';

@Component({
  selector: 'ngx-technical-profile',
  templateUrl: './technical-profile.component.html',
  styleUrls: ['./technical-profile.component.scss']
})
export class TechnicalProfileComponent implements OnInit {

  technicalProfileForm: FormGroup;
  disablePlanningOption: boolean;
  authResponse: AuthResponse;

  constructor(private _fb: FormBuilder) { }

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
    technicalProfile.Form_Id = parseInt(sessionStorage.getItem('Form_Id'));
    return technicalProfile;
  }
}
