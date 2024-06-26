import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MajorCustomer, NocilRelatedEmployee, Subsideries, VendorOrganizationProfile } from '../../../Models/Dtos';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../Services/common.service';
import { MasterService } from '../../../Services/master.service';
import { RegistrationService } from '../../../Services/registration.service';
import { forkJoin } from 'rxjs';
import { CompanyStatus, OrganizationType } from '../../../Models/Master';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: 'ngx-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent implements OnInit {
  // @Input() formId: number = 17;
  @Output() hasOrgProfile: EventEmitter<any> = new EventEmitter();

  orgProfile: VendorOrganizationProfile = new VendorOrganizationProfile();
  orgTypes: OrganizationType[] = [];
  companyStatuses: CompanyStatus[] = [];
  subsideriesList: Subsideries[] = [];
  listOfMajorCustomerList: MajorCustomer[] = [];
  nocilRelatedEmployees: NocilRelatedEmployee[] = [];
  vendorInfo: any;
  formId: number;
  constructor(private _dialog: MatDialog,
    private _master: MasterService,
    private _common: CommonService,
    private _registration: RegistrationService) {

  }

  subsideriesColumns = ['Subsidery_Name'];
  majorCustomersColumns = ['Customer_Name', 'Location'];
  nocilRelatedEmployeesColumns = ['Employee_Name', 'Type_Of_Relation'];

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.getAllData();
  }

  getOrgTypeById(orgTypeId: number): string {
    const type = this.orgTypes.find(
      (type) => type.Id === orgTypeId
    );
    return type ? type.Type_of_Organization : "";
  }

  getCompanySttausById(statusId: number): string {
    const type = this.companyStatuses.find(
      (type) => type.Id === statusId
    );
    return type ? type.Company_Status : "";
  }

  getAllData() {
    forkJoin([
      this._master.getOrganizationTypes(),
      this._master.getCompanyStatuses(),
      this._registration.getFormData(this.formId, "VendorOrganizationProfile"),
      this._registration.getFormData(this.formId, "Subsideries"),
      this._registration.getFormData(this.formId, "MajorCustomers"),
      this._registration.getFormData(this.formId, "NocilRelatedEmployees"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.orgTypes = res[0] as OrganizationType[];
        }
        if (res[1]) {
          this.companyStatuses = res[1] as CompanyStatus[];
        }
        if (res[2]) {
          this.orgProfile = res[2] as VendorOrganizationProfile;
          this.hasOrgProfile.emit(true);
        }
        else{
          this.hasOrgProfile.emit(false);
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
      error: (err) => {
        this.hasOrgProfile.emit(false);
      },
    });

  }
}
