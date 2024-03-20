import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseURL: string = 'https://localhost:44300/api';

  constructor(private _http: HttpService) { }

  // get all form data
  getAllData(emp_Id:string): Observable<any> {
    const URL = `${this.baseURL}/Dashboard/GetAllData?employeeId=${emp_Id}`;
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
}
