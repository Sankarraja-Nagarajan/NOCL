import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../Services/login.service';
import { CommonService } from '../Services/common.service';
import { snackbarStatus } from '../Enums/snackbar-status';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})

export class AuthGuard implements CanActivate {
  constructor(private _login:LoginService, 
    private _router:Router,
    private _common:CommonService){

  }
  canActivate() {
    if(this._login.isLoggedIn()){
      return true;
    }
    else{
      this._router.navigate(['/auth/login']);
      this._common.openSnackbar('Please login and try again', snackbarStatus.Danger);
      return false;
    }
  }
}
