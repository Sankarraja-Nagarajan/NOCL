import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../Services/login.service';

@Component({
  selector: 'ngx-transport-vendors-personal-details',
  templateUrl: './transport-vendors-personal-details.component.html',
  styleUrls: ['./transport-vendors-personal-details.component.scss']
})
export class TransportVendorsPersonalDetailsComponent {
  data = [
    {
      Name_of_Transporter: 'Exalca',
      Date_of_Establishment: '01/01/2024',
      No_of_Own_Vehicles: 10,
      No_of_Drivers: 10,
      Nicerglobe_Registration: 'registered',
    }
  ];

  TransporterVendorsForm: FormGroup;

  constructor(private _fb: FormBuilder,private _services: LoginService,) {}

  ngOnInit(): void {
    this.TransporterVendorsForm = this._fb.group({
      Id: [''],
      Form_Id: [''],
      Name_of_Transporter: [''],
      Date_of_Establishment: [''],
      No_of_Own_Vehicles: [''],
      No_of_Drivers: [''],
      Nicerglobe_Registration: ['']
    });
  }

  checkNumber(e: KeyboardEvent) {
    this._services.numberOnly(e);
  }

}
