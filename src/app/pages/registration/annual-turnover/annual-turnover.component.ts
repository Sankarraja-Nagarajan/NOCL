import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AnnualTurnOver } from '../../../Models/Dtos';

@Component({
  selector: 'ngx-annual-turnover',
  templateUrl: './annual-turnover.component.html',
  styleUrls: ['./annual-turnover.component.scss']
})
export class AnnualTurnoverComponent {
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

  constructor(private _fb:FormBuilder){

    this.turnoverForm=_fb.group({
      Year:['',Validators.required],
      SalesTurnOver:[''],
      OperatingProfit:[''],
      NetProfit:['']
    })
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

    // Make sure the annualTurnOver array has at least one value
    isValid() {
      if (this.annualTurnOver.length > 0) {
        return true;
      }
      return false;
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
