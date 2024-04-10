import { Component, Input, OnInit } from '@angular/core';
import { CommercialProfile } from '../../../Models/Dtos';
import { MatDialog } from '@angular/material/dialog';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from '../../../Models/authModel';
import { AppConfigService } from '../../../Services/app-config.service';

@Component({
  selector: 'ngx-commercial-detail',
  templateUrl: './commercial-detail.component.html',
  styleUrls: ['./commercial-detail.component.scss']
})
export class CommercialDetailComponent implements OnInit {
  @Input() formId: number = 17;
  msmeTypes: string[] = [];
  authResponse: AuthResponse;
  astheriskRequired:boolean=false;
  commercialProfileForm: FormGroup;
  commercialProfile: CommercialProfile = new CommercialProfile();
  isEditBtn:boolean=true;

  constructor(private _registration: RegistrationService,
    private _commonService: CommonService,
    private _dialog:MatDialog,
    private _fb: FormBuilder,
    private _config: AppConfigService) {}

  ngOnInit(): void {
    this.commercialProfileForm = this._fb.group({
      Financial_Credit_Rating: [""],
      Agency_Name: [""],
      PAN: [
        "",
        [
          Validators.maxLength(10),
          Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$"),
        ],
      ],
      GSTIN: [
        "",
        [
          Validators.maxLength(15),
          Validators.pattern(
            "^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{2})+$"
          ),
        ],
      ],
      MSME_Type: [""],
      MSME_Number: ["",Validators.pattern(
        "^(UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7})+$"
      )],
      ServiceCategory: [""],
    });
    this.getCommercialProfile();
    this.msmeTypes = this._config.get("MSME_Types").split(",");
    this.commercialProfileForm.disable();
  }

  getCommercialProfile(){
    this._registration.getFormData(this.formId, "CommercialProfile").subscribe({
      next:(res)=>{
        if(res){
          this.commercialProfile = res as CommercialProfile;
          this.commercialProfileForm.patchValue(this.commercialProfile);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  editCommProfile(){
    this.isEditBtn = !this.isEditBtn;
    this.commercialProfileForm.enable();
  }

  updateCommProfile(){
    this.isEditBtn = !this.isEditBtn;
    this.commercialProfileForm.disable();
  }
}

