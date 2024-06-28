import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../Services/common.service';
import { MasterService } from '../../Services/master.service';
import { DatePipe } from '@angular/common';
import { getSession } from '../../Utils';

@Component({
  selector: 'ngx-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss']
})
export class GradeDialogComponent implements OnInit {

  gradeForm: FormGroup;
  today: Date;
  last_audit_date ; 

  constructor(
    private fb: FormBuilder,
    private _common: CommonService,
    private _master: MasterService,
    private datePipe: DatePipe,
    private _dialogref: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    console.log(this.data.vendorProfile.Grade);
    this.today = new Date();
    console.log(this.today);
    
    this.initialiseGradeForm();
  }

  initialiseGradeForm() {
    this.last_audit_date = this.datePipe.transform(this.data.vendorProfile.Grade.Last_Audit_Date, 'MM/dd/yyyy');

    this.gradeForm = this.fb.group({
      Grade: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      Last_Audit_Date: ["", [Validators.required]],
      Last_Audited_By: ["", [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      Location: ["", [Validators.required, Validators.maxLength(100), Validators.minLength(3)]]
    });

    this.gradeForm.patchValue({
      Last_Audit_Date: this.last_audit_date
    })
  }

  keyPressValidation(event: Event, type: string) {
    return this._common.KeyPressValidation(event, type);
  }

  updateGrade() {

    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    this.data.vendorProfile.Grade.Grade = this.gradeForm.value.Grade;
    this.data.vendorProfile.Grade.Last_Audit_Date = this.gradeForm.value.Last_Audit_Date;
    this.data.vendorProfile.Grade.Last_Audited_By = this.gradeForm.value.Last_Audited_By,
      this.data.vendorProfile.Grade.Location = this.gradeForm.value.Location;

    if (this.data.vendorProfile.Grade.GradeId == 0) {
      this.data.vendorProfile.Grade.FormId = JSON.parse(getSession("vendorInfo")).FormId;
      this.data.vendorProfile.Grade.Vendor_Code = JSON.parse(getSession("vendorInfo")).Vendor_Code;
      this._master.addVendorGrade(this.data.vendorProfile.Grade).subscribe({
        next: (res) => {
          console.log(res);
        }
      });
    }
    else {
      this._master.updateVendorGrade(this.data.vendorProfile.Grade).subscribe({
        next: (res) => {
          console.log(res);
        }
      });;
    }
  }
}
