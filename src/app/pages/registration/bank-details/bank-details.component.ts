import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bank_Detail } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { AuthResponse } from '../../../Models/authModel';


@Component({
  selector: 'ngx-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {
  @Input() form_Id: number;
  
  bankDetailsForm: FormGroup;
  authResponse: AuthResponse;

  constructor(private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService) { }

  ngOnInit(): void {
    this.bankDetailsForm = this._fb.group({
      AccountHolder: ['', [Validators.required, Validators.maxLength(100)]],
      Bank: ['', [Validators.required, Validators.maxLength(100)]],
      Branch: ['', [Validators.required, Validators.maxLength(30)]],
      Address: [''],
      Account_Number: ['', [Validators.maxLength(30)]],
      IFSC: ['', [Validators.maxLength(11),
      Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      SWIFT: ['', [Validators.maxLength(11)]],
      IBAN: ['', [Validators.maxLength(34)]],
    });
    
    // Get Form data by form Id
    this._registration.getFormData(this.form_Id, 'BankDetail').subscribe({
      next: (res) => {
        if (res) {
          this.bankDetailsForm.patchValue(res);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
    this.authResponse = JSON.parse(sessionStorage.getItem("userDetails"));
    if(this.authResponse && this.authResponse.Role != "Vendor"){
      this.bankDetailsForm.disable();
    }

  }

  //key press validation
  keyPressValidation(event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the Bank Details Form is valid
  isValid() {
    if (this.bankDetailsForm.valid) {
      return true;
    }
    else {
      this.bankDetailsForm.markAllAsTouched();
      return false;
    }
  }

  // Get partners array, calls by layout component
  getBankDetail() {
    let bankDetail = new Bank_Detail();
    bankDetail = this.bankDetailsForm.value;
    bankDetail.Id = 0;
    bankDetail.Form_Id = parseInt(sessionStorage.getItem('Form_Id'));
    return bankDetail;
  }
}
