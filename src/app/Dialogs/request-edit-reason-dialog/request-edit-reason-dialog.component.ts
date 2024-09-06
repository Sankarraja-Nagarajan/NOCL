import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestForEdit } from '../../Models/Registration';
import { VendorGrade, VendorProfile } from '../../Models/Master';

@Component({
  selector: 'ngx-request-edit-reason-dialog',
  templateUrl: './request-edit-reason-dialog.component.html',
  styleUrls: ['./request-edit-reason-dialog.component.scss']
})
export class RequestEditReasonDialogComponent {


  reason = new FormControl('', [Validators.required]);
  vendorProfile: VendorProfile = new VendorProfile();

  constructor(public _dialogRef: MatDialogRef<RequestEditReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.vendorProfile = this.data;
    console.log(this.vendorProfile)
    console.log(this.vendorProfile['Grade'])
    console.log(this.vendorProfile.Grade)
  }


  Submit() {
    if (this.reason.valid) {
      const request = new RequestForEdit();
      request.Form_Id = this.data.Grade.FormId;
      request.Employee_Id = this.vendorProfile.Grade.Vendor_Code;
      request.Reason = this.reason.value;
      console.log(request)
      this._dialogRef.close({ request });
    }
    else {
      this.reason.markAsTouched();
    }
  }


}
