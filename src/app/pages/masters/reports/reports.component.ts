import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region, VendorReport } from '../../../Models/Dtos';
import { MasterService } from '../../../Services/master.service';
import { forkJoin } from 'rxjs';
import { Country, OrganizationType, VendorType } from '../../../Models/Master';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../Services/encryption.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { ReportService } from '../../../Services/report.service';

@Component({
  selector: 'ngx-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  reportForm: FormGroup;
  TypeOfVendor: VendorType[] = [];
  Countries: Country[] = [];
  Regions: Region[] = [];
  orgTypes: OrganizationType[] = [];
  vendorTypes: { key: string, value: boolean }[] = [
    { key: "ISO", value: true },
    { key: "Non-ISO", value: false }
  ];

  Nicerglobe = ["Yes", "No"];
  today: Date;
  regionsForSelectedCountry: any;
  json_data: any;
  v_Id: number = 1;
  isTransporter: boolean = false;
  vendors: any[] = [];


  constructor(
    private _fb: FormBuilder,
    private _master: MasterService,
    private _report: ReportService
  ) { }

  ngOnInit() {
    this.reportForm = this._fb.group({
      Vendor_Category: [""],
      Country_Code: ["", [Validators.maxLength(3)]],
      Region_Id: [""],
      Category_Vendor: [""],
      Type_of_Vendor: [""],
      ISO_Due_Date: [""],
      Nicerglobe_Registration: [""]
    });

    this.getAllMasters();
  }




  getAllMasters() {
    forkJoin([
      this._master.getOrganizationTypes(),
      this._master.getVendorTypes(),
      this._master.getRegion(),
      this._master.getCountry()
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.orgTypes = res[0] as OrganizationType[];
        }
        if (res[1]) {
          this.TypeOfVendor = res[1] as VendorType[];
        }
        if (res[2]) {
          this.Regions = res[2] as Region[];
        }
        if (res[3]) {
          this.Countries = res[3] as Country[];
        }
      },
    });
  }


  onChange(event: any) {
    this.regionsForSelectedCountry = this.Regions.filter(
      (region) => region.Country_Code === event
    );
  }

  onChangeTransport(event: any) {
    if (event == 4) {
      this.isTransporter = true;
    }
    else {
      this.isTransporter = false;
    }
  }

  FilterAllVendors() {
    let report = new VendorReport();
    report = this.reportForm.value;
    if (Array.isArray(report.Vendor_Category)) {
      report.Vendor_Category = report.Vendor_Category[0];
    }
   
    this._report.filterAllVendors(report).subscribe({
      next: (res) => {
        this.vendors = res;
        console.log(res);
      }
    })
  }

}
