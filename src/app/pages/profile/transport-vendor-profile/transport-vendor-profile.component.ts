import { Component } from '@angular/core';
import { RegistrationService } from '../../../Services/registration.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { TransportVendorPersonalData } from '../../../Models/Dtos';
import { MasterService } from '../../../Services/master.service';

@Component({
  selector: 'ngx-transport-vendor-profile',
  templateUrl: './transport-vendor-profile.component.html',
  styleUrls: ['./transport-vendor-profile.component.scss']
})
export class TransportVendorProfileComponent {
  vendorInfo: any;
  tansportVendor : TransportVendorPersonalData =  new TransportVendorPersonalData();
  formId: number;
  constructor(private _registration: RegistrationService, private _master: MasterService,
    private _commonService: CommonService,) { }
  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.getMasterData();

  }
  getMasterData(): void {
    this._registration.getFormData(this.formId, "TransportVendorPersonalData").subscribe({
      next: (res) => {
        if (res) {
          this.tansportVendor = res as TransportVendorPersonalData;
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });

  }
}
