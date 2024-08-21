import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { AppConfigService } from "./app-config.service";
import { VendorReport } from "../Models/Dtos";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService, private _config: AppConfigService) {
    this.baseURL = this._config.get("BaseURL");
  }

  downloadVendorsReport(type: string): Observable<any> {
    const URL = `${this.baseURL}/Reports/DownloadVendorsAsExcel?type=${type}`;
    return this._http.getFile(URL);
  }

  filterAllVendors(report: VendorReport): Observable<any> {
    const URL = this.baseURL + "/Reports/SearchAllVendors";
    return this._http.post(URL, report);
  }

  downloadFilteredVendors(report: VendorReport): Observable<any> {
    const URL = `${this.baseURL}/Reports/DownloadFilteredVendors`;
    return this._http.getFileByPost(URL, report);
  }

  downloadVendorByExpiry(): Observable<any> {
    const URL = `${this.baseURL}/Reports/DownloadVendorByExpiry`;
    return this._http.getFile(URL);
  }
}
