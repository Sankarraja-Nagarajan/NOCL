import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NbRouteTab } from "@nebular/theme";
import { ReportService } from "../../../Services/report.service";
import { FileSaverService } from "../../../Services/file-saver.service";
import { HttpHeaderResponse, HttpResponse } from "@angular/common/http";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "ngx-vendors",
  templateUrl: "./vendors.component.html",
  styleUrls: ["./vendors.component.scss"],
})
export class VendorsComponent implements OnInit {
  tabChange: EventEmitter<NbRouteTab> = new EventEmitter();
  searchText: string = "";
  tabLinks: string[] = ["ISO Vendors", "Non-ISO Vendors", "Transport Vendors"];
  activeLink: string = this.tabLinks[0];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  vendorType: string;
  constructor(
    private _reports: ReportService,
    private _fileSaver: FileSaverService
  ) {}

  ngOnInit(): void {
    this.vendorType = this.tabLinks[0];
  }

  onTabChange(event: MatTabChangeEvent) {
    this.vendorType = this.tabLinks[event.index];
  }

  filterVendor(text) {
    this.searchText = text;
  }

  downloadVendorsReport() {
    this._reports
      .downloadVendorsReport(this.getQueryParamByTabTitle())
      .subscribe({
        next: (res) => {
          this._fileSaver.downloadBlob(res.body as Blob, this.getFileName());
        },
      });
  }

  getQueryParamByTabTitle() {
    let param = "";
    switch (this.vendorType) {
      case "ISO Vendors":
        param = "ISO";
        break;
      case "NON-ISO Vendors":
        param = "NONISO";
        break;
      case "Transport Vendors":
        param = "Transport";
        break;
    }
    return param;
  }

  getFileName() {
    let name = this.getQueryParamByTabTitle();
    let dt = new Date().toDateString();
    return name + "_Vendors_" + dt + ".xlsx";
  }
}
