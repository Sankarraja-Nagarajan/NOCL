import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  baseURL: string = 'https://localhost:44300/api';
  constructor(private _http: HttpService) { }

  attachFiles(formData: FormData): Observable<any> {
    const URL = `${this.baseURL}/Attachments/AttachFiles`;
    return this._http.postFile(URL, formData);
  }
}
