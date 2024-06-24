import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegistrationService } from '../../../Services/registration.service';
import { Bank_Detail } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.scss']
})
export class BankInfoComponent implements OnInit {
 // @Input() formId: number = 17;
  @Output() hasBankDetail: EventEmitter<any> = new EventEmitter();

  bankDetail: Bank_Detail = new Bank_Detail();
  vendorInfo:any;
  formId:number;
  constructor(private _registration: RegistrationService,
    private _commonService: CommonService,) { }

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo    = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.getMasterData();
   
  }
  getMasterData() {
    this._registration.getFormData(this.formId, "BankDetail").subscribe({
      next: (res) => {
        if (res) {
          this.bankDetail = res as Bank_Detail;
          this.hasBankDetail.emit(true);
        }
        else{
          this.hasBankDetail.emit(false);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
        this.hasBankDetail.emit(false);
      },
    });

  }
}
