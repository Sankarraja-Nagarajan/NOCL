import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { Address } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { AddressType } from "../../../Models/Master";
import { MasterService } from "../../../Services/master.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "ngx-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
})
export class AddressComponent implements OnInit,OnChanges {
  @Input() form_Id: number;
  @Input() gstAddress : string[]=[];
  addresses: Address[] = [];
  role: string = "";
  dataSource = new MatTableDataSource(this.addresses);
  displayedColumns: string[] = [
    "addressType_id",
    "address",
    "tel",
    "fax",
    "website",
    "action",
  ];
  addressForm: FormGroup;
  addressTypes: AddressType[] = [];
  editIndex: number = -1;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _master: MasterService,
    private _registration: RegistrationService
  ) {}

  ngOnInit(): void {
    // address form Initialization
    this.addressForm = this._fb.group({
      Address_Type_Id: ["", [Validators.required]],
      AddressData: ["", [Validators.required]],
      Tel: ["", [Validators.maxLength(20)]],
      Fax: ["", [Validators.maxLength(20)]],
      Website: ["", [Validators.maxLength(100)]],
    });

    // get address types and addresses by form Id
    this.getMasterData();
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.gstAddress && this.gstAddress.length > 0) {
      this.gstAddress.forEach((element) =>{
        let address = new Address();
        address.Address_Id = 0;
        address.Form_Id = this.form_Id;
        address.Address_Type_Id = 1;
        address.AddressData = element;
        this.dataSource.data.push(address);
      });
      this.dataSource._updateChangeSubscription();
    }
  }

  // Allow (numbers, plus, and space) for Tel & Fax
  keyPressValidation(event) {
    return this._commonService.KeyPressValidation(event, "tel");
  }

  // Add address to the table
  addAddress() {
    if (this.addressForm.valid) {
      this.dataSource.data.push(this.addressForm.value);
      this.dataSource._updateChangeSubscription();
      this.addressForm.reset();
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  // Remove Address from table
  removeAddress(i: number) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Update address to the table
  updateAddress() {
    if (this.editIndex >= 0) {
      let id = this.dataSource.data[this.editIndex].Address_Id;
      this.dataSource.data[this.editIndex]=this.addressForm.value;
      this.dataSource.data[this.editIndex].Address_Id = id;
      this.dataSource._updateChangeSubscription();
      this.addressForm.reset();
      this.editIndex = -1;
    }
  }
  
  // Edit Address from table
  editAddress(i: number) {
    this.addressForm.patchValue(this.dataSource.data[i]);
    this.editIndex = i;
  }

  // Make sure the addresses array has at least one value
  isValid() {
    if (this.dataSource.data.length > 0) {
      return true;
    } else {
      console.log("address");
      this.addressForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get addresses, calls by layout component
  getAddresses() {
    this.addresses = this.dataSource.data;
    this.addresses.forEach((element) => {
      element.Address_Id = element.Address_Id ? element.Address_Id : 0;
      element.Form_Id = this.form_Id;
    });
    return this.addresses;
  }

  getAddressTypeById(addressTypeId: number): string {
    const type = this.addressTypes.find(
      (type) => type.Address_Type_Id === addressTypeId
    );
    return type ? type.Address_Type : "";
  }

  getMasterData() {
    forkJoin([
      this._master.getAddressTypes(),
      this._registration.getFormData(this.form_Id, "Addresses"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.addressTypes = res[0] as AddressType[];
        }
        if (res[1]) {
          this.addresses = res[1];
          this.dataSource = new MatTableDataSource(this.addresses);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  markAddressFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.addressForm.markAllAsTouched();
    }
  }
}
