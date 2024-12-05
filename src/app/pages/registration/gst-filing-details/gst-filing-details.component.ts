import { Component, Input, ViewChild } from '@angular/core';
import { getSession } from '../../../Utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from '../../../Models/authModel';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GST_Filing_Dto } from '../../../Models/Dtos';

@Component({
  selector: 'ngx-gst-filing-details',
  templateUrl: './gst-filing-details.component.html',
  styleUrls: ['./gst-filing-details.component.scss']
})
export class GstFilingDetailsComponent {

  @Input() form_Id: number;
  @Input() v_Id: number;
  @Input() isReadOnly: boolean;
  gstFilingDetails: GST_Filing_Dto[] = [];
  gstFilingId: number = 0;
  dataSource = new MatTableDataSource(this.gstFilingDetails);
  displayedColumns: string[] = [
    "arn",
    "mof",
    "status",
    "rtntype",
    "ret_prd",
    "dof",
    "valid"
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  gstFilingDetailsForm: FormGroup;
  authResponse: AuthResponse;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService
  ) { }

  ngOnInit(): void {
    this.gstFilingDetailsForm = this._fb.group({
      GSTIN: [
        "",
        [
          Validators.pattern(
            "^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{2})+$"
          ),
        ],
      ],
    });


    this.authResponse = JSON.parse(getSession("userDetails"));
    if (this.isReadOnly) {
      this.gstFilingDetailsForm.disable();
    }

    this._registration.getFormData(this.form_Id, "GSTFilingDetails").subscribe({
      next: (res) => {
        if (res) {
          this.gstFilingDetails = res;
          this.dataSource = new MatTableDataSource(this.gstFilingDetails);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getGstFilingDetails() {
    if (this.gstFilingDetailsForm.value.GSTIN && this.gstFilingDetailsForm.get("GSTIN").valid) {
      this._registration
        .getGstFilingDetails(this.gstFilingDetailsForm.value.GSTIN)
        .subscribe({
          next: (res) => {
            if (res) {
              this.gstFilingDetails = res.data.EFiledlist;
              this.dataSource = new MatTableDataSource(this.gstFilingDetails);
              this.dataSource.paginator = this.paginator;
            }
          },
          error: (err) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        });
    } else {
      this._commonService.openSnackbar("Enter Valid GSTIN Number", snackbarStatus.Danger);
    }
  }

  isValid() {
    if (this.gstFilingDetailsForm.valid) {
      return true;
    } else {
      this.gstFilingDetailsForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }


  getGSTFiling() {
    this.gstFilingDetails = this.dataSource.data;
    this.gstFilingDetails.forEach((element) => {
      element.Form_Id = this.form_Id;
      element.Last_FetchOn = new Date().toLocaleString();
    });
    return this.gstFilingDetails;
  }


  markGstFilingFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.gstFilingDetailsForm.markAllAsTouched();
    }
  }

}
