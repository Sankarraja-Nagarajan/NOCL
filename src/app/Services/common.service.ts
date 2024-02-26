import { Injectable } from "@angular/core";
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar,
} from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { snackbarStatus } from "../Enums/snackbar-status";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  mandatorySubject: Subject<boolean> = new Subject<boolean>();
  constructor(private _snackbar: MatSnackBar) {}

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


}
