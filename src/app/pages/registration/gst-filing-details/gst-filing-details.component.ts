import { Component, Input, ViewChild } from "@angular/core";
import { getSession } from "../../../Utils";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthResponse } from "../../../Models/authModel";
import { CommonService } from "../../../Services/common.service";
import { RegistrationService } from "../../../Services/registration.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { GST_Filing_Details, GST_Filing_Dto } from "../../../Models/Dtos";

@Component({
  selector: "ngx-gst-filing-details",
  templateUrl: "./gst-filing-details.component.html",
  styleUrls: ["./gst-filing-details.component.scss"],
})
export class GstFilingDetailsComponent {
  @Input() form_Id: number;
  @Input() v_Id: number;
  @Input() isReadOnly: boolean;
  gstFilingHistory: GST_Filing_Dto = new GST_Filing_Dto();
  gstFilingDetails: GST_Filing_Details[] = [];
  gstFilingId: number = 0;
  dataSource = new MatTableDataSource(this.gstFilingDetails);
  displayedColumns: string[] = [
    "arn",
    "mof",
    "status",
    "rtntype",
    "ret_prd",
    "dof",
    "valid",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  gstFilingDetailsForm: FormGroup;
  authResponse: AuthResponse;
  lastFetchOn_date: string | Date = null;

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
          this.gstFilingHistory = res as GST_Filing_Dto;
          this.gstFilingDetails = res.GST_Filing_Details as GST_Filing_Details[];
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
            if (res && res.data && res.data.EFiledlist) {
              this.gstFilingDetails = res.data.EFiledlist;
              this.dataSource = new MatTableDataSource(this.gstFilingDetails);
              this.dataSource.paginator = this.paginator;
              this.lastFetchOn_date = new Date().toLocaleString();
            }
          },
          error: (err) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        });
    } else {
      this._commonService.openSnackbar(
        "Enter Valid GSTIN Number",
        snackbarStatus.Danger
      );
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
    this.gstFilingHistory.Form_Id = this.form_Id;
    if (!this.gstFilingHistory.Last_FetchOn) {
      this.gstFilingHistory.Last_FetchOn = new Date().toLocaleString();
    }
    else {
      this.gstFilingHistory.Last_FetchOn = this.lastFetchOn_date;
    }
    this.gstFilingHistory.GST_Filing_Details = this.gstFilingDetails;
    return this.gstFilingHistory;
  }

  markGstFilingFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.gstFilingDetailsForm.markAllAsTouched();
    }
  }
}
