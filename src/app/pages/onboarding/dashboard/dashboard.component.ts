import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Data, Router } from '@angular/router';
import { DashboardService } from '../../../Services/dashboard.service';
import { Dashboard, InitialData } from '../../../Models/Dtos';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { AuthResponse } from '../../../Models/authModel';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  authResponse: AuthResponse;
  emp_id: string;
  headerStatus: string;
  displayedColumns: string[] = [
    'FormId',
    'Name',
    'VendorType',
    'Email',
    'Mobile',
    'CreatedOn',
    'Status',
    'Action'];
  dashboardAllData: Dashboard[] = [];
  dataSource = new MatTableDataSource(this.dashboardAllData);
  selection = new SelectionModel(true, []);
  initialDashboardData: InitialData = new InitialData();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _dashboard: DashboardService,
    private _common: CommonService,
    private _router: Router) {

  }
  ngOnInit(): void {
    this.authResponse = JSON.parse(sessionStorage.getItem('userDetails')) as AuthResponse;
    this.emp_id = this.authResponse.Employee_Id;
    // get dashboard data
    this._dashboard.getInitialData(this.emp_id).subscribe({
      next: (res) => {
        this.dashboardAllData = res.Data as Dashboard[];
        this.dataSource = new MatTableDataSource(this.dashboardAllData);
        this.initialDashboardData.Open = res.Open;
        this.initialDashboardData.Pending = res.Pending;
        this.initialDashboardData.Approved = res.Approved;
        this.initialDashboardData.Rejected = res.Rejected;
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
    this.headerStatus = 'Pending';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  data(status: string) {
    switch (status) {
      case 'Open':
        this.getAllOpenData();
        break;
      case 'Pending':
        this.getAllPendingData();
        break;
      case 'Approved':
        this.getAllApprovedData();
        break;
      case 'Rejected':
        this.getAllRejectedData();
        break;
      default:

    }
  }

  filterTableData(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllOpenData() {
    this._dashboard.getInitiatedData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = 'Open';
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  getAllPendingData() {
    this._dashboard.getPendingData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = 'Pending';
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  getAllApprovedData() {
    this._dashboard.getApprovedData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = 'Approved';
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  getAllRejectedData() {
    this._dashboard.getRejectedData(this.emp_id).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.headerStatus = 'Rejected';
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  // Form Review - Review btn click
  formReview(element: Dashboard) {
    let jsonData = {
      Form_Id: element.FormId,
      V_Id: element.VendorTypeId,
      Status:element.Status
    };

    this._router.navigate(['registration/form'], {
      queryParams: {
        data: JSON.stringify(jsonData)
      }
    });
  }
}
