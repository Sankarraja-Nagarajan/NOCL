import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/internal/Observable";
import {
  Approval,
  Form,
  FormSubmitTemplate,
  Rejection,
} from "../Models/Registration";
import { environment } from "../../environments/environment";
import { AppConfigService } from "./app-config.service";

@Injectable({
  providedIn: "root",
})
export class RegistrationService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService, private _config: AppConfigService) {
    this.baseURL = this._config.get("BaseURL");
  }

  // Initiate form
  formInitiate(form: Form): Observable<any> {
    const URL = `${this.baseURL}/Registration/Initiate`;
    return this._http.post(URL, form);
  }

  // Form submission
  formSubmit(form: FormSubmitTemplate): Observable<any> {
    const URL = `${this.baseURL}/Registration/Submit`;
    return this._http.post(URL, form);
  }

  // Form update
  formUpdate(form: FormSubmitTemplate): Observable<any> {
    const URL = `${this.baseURL}/Registration/Update`;
    return this._http.post(URL, form);
  }

  // Form approval
  formApproval(approval: Approval): Observable<any> {
    const URL = `${this.baseURL}/Registration/Approve`;
    return this._http.post(URL, approval);
  }

  // Form rejection
  formRejection(rejection: Rejection): Observable<any> {
    const URL = `${this.baseURL}/Registration/Reject`;
    return this._http.post(URL, rejection);
  }

  // Get Form data by form Id
  getFormData(formId: number, tableName: string): Observable<any> {
    const URL = `${this.baseURL}/GetFormData/GetFormData?formId=${formId}&tableName=${tableName}`;
    return this._http.get(URL);
  }

  // Get single Form Data
  getSingleFormData(formId: number): Observable<any> {
    const URL = `${this.baseURL}/Registration/GetSingleFormData?form_Id=${formId}`;
    return this._http.get(URL);
  }

  // Get reasons
  getReasons(formId: number): Observable<any> {
    const URL = `${this.baseURL}/Registration/GetRejectedReasons?form_Id=${formId}`;
    return this._http.get(URL);
  }
  getExpiryNotificationsByVendorCode(vCode: string): Observable<any> {
    const URL = `${this.baseURL}/Notifications/GetAllExpiryNotificationsByVendorCode?vCode=${vCode}`;
    return this._http.get(URL);
  }
  getAllExpiryNotifications(): Observable<any> {
    const URL = `${this.baseURL}/Notifications/GetAllExpiryNotifications`;
    return this._http.get(URL);
  }
  // Get GSTIN Details
  getGstDetails(gstin: string): Observable<any> {
    const URL = `${this.baseURL}/Registration/GetGstDetails?gstin=${gstin}`;
    return this._http.get(URL);
  }
}
