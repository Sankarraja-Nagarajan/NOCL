import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-initiation-form',
  templateUrl: './initiation-form.component.html',
  styleUrls: ['./initiation-form.component.scss']
})
export class InitiationFormComponent implements OnInit {

  initiationForm: FormGroup;

  constructor(private _fb: FormBuilder) {

  }
  ngOnInit() {
    this.initiationForm = this._fb.group({
      VendorType_Id: ['', [Validators.required]],
      Vendor_Name: ['', [Validators.required]],
      Vendor_Mail: ['', [Validators.required, Validators.email]],
      Vendor_Mobile: ['', 
                      [Validators.required, 
                       Validators.pattern("[0-9]{3} [0-9]{3} [0-9]{4}"),
                       Validators.maxLength(12)]],
      Company_Code: ['', [Validators.required]],
      Department: ['', [Validators.required]],
      Purchase_Organization: ['', [Validators.required]]
    });
  }

}
