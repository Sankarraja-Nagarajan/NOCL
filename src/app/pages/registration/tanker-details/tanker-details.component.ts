import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TankerDetail } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';

@Component({
  selector: 'ngx-tanker-details',
  templateUrl: './tanker-details.component.html',
  styleUrls: ['./tanker-details.component.scss']
})
export class TankerDetailsComponent {
  tankerDetails: TankerDetail[] = [];
  dataSource = new MatTableDataSource(this.tankerDetails);

  displayedColumns: string[] = [
    'tankerType',
    'capacityOfTanker',
    'action'
  ];

  TankerDetailsForm: FormGroup
  formId: number = 1;

  constructor(private _fb: FormBuilder, private _commonService: CommonService) {

    this.TankerDetailsForm = _fb.group({
      Tanker_Type_Id: ['', Validators.required],
      Capacity_of_Tanker: ['', [Validators.required]],
    })
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
      element.Form_Id = this.formId;
    });
    return this.tankerDetails;
  }
}
