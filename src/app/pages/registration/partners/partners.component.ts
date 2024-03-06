import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})


export class PartnersComponent {

  data = [
    {
      Name: 'Exalca',
      PercentageShare: '20%'
    }
  ];
  dataSource = new MatTableDataSource(this.data);

  displayedColumns: string[] = [
   'name',
   'percentageShare',
   'action'
  ];

  partnersForm:FormGroup

  constructor(private _fb:FormBuilder){

    this.partnersForm=_fb.group({
      Id: [''],
      Form_Id: [''],
      Name:['',Validators.required],
      PercentageShare:['',Validators.required],
    })
  }

  addPartners(){
    if (this.partnersForm.valid) {
      this.data.push(this.partnersForm.value);
      this.dataSource = new MatTableDataSource(this.data);
      this.partnersForm.reset();
    }
    else{
      this.partnersForm.markAllAsTouched();
    }
  }

  removePartners(i){
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}
