import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AnnualTurnOver } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: "ngx-annual-turnover",
  templateUrl: "./annual-turnover.component.html",
  styleUrls: ["./annual-turnover.component.scss"],
})
export class AnnualTurnoverComponent implements OnInit{
  @Input() form_Id: number;
  
  annualTurnOver:AnnualTurnOver[]=[];
  dataSource = new MatTableDataSource(this.annualTurnOver);
  displayedColumns: string[] = [
    "year",
    "salesturnover",
    "operatingprofit",
    "netprofit",
    "action",
  ];
  turnoverForm:FormGroup
  years: number[] = [];
  role: string = "";

  constructor(private _fb:FormBuilder, 
    private _commonService:CommonService,
    private _registration:RegistrationService){

    this.turnoverForm=_fb.group({
      Year:['',Validators.required],
      SalesTurnOver:[''],
      OperatingProfit:[''],
      NetProfit:['']
    })
  }
  ngOnInit(): void {
    this.generateYears();

    // Get Annual turn overs data by form Id
    this._registration.getFormData(this.form_Id, 'AnnualTurnOvers').subscribe({
      next: (res) => {
        if (res) {
          this.annualTurnOver = res;
          this.dataSource = new MatTableDataSource(this.annualTurnOver);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
    
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  addTurnover() {
    if (this.turnoverForm.valid) {
      this.annualTurnOver.push(this.turnoverForm.value);
      this.dataSource._updateChangeSubscription();
      this.turnoverForm.reset();
    } else {
      this.turnoverForm.markAllAsTouched();
    }
  }

  removeTurnover(i) {
    this.annualTurnOver.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  //generate last 5 years for year
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
  }

  //validations
  keyPressValidation(event: Event, type: string) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the annualTurnOver array has at least one value
  isValid() {
    if (this.annualTurnOver.length > 0) {
      return true;
    } else {
      this.turnoverForm.markAllAsTouched();
      return false;
    }
  }

  // Get annualTurnOver array, calls by layout component
  getAnnualTurnOvers() {
    this.annualTurnOver.forEach((element) => {
      element.TurnOver_Id = element.TurnOver_Id ? element.TurnOver_Id : 0;
      element.Form_Id = this.form_Id;
    });
    return this.annualTurnOver;
  }
}
