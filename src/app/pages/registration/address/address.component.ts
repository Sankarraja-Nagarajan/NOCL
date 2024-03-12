import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Address } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';

@Component({
  selector: 'ngx-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  addresses: Address[] = [];
  dataSource = new MatTableDataSource(this.addresses);
  displayedColumns: string[] = [
    'addressType_id',
    'address',
    'tel',
    'fax',
    'website',
    'action'
  ];
  addressForm: FormGroup;
  formId: number = 1;

  constructor(private _fb: FormBuilder,
    private _commonService: CommonService) {

  }

  ngOnInit(): void {
    // address form Initialization
    this.addressForm = this._fb.group({
      AddressType_Id: ['', [Validators.required]],
      AddressData: ['', [Validators.required]],
      Tel: ['', [Validators.maxLength(20)]],
      Fax: ['', [Validators.maxLength(20)]],
      Website: ['', [Validators.maxLength(100)]],
    });
  }

  // Allow (numbers, plus, and space) for Tel & Fax
  keyPressValidation(event) {
    return this._commonService.KeyPressValidation(event)
  }

  // Add address to the table
  addAddress() {
    if (this.addressForm.valid) {
      this.addresses.push(this.addressForm.value);
      this.dataSource._updateChangeSubscription();
      this.addressForm.reset();
    }
    else {
      this.addressForm.markAllAsTouched();
    }
  }

  // Remove Address from table
  removeAddress(i: number) {
    this.addresses.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Make sure the addresses array has at least one value
  isValid() {
    if (this.addresses.length > 0) {
      return true;
    }
    console.log('Address must be there')
    return false;
  }

  // Get addresses, calls by layout component
  getAddresses() {

    this.addresses.forEach((element) => {
      element.Address_Id = 0;
      element.Form_Id = this.formId;
    });
    return this.addresses;
  }
}
