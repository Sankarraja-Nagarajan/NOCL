import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VendorService } from '../../../../Services/vendor.service';
import { CommonService } from '../../../../Services/common.service';
import { snackbarStatus } from '../../../../Enums/snackbar-status';
import { VendorMaster } from '../../../../Models/Dtos';

@Component({
  selector: 'ngx-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit, OnChanges {
  @Input() vendorType: string;

  displayedColumns: string[] = [
    'Vendor_Name',
    'Vendor_Mail',
    'Vendor_Mobile',
    'Vendor_Code',
    'Vendor_Type',
    'view'
  ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _vendor: VendorService,
    private _common: CommonService) {

  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vendorType) {
      console.log(this.vendorType);
      if (this.vendorType == 'ISO Vendors')
        this.getVendors(true);
      if (this.vendorType == 'Non-ISO Vendors')
        this.getVendors(false);
      if (this.vendorType == 'Transport Vendors')
        this.getTransportVendors();
    }
  }

  filterTableData(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getVendors(type: boolean) {
    this._vendor.getVendorsByType(type).subscribe({
      next: (res) => {
        if (res) {
          this.dataSource.data = res as VendorMaster[];
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  getTransportVendors() {
    this._vendor.getAllTransportVendors().subscribe({
      next: (res) => {
        if (res) {
          this.dataSource.data = res as VendorMaster[];
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }
}