import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() hasTransportVendorDetails: EventEmitter<any> = new EventEmitter();

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
  getMasterData() {
    this._registration.getFormData(this.formId, "TransportVendorPersonalData").subscribe({
      next: (res) => {
        if (res) {
          console.log("Tvp:", this.tansportVendor);
          this.tansportVendor = res as TransportVendorPersonalData;
          this.hasTransportVendorDetails.emit(true);
        }
        else{
          this.hasTransportVendorDetails.emit(false);
        }
      },
      error: (err) => {
        console.log(err);
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
        this.hasTransportVendorDetails.emit(true);
      },
    });

  }
}
