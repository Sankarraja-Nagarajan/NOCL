import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MajorCustomer,
  NocilRelatedEmployee,
  Subsideries,
  VendorOrganizationProfile,
} from "../../../Models/Dtos";
import { MatDialog } from "@angular/material/dialog";
import { CompanyStatus, OrganizationType } from "../../../Models/Master";
import { MasterService } from "../../../Services/master.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { forkJoin } from "rxjs";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { CommonAddDataDialogComponent } from "../../../Dialogs/common-add-data-dialog/common-add-data-dialog.component";
import { getSession } from "../../../Utils";
import { AppConfigService } from "../../../Services/app-config.service";
import { EmitterService } from "../../../Services/emitter.service";

@Component({
  selector: "ngx-vendor-org-profile",
  templateUrl: "./vendor-org-profile.component.html",
  styleUrls: ["./vendor-org-profile.component.scss"],
})
export class VendorOrgProfileComponent implements OnInit, AfterViewInit {
  @Input() form_Id: number;
  @Input() isReadOnly: boolean;
  @Output() havePartner = new EventEmitter<boolean>();
  @Input() v_Id: number;


  vendorOrgForm: FormGroup;
  subsideriesList: Subsideries[] = [];
  listOfMajorCustomerList: MajorCustomer[] = [];
  orgTypes: OrganizationType[] = [];
  companyStatuses: CompanyStatus[] = [];
  authResponse: AuthResponse;
  orgProfileId: number = 0;
  isAnnualProdShown: boolean = false;
  nocilRelatedEmployees: NocilRelatedEmployee[] = [];
  isNocilEmployeeRelated: boolean = false;
  impOrgTypes: string[] = [];

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _master: MasterService,
    private _common: CommonService,
    private _registration: RegistrationService,
    private _config: AppConfigService,
    private emitterService: EmitterService
  ) { }


  ngOnInit(): void {
    this.vendorOrgForm = this._fb.group({
      Type_of_Org_Id: ["", Validators.required],
      Status_of_Company_Id: ["", Validators.required],
      RelationToNocil: [false],
      Subsideries: [null],
      Annual_Prod_Capacity: [0],
      Unit: [""],
    });

    this.authResponse = JSON.parse(getSession("userDetails"));
    if (this.isReadOnly) {
      this.vendorOrgForm.disable();
    }
    // get master data
    this.getAllMasters();
  }

  ngAfterViewInit(): void {
    this.valueChangeEvents();
  }

  valueChangeEvents() {
    this.vendorOrgForm.get("Type_of_Org_Id").valueChanges.subscribe({
      next: (res) => {
        if (res == 1 && this.v_Id == 5) {
          this.emitterService.emitIsManufacturer(true);
        }
        else {
          this.emitterService.emitIsManufacturer(false);
        }
        if (res == 1) {
          this.vendorOrgForm
            .get("Annual_Prod_Capacity")
            .addValidators([Validators.required]);
          this.vendorOrgForm
            .get("Annual_Prod_Capacity")
            .updateValueAndValidity();
          this.vendorOrgForm.get("Unit").addValidators([Validators.required]);
          this.vendorOrgForm.get("Unit").updateValueAndValidity();
          this.isAnnualProdShown = true;
        } else {
          this.vendorOrgForm.get("Annual_Prod_Capacity").clearValidators();
          this.vendorOrgForm
            .get("Annual_Prod_Capacity")
            .updateValueAndValidity();
          this.vendorOrgForm.get("Unit").clearValidators();
          this.vendorOrgForm.get("Unit").updateValueAndValidity();
          this.isAnnualProdShown = false;
        }
      },
    });

    this.vendorOrgForm.get("Status_of_Company_Id").valueChanges.subscribe({
      next: (res) => {
        if (res == 2 || res == 4) {
          this.havePartner.emit(true);
        } else this.havePartner.emit(false);
      },
    });

    this.vendorOrgForm.get("RelationToNocil").valueChanges.subscribe({
      next: (res) => {
        if (res) {
          this.isNocilEmployeeRelated = true;
          this.vendorOrgForm
            .get("RelationToNocil")
            .addValidators([Validators.required]);
        } else {
          this.isNocilEmployeeRelated = false;
          this.vendorOrgForm.get("RelationToNocil").clearValidators();
          this.nocilRelatedEmployees = [];
        }
      },
    });
  }

  emitPartnerStatus(bool) {
    this.havePartner.emit(bool);
  }

  // Make sure the Vendor Organization Profile Form is valid
  isValid() {
    if (this.vendorOrgForm.valid) {
      if (
        !this.vendorOrgForm.value.RelationToNocil ||
        (this.vendorOrgForm.value.RelationToNocil &&
          this.nocilRelatedEmployees.length > 0)
      ) {
        return true;
      } else {
        this._common.openSnackbar(
          "Add NOCIL Related Employee",
          snackbarStatus.Danger
        );
        return false;
      }
    } else {
      this.vendorOrgForm.markAllAsTouched();
      this._common.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get Vendor Organization Profile data, calls by layout component
  getDomesticVendorOrgProfile() {
    let vendorOrganizationProfile = new VendorOrganizationProfile();
    vendorOrganizationProfile = this.vendorOrgForm
      .value as VendorOrganizationProfile;
    vendorOrganizationProfile.Id = this.orgProfileId ? this.orgProfileId : 0;
    vendorOrganizationProfile.Form_Id = this.form_Id;
    return vendorOrganizationProfile;
  }

  // validation
  keyPressValidation(event: Event, type: string) {
    return this._common.KeyPressValidation(event, type);
  }

  addMultipleSubsideries() {
    if (this.vendorOrgForm.get("Subsideries").value == null) {
      this.vendorOrgForm.get("Subsideries").markAllAsTouched();
    } else {
      let subsidery = new Subsideries();
      subsidery.Form_Id = this.form_Id;
      subsidery.Id = 0;
      subsidery.Subsidery_Name = this.vendorOrgForm.get("Subsideries").value;
      this.subsideriesList.push(subsidery);
      this.vendorOrgForm.get("Subsideries").reset();
    }
  }

  // addMultipleMajorCustomers() {
  //   if (this.vendorOrgForm.get("ListOfMajorCustomer").value == null) {
  //     this.vendorOrgForm.get("ListOfMajorCustomer").markAllAsTouched();
  //   } else {
  //     let majorCustomer = new MajorCustomer();
  //     majorCustomer.Form_Id = this.form_Id;
  //     majorCustomer.Id = 0;
  //     (majorCustomer.Location = ""),
  //       (majorCustomer.Customer_Name = this.vendorOrgForm.get(
  //         "ListOfMajorCustomer"
  //       ).value);
  //     this.listOfMajorCustomerList.push(majorCustomer);
  //     this.vendorOrgForm.get("ListOfMajorCustomer").reset();
  //   }
  // }

  removeSubsideriesItems(i: number) {
    this.subsideriesList.splice(i, 1);
  }

  removeMajorCustomerItems(i: number) {
    this.listOfMajorCustomerList.splice(i, 1);
  }

  removeRelatedNocilEmployee(i: number) {
    this.nocilRelatedEmployees.splice(i, 1);
  }

  addMajorCustomer() {
    const dialogRef = this._dialog.open(CommonAddDataDialogComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        form_Id: this.form_Id,
        type: "Major Customer",
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          if (this.listOfMajorCustomerList.length >= 5) {
            this._common.openSnackbar("You can only add up to 5 major customers",snackbarStatus.Warning);
            return;
          }
          if (this.listOfMajorCustomerList.length == 0) {
            this.listOfMajorCustomerList = res;
          } else {
            this.listOfMajorCustomerList.push(...res);
          }
        }
      },
    });
  }

  addNocilRelatedEmployee() {
    const dialogRef = this._dialog.open(CommonAddDataDialogComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        form_Id: this.form_Id,
        type: "Nocil Member",
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          if (this.nocilRelatedEmployees.length >= 2) {
            this._common.openSnackbar("You can only add up to 2 Nocil Related Employees",snackbarStatus.Warning);
            return;
          }
          if (this.nocilRelatedEmployees.length == 0) {
            this.nocilRelatedEmployees = res;
          } else {
            this.nocilRelatedEmployees.push(...res);
          }
        }
      },
    });
  }

  getSubsideries() {
    return this.subsideriesList;
  }

  getMajorCustomers() {
    return this.listOfMajorCustomerList;
  }

  getNocilRelatedEmployees() {
    return this.nocilRelatedEmployees;
  }

  getAllMasters() {
    forkJoin([
      this._master.getOrganizationTypes(),
      this._master.getCompanyStatuses(),
      this._registration.getFormData(this.form_Id, "VendorOrganizationProfile"),
      this._registration.getFormData(this.form_Id, "Subsideries"),
      this._registration.getFormData(this.form_Id, "MajorCustomers"),
      this._registration.getFormData(this.form_Id, "NocilRelatedEmployees"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.orgTypes = res[0] as OrganizationType[];
          this.impOrgTypes = this._config.get("Import_Organization_Types").split(",");
          if (this.v_Id == 5) {
            this.orgTypes = this.orgTypes.filter(org => this.impOrgTypes.includes(org.Type_of_Organization));
            // this.orgTypes.forEach(element => {
            //   if (element.Type_of_Organization == "Manufacturer") {
            //     this.emitterService.emitIsManufacturer("Manufacturer");
            //   }
            //   else {
            //     this.emitterService.emitIsManufacturer(" ");
            //   }
            // })
          }
        }
        if (res[1]) {
          this.companyStatuses = res[1] as CompanyStatus[];
        }
        if (res[2]) {
          this.orgProfileId = (res[2] as VendorOrganizationProfile).Id;
          this.vendorOrgForm.patchValue(res[2]);
        }
        if (res[3]) {
          this.subsideriesList = res[3] as Subsideries[];
        }
        if (res[4]) {
          this.listOfMajorCustomerList = res[4] as MajorCustomer[];
        }
        if (res[5]) {
          this.nocilRelatedEmployees = res[5] as NocilRelatedEmployee[];
        }
      },
      error: (err) => { },
    });
  }



}
