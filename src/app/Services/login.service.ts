import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();
  
  constructor() { }

  islogin(change: boolean) {
    this.emitChangeSource.next(change);
  }

  numberOnly(event:KeyboardEvent): any{
    const Pattern = /[0-9]/;
    const Char= String.fromCharCode(event.charCode)
    if(!Pattern.test(Char)){
      event.preventDefault();
      return(false)
    }
    else
    return(true)
  }

}
