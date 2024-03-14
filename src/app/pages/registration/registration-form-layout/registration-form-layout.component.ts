import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressComponent } from '../address/address.component';
import { DomesticForm } from '../../../Models/DomesticForm';
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

@Component({
  selector: 'ngx-registration-form-layout',
  templateUrl: './registration-form-layout.component.html',
  styleUrls: ['./registration-form-layout.component.scss']
})
export class RegistrationFormLayoutComponent implements OnInit {
  @ViewChild(AddressComponent) addressComponent: AddressComponent;
  @ViewChild(ContactsComponent) contactsComponent: ContactsComponent;
  @ViewChild(PartnersComponent) partnersComponent: PartnersComponent;
  @ViewChild(AnnualTurnoverComponent) annualTurnoverComponent: AnnualTurnoverComponent;
  @ViewChild(VendorBranchesComponent) vendorBranchesComponent: VendorBranchesComponent;
  @ViewChild(DomesticVendorPersonalInfoComponent) domesticVendorPersonalInfoComponent: DomesticVendorPersonalInfoComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(CommercialProfileComponent) commercialProfileComponent: CommercialProfileComponent;
  @ViewChild(TechnicalProfileComponent) technicalProfileComponent: TechnicalProfileComponent;
  @ViewChild(DomesticVendorOrgProfileComponent) domesticVendorOrgProfileComponent: DomesticVendorOrgProfileComponent;
  @ViewChild(TransportVendorsPersonalDetailsComponent) transportVendorsPersonalDetailsComponent: TransportVendorsPersonalDetailsComponent;
  @ViewChild(TankerDetailsComponent) tankerDetailsComponent: TankerDetailsComponent;

  constructor(private _commonService: CommonService) {

  }
  ngOnInit(): void {

  }

  domesticFormPayload() {
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
        'Please fill required fields.',
        snackbarStatus.Warning
      );
    } else {
      let domesticForm = new DomesticForm();
      domesticForm.DomesticVendorPersonalData = this.domesticVendorPersonalInfoComponent.getDomesticVendorPersonalInfo();
      domesticForm.VendorOrganizationProfile = this.domesticVendorOrgProfileComponent.getDomesticVendorOrgProfile();
      domesticForm.TechnicalProfile = this.technicalProfileComponent.getTechnicalProfile();
      domesticForm.CommercialProfile = this.commercialProfileComponent.getCommercialProfile();
      domesticForm.BankDetail = this.bankDetailsComponent.getBankDetail();
      domesticForm.Addresses = this.addressComponent.getAddresses();
      domesticForm.Contacts = this.contactsComponent.getContacts();
      domesticForm.VendorBranches = this.vendorBranchesComponent.getVendorBranches();
      domesticForm.ProprietorOrPartners = this.partnersComponent.getProprietorOrPartners();
      domesticForm.AnnualTurnOvers = this.annualTurnoverComponent.getAnnualTurnOvers();

      console.log(domesticForm);
    }
  }

  transportFormPayload(){
    let validations = [
      this.transportVendorsPersonalDetailsComponent.isValid(),
      this.tankerDetailsComponent.isValid(),
      this.bankDetailsComponent.isValid(),
      this.commercialProfileComponent.isValid(),
      this.vendorBranchesComponent.isValid()
    ];
    if(validations.includes(false)){
      this._commonService.openSnackbar(
        'Please fill required fields.',
        snackbarStatus.Warning
      );
    }
    else{
      let transportForm = new TransportForm();
      transportForm.TransportVendorPersonalData = this.transportVendorsPersonalDetailsComponent.getTransportVendorPersonalData();
      transportForm.TankerDetails = this.tankerDetailsComponent.getTankerDetails();
      transportForm.BankDetail = this.bankDetailsComponent.getBankDetail();
      transportForm.CommercialProfile = this.commercialProfileComponent.getCommercialProfile();
      transportForm.VendorBranches = this.vendorBranchesComponent.getVendorBranches();
      console.log(transportForm);
    }
  }

  submit() {
    this.transportFormPayload();
  }

}
