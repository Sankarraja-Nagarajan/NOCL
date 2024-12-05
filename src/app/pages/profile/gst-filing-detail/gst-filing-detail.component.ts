import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { RegistrationService } from '../../../Services/registration.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GST_Filing_Dto } from '../../../Models/Dtos';

@Component({
  selector: 'ngx-gst-filing-detail',
  templateUrl: './gst-filing-detail.component.html',
  styleUrls: ['./gst-filing-detail.component.scss']
})
export class GstFilingDetailComponent {

  @Output() hasGstFilingDetail: EventEmitter<boolean> = new EventEmitter();
  vendorInfo: any;
  formId: number;
  gstFilingDetails: GST_Filing_Dto[] = [];
  dataSource = new MatTableDataSource(this.gstFilingDetails);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "arn",
    "mof",
    "status",
    "rtntype",
    "ret_prd",
    "dof",
    "valid"
  ];


  constructor(private _registration: RegistrationService,
    private _commonService: CommonService) { }

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;

    this.getGstFilingDetails();
  }

  getGstFilingDetails() {
    this._registration.getFormData(this.formId, "GSTFilingDetails").subscribe({
      next: (res) => {
        if (res) {
          this.gstFilingDetails = res;
          this.dataSource = new MatTableDataSource(this.gstFilingDetails);
          this.dataSource.paginator = this.paginator;
          this.hasGstFilingDetail.emit(true);
        }
        else {
          this.hasGstFilingDetail.emit(false);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
        this.hasGstFilingDetail.emit(false);
      },
    });
  }

}
