import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { Address, Region, TaxPayerAddress } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { AddressType, Country } from "../../../Models/Master";
import { MasterService } from "../../../Services/master.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { forkJoin } from "rxjs";
import { getSession, isArrayEmpty, isNullOrEmpty } from "../../../Utils";

@Component({
  selector: "ngx-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
})
export class AddressComponent implements OnInit, OnChanges {
  @Input() form_Id: number;
  @Input() gstAddress: TaxPayerAddress[] = [];
  addresses: Address[] = [];
  Countries: Country[] = [];
  Regions: Region[] = [];
  role: string = "";
  regionsForSelectedCountry: any;

  dataSource = new MatTableDataSource(this.addresses);
  displayedColumns: string[] = [
    "addressType_id",
    "houseno",
    "street_2",
    "street_3",
    "street_4",
    "district",
    "postalcode",
    "city",
    "country",
    "region",
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
      House_No: ["", [Validators.required, Validators.maxLength(60)]],
      Street_2: ["", [Validators.required, Validators.maxLength(40)]],
      Street_3: ["", [Validators.required, Validators.maxLength(40)]],
      Street_4: ["", [Validators.required, Validators.maxLength(40)]],
      District: ["", [Validators.maxLength(35)]],
      Postal_Code: ["", [Validators.required,Validators.maxLength(10)]],
      City: ["", [Validators.required,Validators.maxLength(35)]],
      Country_Code: ["", [Validators.required, Validators.maxLength(3)]],
      Region_Id: ["", [Validators.required]],
      Tel: ["", [Validators.maxLength(20)]],
      Fax: ["", [Validators.maxLength(20)]],
      Website: ["", [Validators.maxLength(100)]],
    });

    // get address types and addresses by form Id
    this.getMasterData();
    const userData = JSON.parse(getSession("userDetails"));
    this.role = userData ? userData.Role : "";

    this.getCountryAndRegion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.gstAddress && this.gstAddress && this.gstAddress.length > 0) {
      this.gstAddress.forEach((element) => {
        let address = new Address();
        address.Address_Id = 0;
        address.Form_Id = this.form_Id;
        address.Address_Type_Id = 1;
        address.House_No = element.House_No;
        address.Street_2 = element.Street_2;
        address.Street_3 = element.Street_3;
        address.Street_4 = element.Street_4;
        address.City = element.City;
        address.District = element.District;
        address.Postal_Code = element.Postal_Code;
        this.dataSource.data.push(address);
      });
      this.dataSource._updateChangeSubscription();
      console.log(this.dataSource);
    }
  }

  // Allow (numbers, plus, and space) for Tel & Fax
  keyPressValidation(event) {
    return this._commonService.KeyPressValidation(event, "tel");
  }

  // Add address to the table
  addAddress() {
    if (this.addressForm.valid) {
      let address = new Address();
      address = this.addressForm.value;
      const Name = this.Countries.filter((x) => x.Code == address.Country_Code);
      address.Country_Name = !isArrayEmpty(Name) ? Name[0].Name : "";
      const Region = this.Regions.filter((x) => x.Id == address.Region_Id);
      address.Region_Name = !isArrayEmpty(Region) ? Region[0].Name : "";
      this.dataSource.data.push(address);
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
    console.log(this.editIndex, this.addressForm);
    if (this.editIndex >= 0) {
      if(this.addressForm.valid){
        let id = this.dataSource.data[this.editIndex].Address_Id;
        this.dataSource.data[this.editIndex] = this.addressForm.value;
        this.dataSource.data[this.editIndex].Address_Id = id;
        const Name = this.Countries.filter((x) => x.Code == this.addressForm.value.Country_Code);
        this.dataSource.data[this.editIndex].Country_Name = !isArrayEmpty(Name) ? Name[0].Name : "";
        const Region = this.Regions.filter((x) => x.Id == this.addressForm.value.Region_Id);
        this.dataSource.data[this.editIndex].Region_Name = !isArrayEmpty(Region) ? Region[0].Name : "";
        this.dataSource._updateChangeSubscription();
        this.addressForm.reset();
        this.editIndex = -1;
      }
      else {
        this.addressForm.markAllAsTouched();
      }
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
      let isCountryRegion = false;
      this.dataSource.data.forEach((ele) => {
        if (isNullOrEmpty(ele.Country_Code) || isNullOrEmpty(ele.Region_Id)) {
          isCountryRegion = true;
        }
      });
      if (isCountryRegion) {
        this._commonService.openSnackbar(
          "Please update Country and Region in the address",
          snackbarStatus.Danger
        );
        return false;
      }
      return true;
    } else {
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

  getCountryAndRegion() {
    forkJoin([this._master.getCountry(), this._master.getRegion()]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.Countries = res[0] as Country[];
        }
        if (res[1]) {
          this.Regions = res[1] as Region[];
        }
      },
      error: (err) => {},
    });
  }

  onChange(event: any) {
    this.regionsForSelectedCountry = this.Regions.filter(
      (region) => region.Country_Code === event
    );
  }
}
