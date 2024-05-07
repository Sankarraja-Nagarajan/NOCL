import { Component, Input, OnInit } from '@angular/core';
import { VendorBranch } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { ConfirmationDialogComponent } from '../../../Dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-branch-info',
  templateUrl: './branch-info.component.html',
  styleUrls: ['./branch-info.component.scss']
})
export class BranchInfoComponent implements OnInit {
  //@Input() formId: number = 17;
  vendorBranches: VendorBranch[] = [];
  vendorInfo:any;
  formId:number;
  constructor(private _commonService: CommonService,
    private _registration: RegistrationService,
    private _dialog:MatDialog) { }

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo    = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.getMasterData();
    
  }
  getMasterData(){
    this._registration.getFormData(this.formId, "VendorBranches").subscribe({
      next: (res) => {
        if (res) {
          this.vendorBranches = res as VendorBranch[];
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
  deleteBranch(){
    const DIALOGREF = this._dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      height: "200px",
      data:'delete branch'
    });
    DIALOGREF.afterClosed().subscribe({
      next:(res)=>{
        if(res){
          
        }
      }
    });
  }
}
