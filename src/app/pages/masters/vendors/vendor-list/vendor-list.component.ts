import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { VendorService } from "../../../../Services/vendor.service";
import { CommonService } from "../../../../Services/common.service";
import { VendorMaster } from "../../../../Models/Dtos";
import { Router } from "@angular/router";
import { setSession } from "../../../../Utils";

@Component({
  selector: "ngx-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
})
export class VendorListComponent implements OnInit, OnChanges {
  @Input() vendorType: string;
  @Input() searchText: string;

  displayedColumns: string[] = [
    "Vendor_Name",
    "Vendor_Mail",
    "Vendor_Mobile",
    "Vendor_Code",
    "Vendor_Type",
    "view",
  ];
  dataSource = new MatTableDataSource<VendorMaster>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _vendor: VendorService,
    private _common: CommonService,
    private _router: Router,
    
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vendorType) {
      if (this.vendorType == "ISO Vendors") this.getVendors(true);
      if (this.vendorType == "Non-ISO Vendors") this.getVendors(false);
      if (this.vendorType == "Transport Vendors") this.getTransportVendors();
    }

    if (changes.searchText) {
      this.dataSource.filter = this.searchText.trim().toLowerCase();
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
        
      },
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
        
      },
    });
  }

  preview(i: number) {
    let formInfo = {
      FormId: this.dataSource.data[i].Form_Id,
      VT_Id: this.dataSource.data[i].VT_Id,
      Vendor_Type : this.dataSource.data[i].Vendor_Type
    };
    setSession("vendorInfo", JSON.stringify(formInfo));
    this._router.navigate(["/profile/"]);
  }
}
