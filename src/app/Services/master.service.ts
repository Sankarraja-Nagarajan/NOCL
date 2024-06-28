import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Role } from "../Models/Dtos";
import { AppConfigService } from "./app-config.service";
import { VendorGrade } from "../Models/Master";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService, private _config: AppConfigService) {
    this.baseURL = this._config.get("BaseURL");
  }

  //#region  Get Master Data
  // Get Company codes
  getCompanyCodes(): Observable<any> {
    const URL = this.baseURL + "/Master/GetCompanyCodes";
    return this._http.get(URL);
  }

  // get Departments
  getDepartments(): Observable<any> {
    const URL = this.baseURL + "/Master/GetDepartments";
    return this._http.get(URL);
  }

  // get vendor types
  getVendorTypes(): Observable<any> {
    const URL = this.baseURL + "/Master/GetVendorTypes";
    return this._http.get(URL);
  }

  // get Organization types
  getOrganizationTypes(): Observable<any> {
    const URL = this.baseURL + "/Master/GetOrganizationTypes";
    return this._http.get(URL);
  }

  // get company statuses
  getCompanyStatuses(): Observable<any> {
    const URL = this.baseURL + "/Master/GetCompanyStatuses";
    return this._http.get(URL);
  }

  // Get Address Types
  getAddressTypes(): Observable<any> {
    const URL = this.baseURL + "/Master/GetAddressTypes";
    return this._http.get(URL);
  }

  // Get Contact Types
  getContactTypes(): Observable<any> {
    const URL = this.baseURL + "/Master/GetContactTypes";
    return this._http.get(URL);
  }

  // get roles
  getRoles(): Observable<any> {
    const URL = this.baseURL + "/Roles/GetRoles";
    return this._http.get(URL);
  }

  // get vendor types
  getTankerTypes(): Observable<any> {
    const URL = this.baseURL + "/Master/GetTankerTypes";
    return this._http.get(URL);
  }

  // get Vendor Profile
  getVendorProfile(formId: number): Observable<any> {
    const URL = this.baseURL + `/GetFormData/GetVendorProfile?formId=${formId}`;
    return this._http.get(URL);
  }

  // get Title
  getTitle(): Observable<any> {
    const URL = this.baseURL + "/Master/GetTitle";
    return this._http.get(URL);
  }

  // get GST Ven Class
  getGSTVenClass(): Observable<any> {
    const URL = this.baseURL + "/Master/GetGSTVenClass";
    return this._http.get(URL);
  }

  // get Country
  getCountry(): Observable<any> {
    const URL = this.baseURL + "/Master/GetCountry";
    return this._http.get(URL);
  }

  // get Region
  getRegion(): Observable<any> {
    const URL = this.baseURL + "/Master/GetRegionByCompanyCode";
    return this._http.get(URL);
  }

  // get Industry
  getIndustry(): Observable<any> {
    const URL = this.baseURL + "/Master/GetIndustry";
    return this._http.get(URL);
  }

  // get Incoterms
  getIncoterms(): Observable<any> {
    const URL = this.baseURL + "/Master/GetIncoterms";
    return this._http.get(URL);
  }

  // get ReconciliationAccounts
  getReconciliationAccounts(): Observable<any> {
    const URL = this.baseURL + "/Master/GetReconciliationAccounts";
    return this._http.get(URL);
  }

  // get SchemaGroups
  getSchemaGroups(): Observable<any> {
    const URL = this.baseURL + "/Master/GetSchemaGroups";
    return this._http.get(URL);
  }

  //get PurchaseOrganizations
  getPurchaseOrganization(): Observable<any> {
    const URL = this.baseURL + "/Master/GetPurchaseOrganization";
    return this._http.get(URL);
  }

  //get AccountGroup
  getAccountGroup():Observable<any>{
    const URL = this.baseURL + "/Master/GetVendorAccountGroup";
    return this._http.get(URL);
  }

  //#endregion

  //#region Create Masters

  createRole(role: Role) {
    const URL = this.baseURL + "/Roles/AddRole";
    return this._http.post(URL, role);
  }

  //#endregion

  //#region Update Masters

  updateRole(role: Role) {
    const URL = this.baseURL + "/Roles/UpdateRole";
    return this._http.put(URL, role);
  }

  //#endregion

  addVendorGrade(grade: VendorGrade){
    const URL = this.baseURL + "/VendorGrade/AddVendorGrade";
    return this._http.post(URL, grade);
  }

  updateVendorGrade(grade: VendorGrade){
    const URL = this.baseURL + "/VendorGrade/UpdateVendorGrade";
    return this._http.post(URL, grade);
  }
}
