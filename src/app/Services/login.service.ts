import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpService } from "./http.service";
import {
  ForgotPassword,
  LoginDetail,
  RequestOtp,
  UpdatePassword,
  VerifyOtp,
} from "../Models/authModel";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseURL: string = environment.baseURL;

  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  private userChange = new Subject<any>();
  userChangeEmitted = this.userChange.asObservable();

  constructor(private _http: HttpService) {}

  islogin(change: boolean) {
    this.emitChangeSource.next(change);
  }

  isLoggedIn(): boolean {
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userData) {
      return !!userData.Token;
    } else {
      return false;
    }
  }

  numberOnly(event: KeyboardEvent): any {
    const Pattern = /[0-9]/;
    const Char = String.fromCharCode(event.charCode);
    if (!Pattern.test(Char)) {
      event.preventDefault();
      return false;
    } else return true;
  }

  authUser(loginDetails: LoginDetail): Observable<any> {
    const URL = this.baseURL + "/Auth/AuthenticateUser";
    return this._http.post(URL, loginDetails);
  }

  requestOtp(requestOtp: RequestOtp) {
    const URL = this.baseURL + "/Auth/RequestOtp";
    return this._http.post(URL, requestOtp);
  }

  verifyOtp(verifyOtp: VerifyOtp): Observable<any> {
    const URL = this.baseURL + "/Auth/VerifyOtp";
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
