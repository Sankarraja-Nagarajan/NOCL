import { Component, Input, OnInit } from "@angular/core";
import { Address } from "../../../Models/Dtos";
import { RegistrationService } from "../../../Services/registration.service";
import { AddressType } from "../../../Models/Master";
import { forkJoin } from "rxjs";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { MasterService } from "../../../Services/master.service";
import { CommonService } from "../../../Services/common.service";

@Component({
  selector: "ngx-address-profile",
  templateUrl: "./address-profile.component.html",
  styleUrls: ["./address-profile.component.scss"],
})
export class AddressProfileComponent implements OnInit {
  @Input() formId: number = 17;
  addresses: Address[] = [];
  addressTypes: AddressType[] = [];

  constructor(
    private _registration: RegistrationService,
    private _master: MasterService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getMasterData();
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
      this._registration.getFormData(this.formId, "Addresses"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.addressTypes = res[0] as AddressType[];
        }
        if (res[1]) {
          this.addresses = res[1] as Address[];
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
}