import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { TankerDetail } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { RegistrationService } from "../../../Services/registration.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { MasterService } from "../../../Services/master.service";
import { TankerType } from "../../../Models/Master";

@Component({
  selector: "ngx-tanker-details",
  templateUrl: "./tanker-details.component.html",
  styleUrls: ["./tanker-details.component.scss"],
})
export class TankerDetailsComponent implements OnInit {
  @Input() form_Id: number;

  tankerDetails: TankerDetail[] = [];
  dataSource = new MatTableDataSource(this.tankerDetails);

  displayedColumns: string[] = ["tankerType", "capacityOfTanker", "action"];
  TankerDetailsForm: FormGroup;
  role: any;
  typeOfTankers: TankerType[] = [];

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService,
    private _master: MasterService
  ) {}
  ngOnInit(): void {
    this.TankerDetailsForm = this._fb.group({
      Tanker_Type_Id: ["", Validators.required],
      Capacity_of_Tanker: ["", [Validators.required]],
    });

    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";

    this._master.getTankerTypes().subscribe({
      next: (res) => {
        this.typeOfTankers = res as TankerType[];

        // Get Annual turn overs data by form Id
        this._registration
          .getFormData(this.form_Id, "TankerDetails")
          .subscribe({
            next: (res) => {
              if (res) {
                this.tankerDetails = res;
                this.dataSource = new MatTableDataSource(this.tankerDetails);
              }
            },
            error: (err) => {
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
      },
    });
  }

  addTanker() {
    if (this.TankerDetailsForm.valid) {
      this.dataSource.data.push(this.TankerDetailsForm.value);
      this.dataSource._updateChangeSubscription();
      this.TankerDetailsForm.reset();
    } else {
      this.TankerDetailsForm.markAllAsTouched();
    }
  }

  removeTanker(i) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // validations
  keyPressValidation(event: Event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the Tanker Details array has atleast 1 value
  isValid() {
    if (this.dataSource.data.length > 0) {
      return true;
    } else {
      this.TankerDetailsForm.markAllAsTouched();
      return false;
    }
  }

  // Get Tanker Details Data, calls by layout component
  getTankerDetails() {
    this.tankerDetails = this.dataSource.data;
    this.tankerDetails.forEach((element) => {
      element.Id = element.Id ? element.Id : 0;
      element.Form_Id = this.form_Id;
    });
    return this.tankerDetails;
  }

  markTankerDetailFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.TankerDetailsForm.markAllAsTouched();
    }
  }

  getTankerTypeById(tankerTypeId: number): string {
    const type = this.typeOfTankers.find(
      (type) => type.Tanker_Type_Id === tankerTypeId
    );
    return type ? type.Tanker_Type : "";
  }
}
