import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MajorCustomer } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-add-major-customer-dialog',
  templateUrl: './add-major-customer-dialog.component.html',
  styleUrls: ['./add-major-customer-dialog.component.scss']
})
export class AddMajorCustomerDialogComponent implements OnInit {

  majorCustomerForm: FormGroup;
  majorCustomers: MajorCustomer[] = [];
  // form_Id: number;

  constructor(private _common: CommonService,
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddMajorCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public form_Id: number,) {
  }

  ngOnInit(): void {
    // major Customer Form initialization
    this.majorCustomerForm = this._fb.group({
      Customer_Name: ['', [Validators.required]],
      Location: ['', [Validators.required]],
    });
  }

  //add item into majorCustomers array
  addMajorCustomer() {
    if (this.majorCustomerForm.valid) {
      let majorCustomer = new MajorCustomer();
      majorCustomer = this.majorCustomerForm.value;
      majorCustomer.Id = 0;
      majorCustomer.Form_Id = this.form_Id;
      this.majorCustomers.push(majorCustomer);
      this.majorCustomerForm.reset();
    }
    else {
      this.majorCustomerForm.markAllAsTouched();
    }
  }

  //remove item into majorCustomers array
  removeMajorCustomer(index: number) {
    this.majorCustomers.splice(index, 1);
  }

}
