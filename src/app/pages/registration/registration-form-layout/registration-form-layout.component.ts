import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressComponent } from '../address/address.component';
import { DomesticAndImportForm } from '../../../Models/DomesticAndImportForm';
import { ContactsComponent } from '../contacts/contacts.component';
import { PartnersComponent } from '../partners/partners.component';
import { AnnualTurnoverComponent } from '../annual-turnover/annual-turnover.component';
import { VendorBranchesComponent } from '../vendor-branches/vendor-branches.component';
import { DomesticVendorPersonalInfoComponent } from '../domestic-vendor-personal-info/domestic-vendor-personal-info.component';
import { BankDetailsComponent } from '../bank-details/bank-details.component';
import { CommercialProfileComponent } from '../commercial-profile/commercial-profile.component';
import { TechnicalProfileComponent } from '../technical-profile/technical-profile.component';
import { DomesticVendorOrgProfileComponent } from '../domestic-vendor-org-profile/domestic-vendor-org-profile.component';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { TransportForm } from '../../../Models/TransportForm';
import { TransportVendorsPersonalDetailsComponent } from '../transport-vendors-personal-details/transport-vendors-personal-details.component';
import { TankerDetailsComponent } from '../tanker-details/tanker-details.component';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { RegistrationService } from '../../../Services/registration.service';
import { FormSubmitTemplate } from '../../../Models/Registration';
import { AuthResponse } from '../../../Models/authModel';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionsDialogComponent } from '../../../Dialogs/attachment-dialog/terms-and-conditions-dialog/terms-and-conditions-dialog.component';

@Component({
  selector: "ngx-registration-form-layout",
  templateUrl: "./registration-form-layout.component.html",
  styleUrls: ["./registration-form-layout.component.scss"],
})
export class RegistrationFormLayoutComponent implements OnInit {
  @ViewChild(AddressComponent) addressComponent: AddressComponent;
  @ViewChild(ContactsComponent) contactsComponent: ContactsComponent;
  @ViewChild(PartnersComponent) partnersComponent: PartnersComponent;
  @ViewChild(AnnualTurnoverComponent)
  annualTurnoverComponent: AnnualTurnoverComponent;
  @ViewChild(VendorBranchesComponent)
  vendorBranchesComponent: VendorBranchesComponent;
  @ViewChild(DomesticVendorPersonalInfoComponent)
  domesticVendorPersonalInfoComponent: DomesticVendorPersonalInfoComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(CommercialProfileComponent)
  commercialProfileComponent: CommercialProfileComponent;
  @ViewChild(TechnicalProfileComponent)
  technicalProfileComponent: TechnicalProfileComponent;
  @ViewChild(DomesticVendorOrgProfileComponent)
  domesticVendorOrgProfileComponent: DomesticVendorOrgProfileComponent;
  @ViewChild(TransportVendorsPersonalDetailsComponent)
  transportVendorsPersonalDetailsComponent: TransportVendorsPersonalDetailsComponent;
  @ViewChild(TankerDetailsComponent)
  tankerDetailsComponent: TankerDetailsComponent;

  form_Id: number;
  vendorTypeId: number;
  authResponse: AuthResponse;

  constructor(
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _registration: RegistrationService,
    private _dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.authResponse = JSON.parse(sessionStorage.getItem('userDetails'));
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && params['data'] != null) {
          const jsonData = JSON.parse((params['data']));
          this.form_Id = jsonData.Form_Id;
          this.vendorTypeId = jsonData.V_Id;
        }
      },
      error: (err) => {},
    });

    if (this.authResponse.Role === 'Vendor') {
      // 
      this.openTermsAndConditionsDialog();
    }
  }

  domesticAndImportFormPayload() {
    let validations = [
      this.domesticVendorPersonalInfoComponent.isValid(),
      this.domesticVendorOrgProfileComponent.isValid(),
      this.commercialProfileComponent.isValid(),
      this.bankDetailsComponent.isValid(),
      this.addressComponent.isValid(),
      this.contactsComponent.isValid(),
      this.vendorBranchesComponent.isValid(),
      this.partnersComponent.isValid(),
      this.annualTurnoverComponent.isValid(),
    ];

    if (validations.includes(false)) {
      this._commonService.openSnackbar(
        "Please fill required fields.",
        snackbarStatus.Warning
      );
    } else {
      let domesticAndImportForm = new DomesticAndImportForm();
      domesticAndImportForm.DomesticVendorPersonalData =
        this.domesticVendorPersonalInfoComponent.getDomesticVendorPersonalInfo();
      domesticAndImportForm.VendorOrganizationProfile =
        this.domesticVendorOrgProfileComponent.getDomesticVendorOrgProfile();
      domesticAndImportForm.TechnicalProfile =
        this.technicalProfileComponent.getTechnicalProfile();
      domesticAndImportForm.Subsideries =
        this.domesticVendorOrgProfileComponent.getSubsideries();
      domesticAndImportForm.MajorCustomers =
        this.domesticVendorOrgProfileComponent.getMajorCustomers();
      domesticAndImportForm.CommercialProfile =
        this.commercialProfileComponent.getCommercialProfile();
      domesticAndImportForm.BankDetail =
        this.bankDetailsComponent.getBankDetail();
      domesticAndImportForm.Addresses = this.addressComponent.getAddresses();
      domesticAndImportForm.Contacts = this.contactsComponent.getContacts();
      domesticAndImportForm.VendorBranches =
        this.vendorBranchesComponent.getVendorBranches();
      domesticAndImportForm.ProprietorOrPartners =
        this.partnersComponent.getProprietorOrPartners();
      domesticAndImportForm.AnnualTurnOvers =
        this.annualTurnoverComponent.getAnnualTurnOvers();

      console.log(domesticAndImportForm);

      let formSubmitTemplate = new FormSubmitTemplate();
      formSubmitTemplate.Vendor_Type_Id = this.vendorTypeId;
      formSubmitTemplate.Form_Id = this.form_Id;
      formSubmitTemplate.FormData = domesticAndImportForm;

      this._registration.formSubmit(formSubmitTemplate).subscribe({
        next: (res) => {
          console.log(res);
          if (res.Status === 200) {
            // reset all forms

            this._commonService.openSnackbar(
              res.Message,
              snackbarStatus.Success
            );
          }
        },
        error: (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        }
      });
    }
  }

  transportFormPayload() {
    let validations = [
      this.transportVendorsPersonalDetailsComponent.isValid(),
      this.tankerDetailsComponent.isValid(),
      this.bankDetailsComponent.isValid(),
      this.commercialProfileComponent.isValid(),
      this.vendorBranchesComponent.isValid(),
    ];
    if (validations.includes(false)) {
      this._commonService.openSnackbar(
        "Please fill required fields.",
        snackbarStatus.Warning
      );
    } else {
      let transportForm = new TransportForm();
      transportForm.TransportVendorPersonalData =
        this.transportVendorsPersonalDetailsComponent.getTransportVendorPersonalData();
      transportForm.TankerDetails =
        this.tankerDetailsComponent.getTankerDetails();
      transportForm.BankDetail = this.bankDetailsComponent.getBankDetail();
      transportForm.CommercialProfile =
        this.commercialProfileComponent.getCommercialProfile();
      transportForm.VendorBranches =
        this.vendorBranchesComponent.getVendorBranches();
      console.log(transportForm);
    }
  }

  openTermsAndConditionsDialog() {
    const dialogRef = this._dialog.open(TermsAndConditionsDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '700px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {

        }
        else {
          this.openTermsAndConditionsDialog();
        }
      }
    });
  }

  submit() {
    if (this.vendorTypeId === 1) {
      this.domesticAndImportFormPayload();
    } else if (this.vendorTypeId === 2) {
      this.transportFormPayload();
    }
  }
}
