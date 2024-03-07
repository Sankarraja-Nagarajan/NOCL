import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-commercial-profile',
  templateUrl: './commercial-profile.component.html',
  styleUrls: ['./commercial-profile.component.scss']
})
export class CommercialProfileComponent {

 commercialProfileForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.commercialProfileForm = this._fb.group({
      Id:[''],
      Form_Id:[''],
      Financial_Credit_Rating:[''],
      Agency_Name:[''],
      PAN:[''],
      GSTIN:[''],
      MSME_Type:[''],
      MSME_Number:['']
    });
  }
}
