import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpService } from "./http.service";
import {
  AuthResponse,
  ForgotPassword,
  LoginDetail,
  RequestOtp,
  UpdatePassword,
  VerifyOtp,
} from "../Models/authModel";
import { environment } from "../../environments/environment";
import { getSession, isArrayInclude, isNullOrEmpty } from "../Utils";
import { AppConfigService } from "./app-config.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseURL: string = environment.baseURL;

  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  private userChange = new Subject<any>();
  userChangeEmitted = this.userChange.asObservable();

  constructor(private _http: HttpService, private _config: AppConfigService) {
    this.baseURL = this._config.get("BaseURL");
  }

  islogin(change: boolean) {
    this.emitChangeSource.next(change);
  }

  isLoggedIn(): boolean {
    const userData = JSON.parse(getSession("userDetails"));
    if (userData) {
      return !!userData.Token;
    } else {
      return false;
    }
  }

  hasRoles(allowed: string[], notAllowed: string[]) {
    let user = JSON.parse(getSession("userDetails")) as AuthResponse;
    if (!isNullOrEmpty(user)) {
      return (
        isArrayInclude([user.Role], allowed) ||
        !isArrayInclude([user.Role], notAllowed)
      );
    } else return false;
  }

  authUser(loginDetails: LoginDetail): Observable<any> {
    const URL = this.baseURL + "/Auth/AuthenticateUser";
    return this._http.post(URL, loginDetails);
  }

  requestOtp(requestOtp: RequestOtp) {
    const URL = this.baseURL + "/Auth/RequestOtpForVendorLogin";
    return this._http.post(URL, requestOtp);
  }

  verifyOtp(verifyOtp: VerifyOtp): Observable<any> {
    const URL = this.baseURL + "/Auth/VerifyOtpForVendorLogin";
    return this._http.post(URL, verifyOtp);
  }

  changePassword(updatePassword: UpdatePassword) {
    const URL = this.baseURL + "/Auth/UpdatePassword";
    return this._http.post(URL, updatePassword);
  }

  forgotPasswordRequestOtp(emplyee_Id: string) {
    const URL =
      this.baseURL +
      `/Auth/RequestOtpForForgotPassword?employee_Id=${emplyee_Id}`;
    return this._http.get(URL);
  }

  forgotPassword(forgotPassword: ForgotPassword) {
    const URL = this.baseURL + "/Auth/ForgotPassword";
    return this._http.post(URL, forgotPassword);
  }
}
