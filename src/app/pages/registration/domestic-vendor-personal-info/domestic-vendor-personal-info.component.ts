import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-domestic-vendor-personal-info',
  templateUrl: './domestic-vendor-personal-info.component.html',
  styleUrls: ['./domestic-vendor-personal-info.component.scss']
})
export class DomesticVendorPersonalInfoComponent implements OnInit {
  domesticVendorForm:FormGroup;

  constructor(private _fb:FormBuilder){

  }

  ngOnInit(): void {
    this.domesticVendorForm = this._fb.group({
      OrgName:['', [Validators.required]],
      PlantInstallaitonYear:['', [Validators.required]],
      GSTIN:['']
    });
  }

  getDetails(){
    
  }
}
