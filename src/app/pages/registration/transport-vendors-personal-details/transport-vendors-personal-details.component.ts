import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../Services/login.service';
import { TransportVendorPersonalData } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';

@Component({
  selector: 'ngx-transport-vendors-personal-details',
  templateUrl: './transport-vendors-personal-details.component.html',
  styleUrls: ['./transport-vendors-personal-details.component.scss']
})
export class TransportVendorsPersonalDetailsComponent {
  transporterVendorsForm: FormGroup;
  formId: number = 1;

  constructor(private _fb: FormBuilder,private _commonService: CommonService,) {}

  ngOnInit(): void {
    this.transporterVendorsForm = this._fb.group({
      Name_of_Transporter: ['', [Validators.required]],
      Date_of_Establishment: [''],
      No_of_Own_Vehicles: ['', [Validators.required]],
      No_of_Drivers: ['', [Validators.required]],
      Nicerglobe_Registration: ['']
    });
  }

  // validations
  keyPressValidation(event: Event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the Transport Vendor Personal Data form is valid
  isValid() {
    if (this.transporterVendorsForm.valid) {
      return true;
    }
    else{
      this.transporterVendorsForm.markAllAsTouched();
      return false;
    }
  }

  // Get Transport Vendor Personal Data, calls by layout component
  getTransportVendorPersonalData() {
    let transportVendorPersonalData=  new TransportVendorPersonalData();
    transportVendorPersonalData = this.transporterVendorsForm.value;
    transportVendorPersonalData.Id = 0;
    transportVendorPersonalData.Form_Id = this.formId;
    return transportVendorPersonalData;
  }

}
