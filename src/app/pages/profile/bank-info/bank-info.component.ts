import { Component, Input, OnInit } from '@angular/core';
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
  @Input() formId: number = 17;
  bankDetail: Bank_Detail = new Bank_Detail();

  constructor(private _registration: RegistrationService,
    private _commonService: CommonService,) { }

  ngOnInit(): void {
    this._registration.getFormData(this.formId, "BankDetail").subscribe({
      next: (res) => {
        if (res) {
          this.bankDetail = res as Bank_Detail;
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

}
