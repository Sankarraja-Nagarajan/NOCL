import { Injectable } from "@angular/core";
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar,
} from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { snackbarStatus } from "../Enums/snackbar-status";
import { NbSidebarService } from "@nebular/theme";

@Injectable({
  providedIn: "root",
})
export class CommonService {

  // sidebarFooterLogo: string="";

  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  mandatorySubject: Subject<boolean> = new Subject<boolean>();
  footerLogoVisible:boolean = true;

  constructor(private _snackbar: MatSnackBar,private sidebarService: NbSidebarService) { }

  // Opens Snackbar notification
  openSnackbar(
    message: string,
    status: snackbarStatus,
    duration: number = 2500
  ) {
    let config = {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:
        status === snackbarStatus.Success
          ? "success"
          : status === snackbarStatus.Danger
            ? "danger"
            : status === snackbarStatus.Warning
              ? "warning"
              : "info",
    };
    this._snackbar.open(message, "", config);
  }

  KeyPressValidation(event): boolean {
    const k = event.which ? event.which : event.keyCode;

    return (
      (k == 32) ||
      (k == 43) ||
      (k >= 48 && k <= 57)
    );
  }

  getStateOfSidebar(){
    this.sidebarService.getSidebarState('menu-sidebar').subscribe({
      next:(res)=>{
        console.log(res);
        res && res=="expanded" ? this.footerLogoVisible = true : this.footerLogoVisible = false;
      },
    });
  }
}
