import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {

  bankDetailsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.bankDetailsForm = this._fb.group({
      Id:[''],
      Form_Id:[''],
      AccountHolder:[''],
      Bank:[''],
      Branch:[''],
      Address:[''],
      Account_Number:[''],
      IFSC:[''],
      SWIFT:[''],
      IBAN:[''],
    });
  }
}
