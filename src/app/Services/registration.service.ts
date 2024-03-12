import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/internal/Observable';
import { Approval, Form, FormSubmitTemplate, Rejection } from '../Models/Registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseURL: string = 'https://localhost:44300/api';

  constructor(private _http: HttpService) { }

  // Initiate form registration
  initiateRegistration(form: Form): Observable<any> {
    const URL = `${this.baseURL}/Registration/InitiateRegistration`;
    return this._http.post(URL, form);
  }

  // Form submission
  submitForm(form: FormSubmitTemplate): Observable<any> {
    const URL = `${this.baseURL}/Registration/SubmitForm`;
    return this._http.post(URL, form);
  }

  // Form approval
  approval(approval: Approval): Observable<any> {
    const URL = `${this.baseURL}/Registration/Approval`;
    return this._http.post(URL, approval);
  }

  // Form rejection
  rejection(rejection: Rejection): Observable<any> {
    const URL = `${this.baseURL}/Registration/Rejection`;
    return this._http.post(URL, rejection);
  }
}
