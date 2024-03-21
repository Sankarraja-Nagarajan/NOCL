import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpService } from "./http.service";
import { LoginDetail, User, VerifyOtp } from "../Models/authModel";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseURL: string = "https://localhost:44300/api";

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

  VerifyOtp(otp: VerifyOtp): Observable<any> {
    const URL = this.baseURL + "/Auth/VerifyOtp";
    return this._http.post(URL, otp);
  }

  emitUserData(user: User) {
    this.userChange.next(user);
  }
}
