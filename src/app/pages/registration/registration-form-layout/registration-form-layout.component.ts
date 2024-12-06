import { Component, OnInit, ViewChild } from "@angular/core";
import { AddressComponent } from "../address/address.component";
import { DomesticAndImportForm } from "../../../Models/DomesticAndImportForm";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationService } from "../../../Services/registration.service";
import {
  Approval,
  FormSubmitTemplate,
  Rejection,
} from "../../../Models/Registration";
import { AuthResponse } from "../../../Models/authModel";
import { MatDialog } from "@angular/material/dialog";
import { RejectReasonDialogComponent } from "../../../Dialogs/reject-reason-dialog/reject-reason-dialog.component";
import { ServiceForm } from "../../../Models/ServiceForm";
import { Attachment, FormsToShow, GstDetail, Reason, ReasonDetail } from "../../../Models/Dtos";
import { MatTableDataSource } from "@angular/material/table";
import { TermsAndConditionsDialogComponent } from "../../../Dialogs/terms-and-conditions-dialog/terms-and-conditions-dialog.component";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { TransportForm } from "../../../Models/TransportForm";
import { CommonService } from "../../../Services/common.service";
import { EncryptionService } from "../../../Services/encryption.service";
import { getSession } from "../../../Utils";
import { PreviewDialogComponent } from "../../../Dialogs/preview-dialog/preview-dialog.component";
import { AppConfigService } from "../../../Services/app-config.service";
import { EmitterService } from "../../../Services/emitter.service";
import { EditRequestService } from "../../../Services/edit-request.service";
import { ContactsComponent } from "../contacts/contacts.component";
import { AdditionalFieldsComponent } from "../additional-fields/additional-fields.component";
import { AnnualTurnoverComponent } from "../annual-turnover/annual-turnover.component";
import { AttachmentsComponent } from "../attachments/attachments.component";
import { BankDetailsComponent } from "../bank-details/bank-details.component";
import { CommercialProfileComponent } from "../commercial-profile/commercial-profile.component";
import { GstFilingDetailsComponent } from "../gst-filing-details/gst-filing-details.component";
import { PartnersComponent } from "../partners/partners.component";
import { TankerDetailsComponent } from "../tanker-details/tanker-details.component";
import { TechnicalProfileComponent } from "../technical-profile/technical-profile.component";
import { TransportVendorsPersonalDetailsComponent } from "../transport-vendors-personal-details/transport-vendors-personal-details.component";
import { VendorBranchesComponent } from "../vendor-branches/vendor-branches.component";
import { VendorOrgProfileComponent } from "../vendor-org-profile/vendor-org-profile.component";
import { VendorPersonalInfoComponent } from "../vendor-personal-info/vendor-personal-info.component";

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
  @ViewChild(VendorPersonalInfoComponent)
  vendorPersonalInfoComponent: VendorPersonalInfoComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(CommercialProfileComponent)
  commercialProfileComponent: CommercialProfileComponent;
  @ViewChild(TechnicalProfileComponent)
  technicalProfileComponent: TechnicalProfileComponent;
  @ViewChild(VendorOrgProfileComponent)
  vendorOrgProfileComponent: VendorOrgProfileComponent;
  @ViewChild(TransportVendorsPersonalDetailsComponent)
  transportVendorsPersonalDetailsComponent: TransportVendorsPersonalDetailsComponent;
  @ViewChild(TankerDetailsComponent)
  tankerDetailsComponent: TankerDetailsComponent;
  @ViewChild(AttachmentsComponent)
  attachmentsComponent: AttachmentsComponent;
  @ViewChild(AdditionalFieldsComponent)
  additionalFieldsComponent: AdditionalFieldsComponent;
  @ViewChild(GstFilingDetailsComponent)
  gstFilingDetailsComponent: GstFilingDetailsComponent;

  form_Id: number = 1;
  v_Id: number = 1;
  authResponse: AuthResponse;
  form_status: string;
  isReadOnly: boolean = true;
  rejectedReason: Reason = new Reason();
  editRejectedReason: ReasonDetail[] = [];
  attachmentsArray: Attachment[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["RejectedBy", "RejectedOn", "Reason"];

  gstDetail: GstDetail = new GstDetail();
  formsToShow: FormsToShow = new FormsToShow();
  isOrgTypeManufacturer: boolean = false;
  isGstFilingReq: boolean = false;
  isDomesticVendor: boolean = false;

  json_data: any;

  constructor(
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _registration: RegistrationService,
    private _dialog: MatDialog,
    private _router: Router,
    private _encryptor: EncryptionService,
    private _appConfig: AppConfigService,
    private emitterService: EmitterService,
    private _editRequest: EditRequestService
  ) { }

  ngOnInit(): void {


    this.authResponse = JSON.parse(getSession("userDetails"));
    this.paramSubscription();
    if (this.authResponse?.Role === "Vendor") {
      this.isReadOnly = false;
      //
      this.openTermsAndConditionsDialog();
    }

    if (this.form_status.includes('Edit')) {
      this.getEditRejectedReasons();
    }
    else {
      this._registration.getReasons(this.form_Id).subscribe({
        next: (res) => {
          if (res) {
            console.log("reject", res)
            this.rejectedReason = res;
            this.dataSource = new MatTableDataSource(this.rejectedReason.Reasons);
          }
        },
        error: (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      });
    }

    this.emitterService.requiredAttachments.subscribe((value) => {
      this.isGstFilingReq = value;
    });


    //this.ExpiryNotifications();

    this.emitterService.isManufacturer.subscribe((value) => {
      this.isOrgTypeManufacturer = value;
    });
  }

  paramSubscription() {
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && params["data"] != null) {
          this.json_data = JSON.parse(this._encryptor.decrypt(params["data"]));
          this.updateSubscriptionValues();
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  updateSubscriptionValues() {
    this.form_Id = this.json_data.Form_Id;
    this.v_Id = this.json_data.V_Id;
    this.form_status = this.json_data.Status;
    this.selectFormBasedOnVendorType(this.v_Id);
  }

  //#region Open terms and Conditions dialog
  openTermsAndConditionsDialog() {
    const dialogRef = this._dialog.open(TermsAndConditionsDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: "700px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
        } else {
          this.openTermsAndConditionsDialog();
        }
      },
    });
  }
  //#endregion

  //#region Submitting form API Call
  submitForm(formSubmitTemplate: FormSubmitTemplate) {
    this.getAttachments(formSubmitTemplate)
  }
  //#endregion

  //#region Updating form API call
  updateForm(formSubmitTemplate: FormSubmitTemplate) {

    this._registration.formUpdate(formSubmitTemplate).subscribe({
      next: (res) => {
        if (res.Status === 200) {

          this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
          this._router.navigate(["/success"]);
        }
      },
      error: (err) => {

        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  updateEditForm(formSubmitTemplate: FormSubmitTemplate) {
    this._editRequest.editFormUpdate(formSubmitTemplate).subscribe({
      next: (res) => {
        if (res.Status === 200) {

          this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
          this._router.navigate(["/success"]);
        }
      },
      error: (err) => {

        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
  //#endregion

  //#region Calling corresponding submit/update functions based on vendor type
  submit(event: Event) {
    event.preventDefault();
    if (this.v_Id === 1) {
      this.domesticAndImportFormSubmit();
    } else if (this.v_Id == 2) {
      this.domesticAndImportFormSubmit();
    } else if (this.v_Id === 3) {
      this.serviceFormSubmit();
    } else if (this.v_Id === 4) {
      this.transportFormSubmit();
    } else if (this.v_Id == 5) {
      this.domesticAndImportFormSubmit();
    }
  }

  update() {
    if (this.v_Id === 1) {
      this.domesticAndImportFormSubmit();
    } else if (this.v_Id === 2) {
      this.domesticAndImportFormSubmit();
    } else if (this.v_Id === 3) {
      this.serviceFormSubmit();
    }
    else if (this.v_Id === 4) {
      this.transportFormSubmit();
    } else if (this.v_Id == 5) {
      this.domesticAndImportFormSubmit();
    }
    // else if (this.v_Id == 4) {
    //   this.domesticAndImportFormPayload();
    // }
  }
  //#endregion

  // Rejection dialog and API call
  openRejectDialog() {
    const DIALOF_REF = this._dialog.open(RejectReasonDialogComponent, {
      disableClose: true,
      width: "400px",
      height: "220px",
      data: this.form_Id,
    });
    DIALOF_REF.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          let API;
          if (this.form_status == 'EditApprovalPending') {
            API = this._editRequest.formRejection(res.reject as Rejection);
          }
          else if (this.form_status == 'EditRequested') {
            API = this._editRequest.rejectEditRequest(res.reject as Rejection);
          }
          else {
            API = this._registration.formRejection(res.reject as Rejection);
          }
          // const API = this.form_status == 'EditApprovalPending' ? this._editRequest.formRejection(res.reject as Rejection) : this._registration.formRejection(res.reject as Rejection);
          API.subscribe({
            next: (res) => {

              if (res && res.Status == 200) {
                this._commonService.openSnackbar(
                  res.Message,
                  snackbarStatus.Success
                );
                this._router.navigate(["/onboarding/dashboard"]);
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
      },
    });
  }
  // Approval API call
  approveForm(event: Event) {
    if (this.additionalFieldsComponent.checkRoleAndFormValid()) {
      let approval = new Approval();
      approval.Form_Id = this.form_Id;
      approval.VendorTypeId = this.v_Id;
      approval.EmployeeId = this.authResponse.Employee_Id;
      approval.RoleId = this.authResponse?.Role_Id;
      approval.RoleName = this.authResponse?.Role;
      approval.RmEmployeeId = this.authResponse.RmEmployee_Id;
      approval.RmRoleId = this.authResponse.RmRole_Id;
      approval.RmRoleName = this.authResponse.RmRole;
      approval.AdditionalFields = this.additionalFieldsComponent.getAllAdditionalData();

      const API = this.form_status == 'EditApprovalPending' ? this._editRequest.formApproval(approval) : this._registration.formApproval(approval);
      API.subscribe({
        next: (res) => {

          if (res && res.Status == 200) {
            this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
            this._router.navigate(["/onboarding/dashboard"]);
          }
        },
        error: (err) => {

          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      });
    }
    else {
      this._commonService.openSnackbar("Please Fill out Additional Fields Information.", snackbarStatus.Danger);
    }
  }



  //#region Submit function call based on Vendor Type
  domesticAndImportFormSubmit() {
    if (this.checkValidationForDomestic()) {
      var payload = this.createDomesticAndImportPayload();
      if (this.form_status == "Initiated") {
        this.submitForm(payload);
      } else if (this.form_status == "Rejected") {
        this.updateForm(payload);
      }
      else if (this.form_status == "EditReqApproved" || "EditReqRejected") {
        this.updateEditForm(payload);
      }
      else {
        this._commonService.openSnackbar(
          `You can not submit the ${this.form_status} form`,
          snackbarStatus.Danger
        );
      }
    } else {
      this.markAllFormsAsTouched();
    }
  }

  transportFormSubmit() {
    if (this.checkValidationForTransport()) {
      var payload = this.createTransportPayload();
      if (this.form_status == "Initiated") {
        this.submitForm(payload);
      } else if (this.form_status == "Rejected") {
        this.updateForm(payload);
      }
      else if (this.form_status == "EditReqApproved" || "EditReqRejected") {
        this.updateEditForm(payload);
      } else {
        this._commonService.openSnackbar(
          `You can not submit the ${this.form_status} form`,
          snackbarStatus.Danger
        );
      }
    } else {
      this.markAllFormsAsTouched();
    }
  }

  serviceFormSubmit() {
    if (this.checkValidationForService()) {
      var payload = this.createServicePayload();
      if (this.form_status == "Initiated") {
        this.submitForm(payload);
      } else if (this.form_status == "Rejected") {
        this.updateForm(payload);
      }
      else if (this.form_status == "EditReqApproved" || "EditReqRejected") {
        this.updateEditForm(payload);
      } else {
        this._commonService.openSnackbar(
          `You can not submit the ${this.form_status} form`,
          snackbarStatus.Danger
        );
      }
    } else {
      this.markAllFormsAsTouched();
    }
  }
  //#endregion

  //#region Validation based on form
  checkValidationForDomestic() {
    return (
      this.vendorPersonalInfoComponent.isValid() &&
      this.vendorOrgProfileComponent.isValid() &&
      this.commercialProfileComponent.isValid() &&
      this.bankDetailsComponent.isValid() &&
      this.addressComponent.isValid() &&
      this.contactsComponent.isValid() &&
      this.vendorBranchesComponent.isValid() &&
      (!this.formsToShow.proprietorOrPartner || this.partnersComponent?.isValid()) &&
      this.annualTurnoverComponent.isValid() &&
      this.attachmentsComponent.isValid() &&
      (this.isDomesticVendor ? this.gstFilingDetailsComponent.isValid() : true)
    );
  }

  gstFilingForDomestic() {
    if (this.v_Id != 5) {
      this.isDomesticVendor = true;
    }
  }

  checkValidationForTransport() {
    console.log(this.tankerDetailsComponent.isValid());
    return (
      this.transportVendorsPersonalDetailsComponent.isValid() &&
      this.tankerDetailsComponent.isValid() &&
      this.addressComponent.isValid() &&
      this.contactsComponent.isValid() &&
      this.bankDetailsComponent.isValid() &&
      this.commercialProfileComponent.isValid() &&
      this.vendorBranchesComponent.isValid() &&
      this.gstFilingDetailsComponent.isValid()
    );
  }

  checkValidationForService() {
    return (
      this.vendorPersonalInfoComponent.isValid() &&
      this.vendorOrgProfileComponent.isValid() &&
      this.commercialProfileComponent.isValid() &&
      this.bankDetailsComponent.isValid() &&
      this.addressComponent.isValid() &&
      this.contactsComponent.isValid() &&
      this.vendorBranchesComponent.isValid() &&
      (!this.formsToShow.proprietorOrPartner || this.partnersComponent?.isValid()) &&
      this.attachmentsComponent.isValid() &&
      this.gstFilingDetailsComponent.isValid()
    );
  }
  //#endregion

  //#region Payload formation methods
  createDomesticAndImportPayload(): FormSubmitTemplate {
    let domesticAndImportForm = new DomesticAndImportForm();
    domesticAndImportForm.VendorPersonalData =
      this.vendorPersonalInfoComponent.getDomesticVendorPersonalInfo();
    domesticAndImportForm.VendorOrganizationProfile =
      this.vendorOrgProfileComponent.getDomesticVendorOrgProfile();
    domesticAndImportForm.TechnicalProfile =
      this.technicalProfileComponent.getTechnicalProfile();
    domesticAndImportForm.Subsideries =
      this.vendorOrgProfileComponent.getSubsideries();
    domesticAndImportForm.MajorCustomers =
      this.vendorOrgProfileComponent.getMajorCustomers();
    domesticAndImportForm.CommercialProfile =
      this.commercialProfileComponent.getCommercialProfile();
    domesticAndImportForm.BankDetail =
      this.bankDetailsComponent.getBankDetail();
    domesticAndImportForm.Addresses = this.addressComponent.getAddresses();
    domesticAndImportForm.Contacts = this.contactsComponent.getContacts();
    domesticAndImportForm.VendorBranches =
      this.vendorBranchesComponent.getVendorBranches();
    domesticAndImportForm.ProprietorOrPartners = this.partnersComponent
      ? this.partnersComponent.getProprietorOrPartners()
      : [];
    domesticAndImportForm.AnnualTurnOvers =
      this.annualTurnoverComponent.getAnnualTurnOvers();
    domesticAndImportForm.NocilRelatedEmployees =
      this.vendorOrgProfileComponent.getNocilRelatedEmployees();
    if (this.isDomesticVendor) {
      domesticAndImportForm.GstFilingDetails = this.gstFilingDetailsComponent.getGSTFiling();
    } else {
      domesticAndImportForm.GstFilingDetails = null;
    }
    return this.createFormSubmitTemplate(domesticAndImportForm);
  }

  createTransportPayload(): FormSubmitTemplate {
    let transportForm = new TransportForm();
    transportForm.TransportVendorPersonalData =
      this.transportVendorsPersonalDetailsComponent.getTransportVendorPersonalData();
    transportForm.Addresses = this.addressComponent.getAddresses();
    transportForm.Contacts = this.contactsComponent.getContacts();
    transportForm.TankerDetails =
      this.tankerDetailsComponent.getTankerDetails();
    transportForm.VehicleDetails = this.tankerDetailsComponent.vehicleDetailsComponent.getVehicleDetails();
    transportForm.BankDetail = this.bankDetailsComponent.getBankDetail();
    transportForm.CommercialProfile =
      this.commercialProfileComponent.getCommercialProfile();
    transportForm.VendorBranches =
      this.vendorBranchesComponent.getVendorBranches();
    transportForm.GstFilingDetails =
      this.gstFilingDetailsComponent.getGSTFiling();
    return this.createFormSubmitTemplate(transportForm);
  }

  createServicePayload(): FormSubmitTemplate {
    let serviceForm = new ServiceForm();
    serviceForm.VendorPersonalData =
      this.vendorPersonalInfoComponent.getDomesticVendorPersonalInfo();
    serviceForm.VendorOrganizationProfile =
      this.vendorOrgProfileComponent.getDomesticVendorOrgProfile();
    serviceForm.TechnicalProfile =
      this.technicalProfileComponent.getTechnicalProfile();
    serviceForm.Subsideries = this.vendorOrgProfileComponent.getSubsideries();
    serviceForm.MajorCustomers =
      this.vendorOrgProfileComponent.getMajorCustomers();
    serviceForm.CommercialProfile =
      this.commercialProfileComponent.getCommercialProfile();
    serviceForm.BankDetail = this.bankDetailsComponent.getBankDetail();
    serviceForm.Addresses = this.addressComponent.getAddresses();
    serviceForm.Contacts = this.contactsComponent.getContacts();
    serviceForm.VendorBranches =
      this.vendorBranchesComponent.getVendorBranches();
    serviceForm.ProprietorOrPartners = this.partnersComponent
      ? this.partnersComponent.getProprietorOrPartners()
      : [];
    serviceForm.NocilRelatedEmployees =
      this.vendorOrgProfileComponent.getNocilRelatedEmployees();
    serviceForm.GstFilingDetails =
      this.gstFilingDetailsComponent.getGSTFiling();
    return this.createFormSubmitTemplate(serviceForm);
  }
  //#endregion

  // Create final payload structure to submit or update form
  createFormSubmitTemplate(data: any): FormSubmitTemplate {
    let formSubmitTemplate = new FormSubmitTemplate();
    formSubmitTemplate.Vendor_Type_Id = this.v_Id;
    formSubmitTemplate.Form_Id = this.form_Id;
    formSubmitTemplate.FormData = data;
    return formSubmitTemplate;
  }

  // Selecting the child form components to display in the template based on the vendor type
  selectFormBasedOnVendorType(vId: number) {
    switch (vId) {
      case 1:
        this.formsToShow = this._appConfig.getSubItem(
          "FormsToShow",
          "1"
        ) as FormsToShow;
        break;
      case 2:
        this.formsToShow = this._appConfig.getSubItem(
          "FormsToShow", "2"
        ) as FormsToShow;
        break;
      case 3:
        this.formsToShow = this._appConfig.getSubItem(
          "FormsToShow", "3"
        ) as FormsToShow;
        break;
      case 4:
        this.formsToShow = this._appConfig.getSubItem(
          "FormsToShow", "4"
        ) as FormsToShow;
        break;
      case 5:
        this.formsToShow = this._appConfig.getSubItem(
          "FormsToShow", "5"
        ) as FormsToShow;
        break;
    }
  }

  // Emitter functions
  getCompanyStatus(event) {
    this.formsToShow.proprietorOrPartner = event;
  }

  // mark all forms as touched
  markAllFormsAsTouched() {
    this.addressComponent?.markAddressFormAsTouched();
    this.contactsComponent?.markContactFormAsTouched();
    this.partnersComponent?.markPartnersFormAsTouched();
    this.annualTurnoverComponent?.markTurnOverFormAsTouched();
    this.vendorBranchesComponent?.markVendorBranchFormAsTouched();
    this.vendorPersonalInfoComponent?.domesticVendorForm.markAllAsTouched();
    this.bankDetailsComponent?.bankDetailsForm.markAllAsTouched();
    this.commercialProfileComponent?.commercialProfileForm.markAllAsTouched();
    this.technicalProfileComponent?.technicalProfileForm.markAllAsTouched();
    this.vendorOrgProfileComponent?.vendorOrgForm.markAllAsTouched();
    this.transportVendorsPersonalDetailsComponent?.transporterVendorsForm.markAllAsTouched();
    this.tankerDetailsComponent?.markTankerDetailFormAsTouched();
    this.gstFilingDetailsComponent?.markGstFilingFormAsTouched();
  }

  // reset all forms
  resetAllForms() {
    this.addressComponent.addressForm.reset();
    this.contactsComponent.contactForm.reset();
    this.partnersComponent.partnersForm.reset();
    this.annualTurnoverComponent.turnoverForm.reset();
    this.vendorBranchesComponent.VendorBranchForm.reset();
    this.vendorPersonalInfoComponent.domesticVendorForm.reset();
    this.bankDetailsComponent.bankDetailsForm.reset();
    this.commercialProfileComponent.commercialProfileForm.reset();
    this.technicalProfileComponent.technicalProfileForm.reset();
    this.vendorOrgProfileComponent.vendorOrgForm.reset();
    this.transportVendorsPersonalDetailsComponent.transporterVendorsForm.reset();
    this.tankerDetailsComponent.TankerDetailsForm.reset();
    this.gstFilingDetailsComponent.gstFilingDetailsForm.reset();
  }

  getGstDetail(event) {
    this.gstDetail = event;
  }



  getAttachments(formSubmitTemplate: FormSubmitTemplate) {
    this._registration.getFormData(this.form_Id, "Attachments").subscribe({
      next: (res) => {
        this.attachmentsArray = res;
        this.openDialog(formSubmitTemplate);
      },
      error: (err) => { }
    });
  }

  openDialog(formSubmitTemplate: FormSubmitTemplate): void {
    const dialogRef = this._dialog.open(PreviewDialogComponent, {
      data:
        { attach: this.attachmentsArray },
      height: "500px",
      width: "700px",
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        this._registration.formSubmit(formSubmitTemplate).subscribe({
          next: (res) => {
            if (res.Status === 200) {
              this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
              this._router.navigate(["/success"]);
            }
          },
          error: (err) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        });
      }
    })
  }

  getEditRejectedReasons() {
    this._editRequest.getReasons(this.form_Id).subscribe({
      next: (res) => {
        if (res) {
          console.log("edit", res)
          this.editRejectedReason = res;
          this.dataSource = new MatTableDataSource(this.editRejectedReason);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }


  acceptEditRequest() {
    this._editRequest.acceptEditRequest(this.form_Id).subscribe({
      next: (res) => {

        if (res && res.Status == 200) {
          this._commonService.openSnackbar(
            res.Message,
            snackbarStatus.Success
          );
          this._router.navigate(["/onboarding/dashboard"]);
        }
      },
      error: (err) => {

        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }
}
