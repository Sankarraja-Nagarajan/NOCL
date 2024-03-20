import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TankerDetail } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-tanker-details',
  templateUrl: './tanker-details.component.html',
  styleUrls: ['./tanker-details.component.scss']
})
export class TankerDetailsComponent implements OnInit {
  @Input() form_Id: number;

  tankerDetails: TankerDetail[] = [];
  dataSource = new MatTableDataSource(this.tankerDetails);

  displayedColumns: string[] = [
    'tankerType',
    'capacityOfTanker',
    'action'
  ];
  TankerDetailsForm: FormGroup;

  constructor(private _fb: FormBuilder, 
    private _commonService: CommonService,
    private _registration:RegistrationService) {
  }
  ngOnInit(): void {
    this.TankerDetailsForm = this._fb.group({
      Tanker_Type_Id: ['', Validators.required],
      Capacity_of_Tanker: ['', [Validators.required]],
    });

    // Get Annual turn overs data by form Id
    this._registration.getFormData(this.form_Id, 'TankerDetails').subscribe({
      next: (res) => {
        if (res) {
          this.tankerDetails = res;
          this.dataSource = new MatTableDataSource(this.tankerDetails);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  addTanker() {
    if (this.TankerDetailsForm.valid) {
      this.tankerDetails.push(this.TankerDetailsForm.value);
      this.dataSource._updateChangeSubscription();
      this.TankerDetailsForm.reset();
    }
    else {
      this.TankerDetailsForm.markAllAsTouched();
    }
  }

  removeTanker(i) {
    this.tankerDetails.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // validations
  keyPressValidation(event: Event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the Tanker Details array has atleast 1 value
  isValid() {
    if (this.tankerDetails.length > 0) {
      return true;
    }
    else {
      this.TankerDetailsForm.markAllAsTouched();
      return false;
    }
  }

  // Get Tanker Details Data, calls by layout component
  getTankerDetails() {
    this.tankerDetails.forEach((element) => {
      element.Id = 0;
      element.Form_Id = this.form_Id;
    });
    return this.tankerDetails;
  }
}
