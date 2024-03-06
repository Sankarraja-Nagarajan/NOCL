import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-annual-turnover',
  templateUrl: './annual-turnover.component.html',
  styleUrls: ['./annual-turnover.component.scss']
})
export class AnnualTurnoverComponent {
  data = [
    {
      Year: 2024,
      SalesTurnOver: 1000,
      OperatingProfit: 2000,
      NetProfit:3000
    }
  ];

  dataSource = new MatTableDataSource(this.data);

  displayedColumns: string[] = [
   'year',
   'salesturnover',
   'operatingprofit',
   'netprofit',
   'action'
  ];

  turnoverForm:FormGroup

  constructor(private _fb:FormBuilder){

    this.turnoverForm=_fb.group({
      TurnOver_Id: [''],
      Form_Id: [''],
      Year:['',Validators.required],
      SalesTurnOver:['',Validators.required],
      OperatingProfit:[''],
      NetProfit:['']
    })
  }

  addTurnover(){
    if (this.turnoverForm.valid) {
      this.data.push(this.turnoverForm.value);
      this.dataSource = new MatTableDataSource(this.data);
      this.turnoverForm.reset();
    }
    else{
      this.turnoverForm.markAllAsTouched();
    }
  }

  removeTurnover(i){
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}
