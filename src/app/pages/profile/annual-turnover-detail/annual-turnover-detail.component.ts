import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AnnualTurnOver } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../Dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'ngx-annual-turnover-detail',
  templateUrl: './annual-turnover-detail.component.html',
  styleUrls: ['./annual-turnover-detail.component.scss']
})
export class AnnualTurnoverDetailComponent implements OnInit {
  @Input() formId: number = 17;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "year",
    "salesturnover",
    "operatingprofit",
    "netprofit",
    "action",
  ];

  constructor(private _commonService: CommonService,
    private _registration: RegistrationService,
    private _dialog:MatDialog) {

  }

  ngOnInit(): void {
    this._registration.getFormData(this.formId, "AnnualTurnOvers").subscribe({
      next: (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res as AnnualTurnOver[]);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  removeTurnover(i:number){
    const DIALOGREF = this._dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      height: "200px",
      data:'delete annual turnover'
    });
    DIALOGREF.afterClosed().subscribe({
      next:(res)=>{
        if(res){
          
        }
      }
    });
  }
}