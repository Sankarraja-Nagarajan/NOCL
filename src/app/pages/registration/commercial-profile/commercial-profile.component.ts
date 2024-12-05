import { Component, Input, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommercialProfile } from "../../../Models/Dtos";
import { AppConfigService } from "../../../Services/app-config.service";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { CommonService } from "../../../Services/common.service";
import { EmitterService } from "../../../Services/emitter.service";
import { getSession } from "../../../Utils";

@Component({
  selector: "ngx-commercial-profile",
  templateUrl: "./commercial-profile.component.html",
  styleUrls: ["./commercial-profile.component.scss"],
})
export class CommercialProfileComponent {
  @Input() form_Id: number;
  @Input() v_Id: number;
  @Input() isReadOnly: boolean;

  commercialProfileForm: FormGroup;
  commercialId: number = 0;
  msmeTypes: string[] = [];
  reqDoctypes: string[] = [];
  documents: string = "";
  authResponse: AuthResponse;
  astheriskRequired: boolean = false;
  msmedisabled: boolean = true;
  MSMEindex: number;
  hideGSTIN: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _config: AppConfigService,
    private _registration: RegistrationService,
    private _common: CommonService,
    private emitterService: EmitterService
  ) { }

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
      MSME_Number: [
        "",
        Validators.pattern("^(UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7})+$"),
      ],
      ServiceCategory: [""],
      Is_MSME_Type: [true, Validators.required],
    });

    this.authResponse = JSON.parse(getSession("userDetails"));
    if (this.isReadOnly) {
      this.commercialProfileForm.disable();
    }

    if (this.v_Id != 5) {
      this.commercialProfileForm
        .get("PAN")
        .addValidators([Validators.required]);
    }
    if (this.v_Id == 1 || this.v_Id == 2) {
      this.commercialProfileForm
        .get("MSME_Type")
        .addValidators(Validators.required);
      this.commercialProfileForm
        .get("MSME_Number")
        .addValidators(Validators.required);
      this.astheriskRequired = true;

      // this.commercialProfileForm.get("Is_MSME_Type").patchValue(true);
      // this.commercialProfileForm.get("Is_MSME_Type").disable();
    }

    this.commercialProfileForm.get("Is_MSME_Type").valueChanges.subscribe({
      next: (res) => {
        if (res) {
          this.commercialProfileForm
            .get("MSME_Type")
            .addValidators(Validators.required);
          this.commercialProfileForm
            .get("MSME_Number")
            .addValidators(Validators.required);
          this.commercialProfileForm.updateValueAndValidity();
          this.astheriskRequired = true;
        }
        else {
          this.commercialProfileForm
            .get("MSME_Type")
            .removeValidators(Validators.required);
          this.commercialProfileForm
            .get("MSME_Number")
            .removeValidators(Validators.required);
          this.commercialProfileForm.updateValueAndValidity();
          this.astheriskRequired = false;
        }
      },
    });

    this.msmeTypes = this._config.get("MSME_Types").split(",");

    // Get Form data by form Id
    this._registration
      .getFormData(this.form_Id, "CommercialProfile")
      .subscribe({
        next: (res) => {
          if (res) {
            this.commercialId = (res as CommercialProfile).Id;
            this.commercialProfileForm.patchValue(res);
          }
        },
        error: (err) => { },
      });

    this.emitterService.gstinValue.subscribe((gstin) => {
      this.commercialProfileForm.get("GSTIN").patchValue(gstin);
    });
    this.emitterService.gstVenClass.subscribe((isRegistered: boolean) => {
      if (this.v_Id == 4) {
        this.hideGSTIN = isRegistered;
      }
    });
  }

  // Make sure the Commercial Profile Form is valid
  isValid() {
    if (this.commercialProfileForm.valid) {
      return true;
    } else {
      this.commercialProfileForm.markAllAsTouched();
      this._common.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get commercial Profile data, calls by layout component
  getCommercialProfile() {
    let commercialProfile = new CommercialProfile();
    commercialProfile = this.commercialProfileForm.value;
    commercialProfile.Id = this.commercialId ? this.commercialId : 0;
    commercialProfile.Form_Id = this.form_Id;
    return commercialProfile;
  }

  changeOptions() {
    this.reqDoctypes = this._config.get("Required_Attachments").split(",");
    if (!this.commercialProfileForm.get("Is_MSME_Type").value) {
      this.commercialProfileForm.get("MSME_Type").disable();
      this.commercialProfileForm.get("MSME_Number").disable();
      this.msmedisabled = false;
      this.MSMEindex = this.reqDoctypes.indexOf("MSME");
      if (this.MSMEindex != -1) {
        this.reqDoctypes.splice(this.MSMEindex, 1);
        this.documents = this.reqDoctypes.join(",");
        this._config.updateConfigValue("Required_Attachments", this.documents);
        const value = this._config.get("Required_Attachments").split(",");
        this.updateRequireDocument(value);
      }
    } else {
      this.commercialProfileForm.get("MSME_Type").enable();
      this.commercialProfileForm.get("MSME_Number").enable();
      this.msmedisabled = true;
      this.MSMEindex = this.reqDoctypes.indexOf("MSME");
      if (this.MSMEindex == -1) {
        this.reqDoctypes.push("MSME");
        this.documents = this.reqDoctypes.join(",");
        this._config.updateConfigValue("Required_Attachments", this.documents);
        const value = this._config.get("Required_Attachments").split(",");
        this.updateRequireDocument(value);
      }
    }
    this.isMSMERequired();
  }

  updateRequireDocument(value: string) {
    this.emitterService.emitRequiredDocument(value);
  }

  isMSMERequired() {
    const selectedMSME = this.commercialProfileForm.value.Is_MSME_Type;
    this.emitterService.emitIsMSMEValue(selectedMSME);
  }
}
