import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService) { }

  // get initial form data
  getInitialData(emp_Id:string): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetInitialData?employeeId=${emp_Id}`;
    return this._http.get(URL);
  }

  // get Initiated form data
  getInitiatedData(emp_Id:string): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetInitiatedData?employeeId=${emp_Id}`;
    return this._http.get(URL);
  }

  // get Pending form data
  getPendingData(emp_Id:string): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetPendingData?employeeId=${emp_Id}`;
    return this._http.get(URL);
  }

  // get Approved form data
  getApprovedData(emp_Id:string): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetApprovedData?employeeId=${emp_Id}`;
    return this._http.get(URL);
  }

  // get Rejected form data
  getRejectedData(emp_Id:string): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetRejectedData?employeeId=${emp_Id}`;
    return this._http.get(URL);
  }

  // get All form data
  getAllData(): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetAllData`;
    return this._http.get(URL);
  }

}
