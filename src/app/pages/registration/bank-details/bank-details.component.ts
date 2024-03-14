import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bank_Detail } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';

@Component({
  selector: 'ngx-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {
  bankDetailsForm: FormGroup;
  formId: number = 1;

  constructor(private _fb: FormBuilder, private _commonService:CommonService) {}

  ngOnInit(): void {
    this.bankDetailsForm = this._fb.group({
      AccountHolder:['', [Validators.required, Validators.maxLength(100)]],
      Bank:['', [Validators.required, Validators.maxLength(100)]],
      Branch:['', [Validators.required, Validators.maxLength(30)]],
      Address:[''],
      Account_Number:['', [Validators.maxLength(30)]],
      IFSC:['', [Validators.maxLength(11),
      Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      SWIFT:['', [Validators.maxLength(11)]],
      IBAN:['', [Validators.maxLength(34)]],
    });
  }

  //key press validation
  keyPressValidation(event,type){
    return this._commonService.KeyPressValidation(event,type);
  }

  // Make sure the Bank Details Form is valid
  isValid() {
    if (this.bankDetailsForm.valid) {
      return true;
    }
    else{
      this.bankDetailsForm.markAllAsTouched();
      return false;
    }
  }

  // Get partners array, calls by layout component
  getBankDetail() {
    let bankDetail = new Bank_Detail();
    bankDetail=this.bankDetailsForm.value;
    bankDetail.Id = 0;
    bankDetail.Form_Id = this.formId;
    return bankDetail;
  }
}
