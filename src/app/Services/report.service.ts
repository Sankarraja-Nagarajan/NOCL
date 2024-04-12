import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService) {}

  downloadVendorsReport(type: string): Observable<any> {
    const URL = `${this.baseURL}/Reports/DownloadVendorsAsExcel?type=${type}`;
    return this._http.getFile(URL);
  }
}
