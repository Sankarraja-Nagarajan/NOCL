import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  data = [
    {
      Address: 'First Floor, Kumar Enclave Eripalayam, Tirupur, Main road, Udumalaipettai, Tamil Nadu 642126',
      Tel: '+91 804111 5686',
      Fax: '+91 804111 5686',
      Website: 'https://exalca.com/',
      AddressType_Id: '1'
    }
  ];
  dataSource = new MatTableDataSource(this.data);
  displayedColumns: string[] = [
    'addressType_id',
    'address',
    'tel',
    'fax',
    'website',
    'action'
  ];
  addressForm: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.addressForm = this._fb.group({
      Address: ['', [Validators.required]],
      Tel: ['',[Validators.maxLength(15)]],
      Fax: ['',[Validators.maxLength(15)]],
      Website: [''],
      AddressType_Id: ['',[Validators.required]]
    });
  }

  addAddress() {
    if (this.addressForm.valid) {
      this.data.push(this.addressForm.value);
      this.dataSource = new MatTableDataSource(this.data);
      this.addressForm.reset();
    }
    else{
      this.addressForm.markAllAsTouched();
    }
  }

  removeAddress(i: number) {
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}
