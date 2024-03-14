import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AnnualTurnOver } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';

@Component({
  selector: 'ngx-annual-turnover',
  templateUrl: './annual-turnover.component.html',
  styleUrls: ['./annual-turnover.component.scss']
})
export class AnnualTurnoverComponent implements OnInit{
  annualTurnOver:AnnualTurnOver[]=[];
  dataSource = new MatTableDataSource(this.annualTurnOver);

  displayedColumns: string[] = [
   'year',
   'salesturnover',
   'operatingprofit',
   'netprofit',
   'action'
  ];

  turnoverForm:FormGroup
  formId: number = 1;
  years: number[] = [];

  constructor(private _fb:FormBuilder, private _commonService:CommonService){

    this.turnoverForm=_fb.group({
      Year:['',Validators.required],
      SalesTurnOver:[''],
      OperatingProfit:[''],
      NetProfit:['']
    })
  }
  ngOnInit(): void {
    this.generateYears();
  }

  addTurnover(){
    if (this.turnoverForm.valid) {
      this.annualTurnOver.push(this.turnoverForm.value);
      this.dataSource._updateChangeSubscription();
      this.turnoverForm.reset();
    }
    else{
      this.turnoverForm.markAllAsTouched();
    }
  }

  removeTurnover(i){
    this.annualTurnOver.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  //generate last 5 years for year
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear-5; year--) {
      this.years.push(year);
    }
  }

  //validations
  keyPressValidation(event:Event, type:string){
    return this._commonService.KeyPressValidation(event,type);
  }

    // Make sure the annualTurnOver array has at least one value
    isValid() {
      if (this.annualTurnOver.length > 0) {
        return true;
      }
      else{
        this.turnoverForm.markAllAsTouched();
        return false;
      }
    }
  
    // Get annualTurnOver array, calls by layout component
    getAnnualTurnOvers() {
      this.annualTurnOver.forEach((element) => {
        element.TurnOver_Id = 0;
        element.Form_Id = this.formId;
      });
      return this.annualTurnOver;
    }
}
