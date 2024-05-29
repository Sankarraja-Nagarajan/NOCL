import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { AppConfigService } from "./app-config.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService,private _config:AppConfigService) { 
    this.baseURL = this._config.get("BaseURL");
  }

  downloadVendorsReport(type: string): Observable<any> {
    const URL = `${this.baseURL}/Reports/DownloadVendorsAsExcel?type=${type}`;
    return this._http.getFile(URL);
  }
}
