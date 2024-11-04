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
  FormId: number;
  VendorCode: string;

  constructor(public _dialogRef: MatDialogRef<RequestEditReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  ngOnInit(): void {
    this.FormId = this.data.FormId;
    this.VendorCode = this.data.VendorCode;
  }


  Submit() {
    if (this.reason.valid) {
      const request = new RequestForEdit();
      request.FormId = this.FormId;
      request.Reason = this.reason.value;
      request.VendorCode = this.VendorCode;
      console.log(request)
      this._dialogRef.close({ request });
    }
    else {
      this.reason.markAsTouched();
    }
  }


}
