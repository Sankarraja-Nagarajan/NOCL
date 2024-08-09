import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleDetails } from '../../../Models/Dtos';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '../../../Services/common.service';
import { getSession } from '../../../Utils';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent {
  @Input() form_Id: number;
  isOtherVehicles: FormControl = new FormControl(true);

  vehicleDetails: VehicleDetails[] = [];
  dataSource = new MatTableDataSource(this.vehicleDetails);

  displayedColumns: string[] = [
    "Vehicle_Type",
    "Capacity",
    "action"
  ];
  VehicleDetailsForm: FormGroup;
  haveOtherVehicles: boolean = true;
  editIndex: number = -1;
  role: any;


  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService
  ) { }

  ngOnInit(): void {
    this.VehicleDetailsForm = this._fb.group({
      Vehicle_Type: ["", [Validators.required]],
      Capacity: ["", [Validators.required]],
    });
    this.valueChangeEvents();

    const userData = JSON.parse(getSession("userDetails"));
    this.role = userData ? userData.Role : "";
    this.role != 'Vendor' ? this.isOtherVehicles.disable() : this.isOtherVehicles.enable();
    console.log(this.form_Id)
    this._registration.getFormData(this.form_Id, "VehicleDetails").subscribe({
      next: (res) => {
        if (res) {
          this.vehicleDetails = res;
          console.log(this.vehicleDetails)
          this.dataSource = new MatTableDataSource(this.vehicleDetails);
          if (this.vehicleDetails.length == 0) {
            this.haveOtherVehicles = false;
            this.isOtherVehicles.setValue(false);
          }
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
  addVehicleDetails() {
    if (this.VehicleDetailsForm.valid) {
      this.dataSource.data.push(this.VehicleDetailsForm.value);
      this.dataSource._updateChangeSubscription();
      this.VehicleDetailsForm.reset();
    } else {
      this.VehicleDetailsForm.markAllAsTouched();
    }
  }

  removeVehicleDetails(i: number) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }


  updateVehicleDetails() {
    if (this.editIndex >= 0) {
      let id = this.dataSource.data[this.editIndex].VehicleTypeId;
      this.dataSource.data[this.editIndex] = this.VehicleDetailsForm.value;
      this.dataSource.data[this.editIndex].VehicleTypeId = id;
      this.dataSource._updateChangeSubscription();
      this.VehicleDetailsForm.reset();
      this.editIndex = -1;
    }
  }

  editVehicleDetails(i: number) {
    this.VehicleDetailsForm.patchValue(this.dataSource.data[i]);
    this.editIndex = i;
  }

  isValid() {
    if (this.dataSource.data.length > 0) {
      return true;
    } else {
      this.VehicleDetailsForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  keyPressValidation(event) {
    return this._commonService.KeyPressValidation(event, "alphanumeric");
  }
  
  getVehicleDetails() {
    this.vehicleDetails = this.dataSource.data as VehicleDetails[];
    this.vehicleDetails.forEach((element) => {
      element.VehicleTypeId = element.VehicleTypeId ? element.VehicleTypeId : 0;
      element.Form_Id = this.form_Id;
    });
    console.log(this.vehicleDetails)
    return this.vehicleDetails;
  }

  valueChangeEvents() {
    this.isOtherVehicles.valueChanges.subscribe({
      next: (res) => {
        if (res)
          this.haveOtherVehicles = true;
        else {
          this.haveOtherVehicles = false;
          this.dataSource.data = [];
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  markVehicleDetailsFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.VehicleDetailsForm.markAllAsTouched();
    }
  }
}


