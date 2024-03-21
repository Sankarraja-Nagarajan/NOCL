import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Rejection } from '../../Models/Registration';
import { AuthResponse } from '../../Models/authModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-reject-reason-dialog',
  templateUrl: './reject-reason-dialog.component.html',
  styleUrls: ['./reject-reason-dialog.component.scss']
})
export class RejectReasonDialogComponent implements OnInit {

  reason = new FormControl('', [Validators.required]);
  authResponse: AuthResponse;
  constructor(public _dialogRef: MatDialogRef<RejectReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public form_Id: number,) {
  }

  ngOnInit(): void {
    this.authResponse = JSON.parse(sessionStorage.getItem('userDetails'));
  }

  reject() {
    if (this.reason.valid) {
      let reject = new Rejection();
      reject.Form_Id = this.form_Id;
      reject.Employee_Id = this.authResponse.Employee_Id;
      reject.Reason = this.reason.value;
      this._dialogRef.close({ reject });
    }
    else {
      this.reason.markAsTouched();
    }
  }

}
