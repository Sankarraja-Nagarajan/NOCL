import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../Services/login.service';
import { TransportVendorPersonalData } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-transport-vendors-personal-details',
  templateUrl: './transport-vendors-personal-details.component.html',
  styleUrls: ['./transport-vendors-personal-details.component.scss']
})
export class TransportVendorsPersonalDetailsComponent {
  @Input() form_Id: number;
  
  transporterVendorsForm: FormGroup;

  constructor(private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService,
    private _common: CommonService) { }

  ngOnInit(): void {
    this.transporterVendorsForm = this._fb.group({
      Name_of_Transporter: ['', [Validators.required]],
      Date_of_Establishment: [''],
      No_of_Own_Vehicles: ['', [Validators.required]],
      No_of_Drivers: ['', [Validators.required]],
      Nicerglobe_Registration: ['']
    });

    this._registration.getFormData(this.form_Id, 'TransportVendorPersonalData').subscribe({
      next: (res) => {
        if (res) {
          this.transporterVendorsForm.patchValue(res);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
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
    else {
      this.transporterVendorsForm.markAllAsTouched();
      return false;
    }
  }

  // Get Transport Vendor Personal Data, calls by layout component
  getTransportVendorPersonalData() {
    let transportVendorPersonalData = new TransportVendorPersonalData();
    transportVendorPersonalData = this.transporterVendorsForm.value;
    transportVendorPersonalData.Id = 0;
    transportVendorPersonalData.Form_Id = parseInt(sessionStorage.getItem('Form_Id'));
    return transportVendorPersonalData;
  }

}
