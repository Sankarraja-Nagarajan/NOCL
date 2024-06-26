import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Address, Region } from "../../../Models/Dtos";
import { RegistrationService } from "../../../Services/registration.service";
import { AddressType, Country } from "../../../Models/Master";
import { forkJoin } from "rxjs";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { MasterService } from "../../../Services/master.service";
import { CommonService } from "../../../Services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../../Dialogs/confirmation-dialog/confirmation-dialog.component";
import { getSession } from "../../../Utils";

@Component({
  selector: "ngx-address-profile",
  templateUrl: "./address-profile.component.html",
  styleUrls: ["./address-profile.component.scss"],
})
export class AddressProfileComponent implements OnInit {
  //@Input() formId: number = 17;
  @Output() hasAddress: EventEmitter<boolean> = new EventEmitter();

  role: string;
  addresses: Address[] = [];
  addressTypes: AddressType[] = [];
  countries: Country[] = [];
  regions: Region[] = [];
  formId:number;
  vendorInfo: any;

  constructor(
    private _registration: RegistrationService,
    private _master: MasterService,
    private _commonService: CommonService,
    private _dialog: MatDialog,
    
  ) {}

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo    = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.role = getSession("userDetails")['Role'];

    this.getMasterData();

  }

  getAddressTypeById(addressTypeId: number): string {
    const type = this.addressTypes.find(
      (type) => type.Address_Type_Id === addressTypeId
    );
    return type ? type.Address_Type : "";
  }

  getRegionById(regionId: number): string{
    const region = this.regions.find(
      (region) => region.Id === regionId
    );
    return region ? region.Name : "";
  }

  getCoountryByCode(countryCode: string): string{
    const country = this.countries.find(
      (country) => country.Code === countryCode
    );
    return country ? country.Name : "";
  }

  getMasterData() {
    
    forkJoin([
      this._master.getAddressTypes(),
      this._master.getRegion(),
      this._master.getCountry(),
      this._registration.getFormData(this.formId, "Addresses"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.addressTypes = res[0] as AddressType[];
        }
        if(res[1]){
          this.regions = res[1] as Region[];
        }
        if(res[2]){
          this.countries = res[2] as Country[];
        }
        if (res[3]) {
          this.addresses = res[3] as Address[];
        }
        this.hasAddress.emit(this.addresses.length!=0);
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
    
  }

  deleteAddress() {
    const DIALOGREF = this._dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      height: "200px",
      data: "delete address",
    });
    DIALOGREF.afterClosed().subscribe({
      next: (res) => {
        if (res) {
        }
      },
    });
  }
}
