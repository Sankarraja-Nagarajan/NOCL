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
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { RegistrationService } from '../../../Services/registration.service';
import { Approval, FormSubmitTemplate, Rejection } from '../../../Models/Registration';
import { AuthResponse } from '../../../Models/authModel';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionsDialogComponent } from '../../../Dialogs/attachment-dialog/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { RejectReasonDialogComponent } from '../../../Dialogs/reject-reason-dialog/reject-reason-dialog.component';

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
  @ViewChild(AttachmentsComponent)
  attachmentsComponent: AttachmentsComponent;

  form_Id: number;
  vendorTypeId: number;
  authResponse: AuthResponse;
  form_status: string;
  isReadOnly: boolean = true;

  constructor(
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _registration: RegistrationService,
    private _dialog: MatDialog,
    private _router:Router) {

  }
  ngOnInit(): void {
    this.authResponse = JSON.parse(sessionStorage.getItem('userDetails'));
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && params['data'] != null) {
          const JSON_DATA = JSON.parse((params['data']));
          this.form_Id = JSON_DATA.Form_Id;
          this.vendorTypeId = JSON_DATA.V_Id;
          this.form_status = JSON_DATA.Status;
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });

    if (this.authResponse.Role === 'Vendor') {
      this.isReadOnly = false;
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
      this.attachmentsComponent.isImportVendorDocsAttached()
    ];

    if (validations.includes(false)) {
      this._commonService.openSnackbar(
        "Please fill required fields.",
        snackbarStatus.Warning
      );
    }
    else if (!this.attachmentsComponent.isValid()) {
      this._commonService.openSnackbar(
        "Add required attachments.",
        snackbarStatus.Warning
      );
    }
    else {
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

      if (domesticAndImportForm.TechnicalProfile.Is_ISO_Certified) {
        if (this.attachmentsComponent.isISOAttached()) {
          this.submitForm(formSubmitTemplate);
        }
      }
      else {
        this.submitForm(formSubmitTemplate);
      }
    }
  }

  submitForm(formSubmitTemplate: FormSubmitTemplate) {
    this._registration.formSubmit(formSubmitTemplate).subscribe({
      next: (res) => {
        console.log(res);
        if (res.Status === 200) {

          this._commonService.openSnackbar(
            res.Message,
            snackbarStatus.Success
          );
          
          this._router.navigate(['/auth/otp']);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
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

  openRejectDialog() {
    const DIALOF_REF = this._dialog.open(RejectReasonDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '220px',
      data: this.form_Id
    });
    DIALOF_REF.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          console.log(res.reject as Rejection);
          this._registration.formRejection(res.reject as Rejection).subscribe({
            next: (res) => {
              if (res && res.Status ==200) {
                this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
                this._router.navigate(['/onboarding/dashboard']);
              }
            },
            error: (err) => {
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  approveForm() {
    let approval = new Approval();
    approval.Form_Id = this.form_Id;
    approval.VendorTypeId = this.vendorTypeId;
    approval.EmployeeId = this.authResponse.Employee_Id;
    approval.RoleId = this.authResponse.Role_Id;
    approval.RoleName = this.authResponse.Role;
    approval.RmEmployeeId = this.authResponse.RmEmployee_Id;
    approval.RmRoleId = this.authResponse.RmRole_Id;
    approval.RmRoleName = this.authResponse.RmRole;

    this._registration.formApproval(approval).subscribe({
      next: (res) => {
        if (res && res.Status == 200) {
          this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
          this._router.navigate(['/onboarding/dashboard']);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  resetForm() {

  }
}
