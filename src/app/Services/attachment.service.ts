import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  baseURL: string = environment.baseURL;
  constructor(private _http: HttpService) { }

  attachFiles(formData: FormData): Observable<any> {
    const URL = `${this.baseURL}/Attachments/AttachFiles`;
    return this._http.postFile(URL, formData);
  }
}
