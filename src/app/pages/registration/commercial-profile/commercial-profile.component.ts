import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommercialProfile } from '../../../Models/Dtos';
import { AppConfigService } from '../../../Services/app-config.service';

@Component({
  selector: 'ngx-commercial-profile',
  templateUrl: './commercial-profile.component.html',
  styleUrls: ['./commercial-profile.component.scss']
})
export class CommercialProfileComponent {

  commercialProfileForm: FormGroup;
  msmeTypes: string[] = [];

  constructor(private _fb: FormBuilder, private _config: AppConfigService) { }

  ngOnInit(): void {
    this.commercialProfileForm = this._fb.group({
      Financial_Credit_Rating: [''],
      Agency_Name: [''],
      PAN: ['', [Validators.maxLength(10),
      Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]],
      GSTIN: ['', [Validators.maxLength(15),
      Validators.pattern('^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{2})+$')]],
      MSME_Type: [''],
      MSME_Number: [''],
      ServiceCategory: ['']
    });

    if (parseInt(sessionStorage.getItem('V_Id')) != 4) {
      this.commercialProfileForm.get('PAN').addValidators([Validators.required]);
    }

    this.msmeTypes = this._config.get('MSME_Types').split(',');
  }

  // Make sure the Commercial Profile Form is valid
  isValid() {
    if (this.commercialProfileForm.valid) {
      return true;
    }
    else {
      this.commercialProfileForm.markAllAsTouched();
      return false;
    }
  }

  // Get commercial Profile data, calls by layout component
  getCommercialProfile() {
    let commercialProfile = new CommercialProfile();
    commercialProfile = this.commercialProfileForm.value;
    commercialProfile.Id = 0;
    commercialProfile.Form_Id = parseInt(sessionStorage.getItem('Form_Id'));
    return commercialProfile;
  }
}
