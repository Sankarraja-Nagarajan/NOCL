import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-tanker-details',
  templateUrl: './tanker-details.component.html',
  styleUrls: ['./tanker-details.component.scss']
})
export class TankerDetailsComponent {
  data = [
    {
      Tanker_Type: 'Exalca02',
      Capacity_of_Tanker: '500L'
    }
  ];
  dataSource = new MatTableDataSource(this.data);

  displayedColumns: string[] = [
   'tankerType',
   'capacityOfTanker',
   'action'
  ];

  TankerDetailsForm:FormGroup

  constructor(private _fb:FormBuilder){

    this.TankerDetailsForm=_fb.group({
      Id: [''],
      Form_Id: [''],
      Tanker_Type:['',Validators.required],
      Capacity_of_Tanker:[''],
    })
  }

  addTanker(){
    if (this.TankerDetailsForm.valid) {
      this.data.push(this.TankerDetailsForm.value);
      this.dataSource = new MatTableDataSource(this.data);
      this.TankerDetailsForm.reset();
    }
    else{
      this.TankerDetailsForm.markAllAsTouched();
    }
  }

  removeTanker(i){
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}
