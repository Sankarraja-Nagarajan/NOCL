import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Address } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { AddressType } from '../../../Models/Master';
import { MasterService } from '../../../Services/master.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

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
  form_Id: number;
  addressTypes:AddressType[]=[];

  constructor(private _fb: FormBuilder,
    private _commonService: CommonService,
    private _master:MasterService) {

  }

  ngOnInit(): void {
    // address form Initialization
    this.addressForm = this._fb.group({
      Address_Type_Id: ['', [Validators.required]],
      AddressData: ['', [Validators.required]],
      Tel: ['', [Validators.maxLength(20)]],
      Fax: ['', [Validators.maxLength(20)]],
      Website: ['', [Validators.maxLength(100)]],
    });

    // get Form Id from session storage
    this.form_Id = parseInt(sessionStorage.getItem('Form_Id'));

    // get address types
    this._master.getAddressTypes().subscribe({
      next:(res)=>{
        this.addressTypes = res as AddressType[];
      },
      error:(err)=>{
        this._commonService.openSnackbar(err,snackbarStatus.Danger);
      }
    });
  }

  // Allow (numbers, plus, and space) for Tel & Fax
  keyPressValidation(event) {
    return this._commonService.KeyPressValidation(event,'tel')
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
    else{
      this.addressForm.markAllAsTouched();
      return false;
    }
  }

  // Get addresses, calls by layout component
  getAddresses() {

    this.addresses.forEach((element) => {
      element.Address_Id = 0;
      element.Form_Id = this.form_Id;
    });
    return this.addresses;
  }

  getAddressTypeById(addressTypeId: number): string {
    const type = this.addressTypes.find(type => type.Address_Type_Id === addressTypeId);
    return type ? type.Address_Type : '';
  }
}
