import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { DashboardService } from "../../../Services/dashboard.service";
import { Dashboard, InitialData } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { AuthResponse } from "../../../Models/authModel";

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  authResponse: AuthResponse;
  loader: boolean = false;
  emp_id: string;
  headerStatus: string;
  displayedColumns: string[] = [
    "FormId",
    "Name",
    "VendorType",
    "Email",
    "Mobile",
    "CreatedOn",
    "Status",
    "Action",
  ];
  dashboardAllData: Dashboard[] = [];
  dataSource = new MatTableDataSource(this.dashboardAllData);
  selection = new SelectionModel(true, []);
  initialDashboardData: InitialData = new InitialData();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _dashboard: DashboardService,
    private _common: CommonService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.authResponse = JSON.parse(
      sessionStorage.getItem("userDetails")
    ) as AuthResponse;
    this.emp_id = this.authResponse.Employee_Id;
    // get dashboard data
    if(this.authResponse.Role == "Admin"){
      this.getAllData();
      this.headerStatus = "All";
    }
    else{
      this.getInitialData();
      this.headerStatus = "Pending";
    }
    
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  data(status: string) {
    switch (status) {
      case "Open":
        this.getAllOpenData();
        break;
      case "Pending":
        this.getAllPendingData();
        break;
      case "Approved":
        this.getAllApprovedData();
        break;
      case "Rejected":
        this.getAllRejectedData();
        break;
      case "SAP":
        this.getAllSAPData();
        break;
      default:
    }
  }

  filterTableData(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getInitialData(){
    this.loader = true;
    this._dashboard.getInitialData(this.emp_id).subscribe({
      next: (res) => {
        this.dashboardAllData = res.Data as Dashboard[];
        this.dataSource = new MatTableDataSource(this.dashboardAllData);
        this.initialDashboardData.Open = res.Open;
        this.initialDashboardData.Pending = res.Pending;
        this.initialDashboardData.Approved = res.Approved;
        this.initialDashboardData.Rejected = res.Rejected;
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getAllData(){
    this.loader = true;
    this._dashboard.getAllData().subscribe({
      next: (res) => {
        this.dashboardAllData = res.Data as Dashboard[];
        this.dataSource = new MatTableDataSource(this.dashboardAllData);
        this.initialDashboardData.Open = res.Open;
        this.initialDashboardData.Pending = res.Pending;
        this.initialDashboardData.Approved = res.Approved;
        this.initialDashboardData.Rejected = res.Rejected;
        this.initialDashboardData.SAP = res.SAP;
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getAllOpenData() {
    this.loader = true;
    this._dashboard.getInitiatedData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.loader = false;
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = "Open";
        }
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getAllPendingData() {
    this.loader = true;
    this._dashboard.getPendingData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = "Pending";
          this.loader = false;
        }
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getAllApprovedData() {
    this.loader = true;
    this._dashboard.getApprovedData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = "Approved";
          this.loader = false;
        }
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getAllRejectedData() {
    this.loader = true;
    this._dashboard.getRejectedData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = "Rejected";
          this.loader = false;
        }
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  getAllSAPData(){

  }

  // Form Review - Review btn click
  formReview(element: Dashboard) {
    let jsonData = {
      Form_Id: element.FormId,
      V_Id: element.VendorTypeId,
      Status: element.Status,
    };

    this._router.navigate(["registration/form"], {
      queryParams: {
        data: JSON.stringify(jsonData),
      },
    });
  }
}
