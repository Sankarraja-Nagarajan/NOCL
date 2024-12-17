import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../../Services/master.service';
import { forkJoin } from 'rxjs';
import { Incoterms, Industry, PurchaseOrganization, ReconciliationAccount, SchemaGroup, VendorAccountGroup } from '../../../Models/Master';
import { AuthResponse } from '../../../Models/authModel';
import { AdditionalFieldsDto } from '../../../Models/Registration';
import { getSession } from '../../../Utils';
import { RegistrationService } from '../../../Services/registration.service';
import { EmitterService } from '../../../Services/emitter.service';
import { CommercialProfile } from '../../../Models/Dtos';

@Component({
  selector: 'ngx-additional-fields',
  templateUrl: './additional-fields.component.html',
  styleUrls: ['./additional-fields.component.scss']
})
export class AdditionalFieldsComponent implements OnInit {
  @Input() form_Id: number;
  @Input() v_Id: number;

  additionalFieldsForm: FormGroup;
  Industries: Industry[] = [];
  Incoterms: Incoterms[] = [];
  Reconciliation: ReconciliationAccount[] = [];
  SchemaGroup: SchemaGroup[] = [];
  PurchaseOrganizations: PurchaseOrganization[] = [];
  VendorAccountGroups: VendorAccountGroup[] = [];
  authResponse: AuthResponse;
  additionalDto: AdditionalFieldsDto;
  
  industryUpdate;
  commercialProfile: CommercialProfile[];

  constructor(
    private _fb: FormBuilder,
    private _master: MasterService,
    private _registration: RegistrationService,
    private _emitterService: EmitterService
  ) { }


  ngOnInit() {
    this.authResponse = JSON.parse(getSession("userDetails"));

    this.additionalFieldsForm = this._fb.group({
      Language: ["EN"],
      Order_Currency: ["INR"],
      Industry_Id: ["", [Validators.required]],
      Incoterms_Id: [""],
      Reconciliation_Id: ["", [Validators.required]],
      Schema_Id: [""],
      GrBased: ["X", [Validators.required]],
      SrvBased: ["X", [Validators.required]],
      Search_Term: ["", [Validators.required]],
      PO_Code: [""],
      AccountGroup_Id: ["", [Validators.required]]
    });

    if (this.authResponse.Role.includes('PO')) {
      this.additionalFieldsForm.enable();
    }
    else {
      this.additionalFieldsForm.disable();
    }

    this.getMasterData();
    this.getAdditionalFields();
  }


  ngAfterViewInit() {
    this.getMasterData();
  }


  getMasterData() {
    forkJoin([
      this._master.getIndustry(),
      this._master.getIncoterms(),
      this._master.getReconciliationAccounts(),
      this._master.getSchemaGroups(),
      this._master.getPurchaseOrganization(),
      this._master.getAccountGroup(),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.Industries = res[0] as Industry[];
          this.loadData();
        }
        if (res[1]) {
          this.Incoterms = res[1] as Incoterms[];
        }
        if (res[2]) {
          this.Reconciliation = res[2] as ReconciliationAccount[];
        }
        if (res[3]) {
          this.SchemaGroup = res[3] as SchemaGroup[];
        }
        if (res[4]) {
          this.PurchaseOrganizations = res[4] as PurchaseOrganization[];
        }
        if (res[5]) {
          this.VendorAccountGroups = res[5] as VendorAccountGroup[];
        }
      },
      error: (err) => { },
    });
  }


  getAllAdditionalData() {
    let additionalDto = new AdditionalFieldsDto();
    additionalDto = this.additionalFieldsForm.value;
    additionalDto.Form_Id = this.form_Id;
    additionalDto.Id = 0;
    if (this.authResponse?.Role.includes('PO')) {
      if (this.additionalFieldsForm.valid) {
        return additionalDto;
      }
      else {
        this.additionalFieldsForm.markAllAsTouched();
      }
    }
    else {
      return additionalDto;
    }

  }

  checkRoleAndFormValid() {
    if (this.authResponse?.Role.includes('PO')) {
      if (this.additionalFieldsForm.valid) {
        return true;
      }
      else {
        this.additionalFieldsForm.markAllAsTouched();
        return false;
      }
    }
    else {
      return true;
    }
  }


  getAdditionalFields() {
    this._registration.getFormData(this.form_Id, "AdditionalFields").subscribe({
      next: (res) => {
        this.additionalFieldsForm.patchValue(res);
      }
    });
  }



  loadData() {
    this._registration.getFormData(this.form_Id,"CommercialProfile").subscribe({
      next:(res)=>{
        this.commercialProfile=res as CommercialProfile[];
        if(res.Is_MSME_Type == true){
          this.checkAndPatchIndustry(true);
        }
        else{
          this.checkAndPatchIndustry(false);
        }
      }
    })
  }



  checkAndPatchIndustry(isMSME: boolean) {
    let industryCode = isMSME ? 'SSI' : 'OTHR';
    this.industryUpdate = this.Industries.find(industry => industry.Code === industryCode);
    if (this.industryUpdate) {
      this.additionalFieldsForm.patchValue({
        Industry_Id: this.industryUpdate.Id
      });
    }
  }

}
