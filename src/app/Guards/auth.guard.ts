import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { LoginService } from "../Services/login.service";
import { CommonService } from "../Services/common.service";
import { snackbarStatus } from "../Enums/snackbar-status";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private _login: LoginService,
    private _router: Router,
    private _common: CommonService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let allowed = route.data.allowed;
    let notAllowed = route.data.notAllowed;
    if (this._login.isLoggedIn()) {
      if (this._login.hasRoles(allowed, notAllowed)) {
        return true;
      } else {
        this._common.openSnackbar(
          "Access denied. You don't have permission to view this page.",
          snackbarStatus.Danger
        );
        return false;
      }
    } else {
      this._router.navigate(["/auth/login"]);
      this._common.openSnackbar(
        "Please login and try again",
        snackbarStatus.Danger
      );
      return false;
    }
  }
}
