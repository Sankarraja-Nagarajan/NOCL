import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { Approval, FormSubmitTemplate, Rejection } from '../Models/Registration';

@Injectable({
  providedIn: 'root'
})
export class EditRequestService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService, private _config: AppConfigService) {
    this.baseURL = this._config.get("BaseURL");
  }


  editRequest(RequestForEdit) {
    const URL = `${this.baseURL}/EditRequest/RequestForEdit`;
    return this._http.post(URL, RequestForEdit);
  }

  getEditRequestData(emp_Id: string): Observable<any> {
    const URL = `${this.baseURL}/EditRequest/GetEditRequestData?employeeId=${emp_Id}`;
    return this._http.get(URL);
  }

  rejectEditRequest(formId: number, reason: string): Observable<any> {
    const URL = `${this.baseURL}/EditRequest/RejectEditRequest?formId=${formId}&reason=${reason}`;
    return this._http.postUrl(URL);
  }

  acceptEditRequest(formId: number): Observable<any> {
    const URL = `${this.baseURL}/EditRequest/AcceptEditRequest?formId=${formId}`;
    return this._http.postUrl(URL);
  }

  editFormUpdate(form: FormSubmitTemplate): Observable<any> {
    const URL = `${this.baseURL}/EditRequest/Update`;
    return this._http.post(URL, form);
  }

  // Form edit approval
  formApproval(approval: Approval): Observable<any> {
    const URL = `${this.baseURL}/EditRequest/Approve`;
    return this._http.post(URL, approval);
  }

  // Form edit rejection
  formRejection(rejection: Rejection): Observable<any> {
    const URL = `${this.baseURL}/EditRequest/Reject`;
    return this._http.post(URL, rejection);
  }
}
