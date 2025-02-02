import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { GstDetail, VendorPersonalData } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { getSession, isNullOrEmpty } from "../../../Utils";
import { MasterService } from "../../../Services/master.service";
import { forkJoin } from "rxjs";
import { GSTVenClass, Title } from "../../../Models/Master";
import { EmitterService } from "../../../Services/emitter.service";

@Component({
  selector: "ngx-vendor-personal-info",
  templateUrl: "./vendor-personal-info.component.html",
  styleUrls: ["./vendor-personal-info.component.scss"],
})
export class VendorPersonalInfoComponent implements OnInit {
  @Input() form_Id: number;
  @Input() isReadOnly: boolean;
  @Input() v_Id: number;
  @Output() gstDetail: EventEmitter<GstDetail> = new EventEmitter<GstDetail>();


  domesticVendorForm: FormGroup;
  years: number[] = [];
  titles: Title[] = [];
  GST: GSTVenClass[] = [];
  authResponse: AuthResponse;
  personalInfoId: number = 0;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService,
    private _master: MasterService,
    private emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    //Generate years for Plant Installation Year
    this.generateYears();

    // Domestic vendor personal info form initialization
    this.domesticVendorForm = this._fb.group({
      Organization_Name: ["", [Validators.required]],
      Plant_Installation_Year: ["", [Validators.required]],
      Title_Id: ["", [Validators.required]],
      GSTVenClass_Id: [""],
      GSTIN: [
        "",
        [
          Validators.pattern(
            "^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{2})+$"
          ),
        ],
      ],
    });


    this.authResponse = JSON.parse(getSession("userDetails"));
    if (this.isReadOnly) {
      this.domesticVendorForm.disable();
    }
    // Get Form data by form Id
    this._registration
      .getFormData(this.form_Id, "DomesticVendorPersonalData")
      .subscribe({
        next: (res) => {
          if (res) {
            this.personalInfoId = (res as VendorPersonalData).Personal_Info_Id;
            this.domesticVendorForm.patchValue(res);
            this.patchVendorname();
          }
        },
        error: (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      });

    this.getTitleAndGSTVenClass();
  }

  patchVendorname() {
    if (
      this.authResponse.Role.toLowerCase() == "vendor" &&
      isNullOrEmpty(this.domesticVendorForm.get("Organization_Name").value)
    ) {
      this.domesticVendorForm
        .get("Organization_Name")
        .patchValue(this.authResponse.DisplayName);
    }
  }

  getGstDetails() {
    if (
      this.domesticVendorForm.value.GSTIN &&
      this.domesticVendorForm.get("GSTIN").valid
    ) {
      this.emitterService.emitGSTIN(this.domesticVendorForm.value.GSTIN);
      this._registration
        .getGstDetails(this.domesticVendorForm.value.GSTIN)
        .subscribe({
          next: (res) => {
            if (res) {
              this.gstDetail.emit(res as GstDetail);
              this.domesticVendorForm
                .get("Organization_Name")
                .setValue(res.Name);
              this.domesticVendorForm
                .get("Plant_Installation_Year")
                .setValue(new Date(res.RegistrationDate).getFullYear());
            }
          },
          error: (err) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        });
    } else {
      this._commonService.openSnackbar(
        "Enter Valid GSTIN Number",
        snackbarStatus.Danger
      );
    }
  }

  //generate years
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  //allown only numbers for Year
  keyPressValidation(event: Event) {
    return this._commonService.KeyPressValidation(event, "number");
  }

  // Make sure the domesticVendorForm is valid
  isValid() {
    if (this.domesticVendorForm.valid) {
      return true;
    } else {
      this.domesticVendorForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get Domestic Vendor Personal Data, calls by layout component
  getDomesticVendorPersonalInfo() {
    let domesticVendorPersonalData = new VendorPersonalData();
    domesticVendorPersonalData = this.domesticVendorForm.value;
    domesticVendorPersonalData.Personal_Info_Id = this.personalInfoId
      ? this.personalInfoId
      : 0;
    domesticVendorPersonalData.Form_Id = this.form_Id;
    return domesticVendorPersonalData;
  }

  // Get Title and GSt Ven Class
  getTitleAndGSTVenClass() {
    forkJoin([
      this._master.getTitle(),
      this._master.getGSTVenClass(),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.titles = res[0] as Title[];
        }
        if (res[1]) {
          this.GST = res[1] as GSTVenClass[];
        }
      },
      error: (err) => { },
    });
  }


  isNotRegistered(): boolean {
    const selectedGSTVenClass = this.GST.find(gst => gst.Id === this.domesticVendorForm.value.GSTVenClass_Id);
    const isRegistered = selectedGSTVenClass && selectedGSTVenClass.Id !=2;
    // console.log(isRegistered)
    this.emitterService.emitRequiredAttachments(isRegistered);
    return isRegistered;
  }



}
