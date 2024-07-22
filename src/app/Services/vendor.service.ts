import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService,private _config:AppConfigService) { 
    this.baseURL = this._config.get("BaseURL");
  }

  getVendorsByType(type:boolean): Observable<any> {
    const URL = `${this.baseURL}/Vendors/GetAllVendorsByType?type=${type}`;
    return this._http.get(URL);
  }

  getAllTransportVendors(): Observable<any> {
    const URL = `${this.baseURL}/Vendors/GetAllTransportVendors`;
    return this._http.get(URL);
  }

  getFormByVendorCode(vendorCode: string){
    const URL = `${this.baseURL}/GetFormData/GetVendorByCode?VendorCode=${vendorCode}`;
    return this._http.get(URL);
  }
}
