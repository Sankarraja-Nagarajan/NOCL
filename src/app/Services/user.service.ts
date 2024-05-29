import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { User } from '../Models/Dtos';
import { environment } from '../../environments/environment';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService,private _config:AppConfigService) { 
    this.baseURL = this._config.get("BaseURL");
  }

  getUsers(): Observable<any> {
    const URL = `${this.baseURL}/Users/GetUsers`;
    return this._http.get(URL);
  }

  addUser(user: User): Observable<any> {
    const URL = `${this.baseURL}/Users/AddUser`;
    return this._http.post(URL, user);
  }

  softDeleteUser(user: User): Observable<any> {
    const URL = `${this.baseURL}/Users/SoftDeleteUser`;
    return this._http.post(URL, user);
  }

  updateUser(user: User): Observable<any> {
    const URL = `${this.baseURL}/Users/UpdateUser`;
    return this._http.post(URL, user);
  }
}
