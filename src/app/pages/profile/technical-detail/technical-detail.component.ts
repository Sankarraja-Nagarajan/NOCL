import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../Dialogs/confirmation-dialog/confirmation-dialog.component';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { TechnicalProfile } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { MasterService } from '../../../Services/master.service';
import { RegistrationService } from '../../../Services/registration.service';
import { getSession } from '../../../Utils';

@Component({
  selector: 'ngx-technical-detail',
  templateUrl: './technical-detail.component.html',
  styleUrls: ['./technical-detail.component.scss']
})
export class TechnicalDetailComponent implements OnInit {
  //@Input() formId: number = 17;
  @Output() hasTechDetails: EventEmitter<any> = new EventEmitter();

  technicalProfileForm: FormGroup;
  technicalProfile: TechnicalProfile = new TechnicalProfile();
  isEditBtn:boolean=true;
  vendorInfo:any;
  formId:number;
  role: string;
  constructor(private _registration: RegistrationService,
    private _commonService: CommonService,
    private _dialog:MatDialog,
    private _fb: FormBuilder,) {}

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo    = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.technicalProfileForm = this._fb.group({
      Is_ISO_Certified: [false],
      Other_Qms_Certified: [false],
      Planning_for_Qms: [false],
      Is_Statutory_Provisions_Adheard: [false],
      Initiatives_for_Development: [""],
    });

    this.getTechnicalProfile();
    this.technicalProfileForm.disable();
    this.role = getSession("userDetails")['Role'];
  }

  getTechnicalProfile(){
    this._registration.getFormData(this.formId, "TechnicalProfile").subscribe({
      next:(res)=>{
        if(res){
          this.technicalProfile = res as TechnicalProfile;
          this.technicalProfileForm.patchValue(this.technicalProfile);
          this.hasTechDetails.emit(true);
        }
        else{
          this.hasTechDetails.emit(false);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
    
  }

  editTechProfile(){
    this.isEditBtn = !this.isEditBtn;
    this.technicalProfileForm.enable();
  }

  updateTechProfile(){
    this.isEditBtn = !this.isEditBtn;
    this.technicalProfileForm.disable();
  }
}
