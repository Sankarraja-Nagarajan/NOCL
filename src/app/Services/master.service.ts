import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  baseURL: string = 'https://localhost:44300/api';

  constructor(private _http: HttpService) { }

  // Get Company codes
  getCompanyCodes(): Observable<any> {
    const URL = this.baseURL + '/Master/GetCompanyCodes';
    return this._http.get(URL);
  }

  // get Departments
  getDepartments():Observable<any>{
    const URL = this.baseURL + '/Master/GetDepartments';
    return this._http.get(URL);
  }

  // get vendor types
  getVendorTypes():Observable<any>{
    const URL = this.baseURL + '/Master/GetVendorTypes';
    return this._http.get(URL);
  }

  // get Organization types
  getOrganizationTypes():Observable<any>{
    const URL = this.baseURL + '/Master/GetOrganizationTypes';
    return this._http.get(URL);
  }

  // get company statuses
  getCompanyStatuses():Observable<any>{
    const URL = this.baseURL + '/Master/GetCompanyStatuses';
    return this._http.get(URL);
  }

  // Get Address Types
  getAddressTypes():Observable<any>{
    const URL = this.baseURL + '/Master/GetAddressTypes';
    return this._http.get(URL);
  }

  // Get Contact Types
  getContactTypes():Observable<any>{
    const URL = this.baseURL + '/Master/GetContactTypes';
    return this._http.get(URL);
  }

  // get roles
  getRoles():Observable<any>{
    const URL = this.baseURL + '/Roles/GetRoles';
    return this._http.get(URL);
  }
}
