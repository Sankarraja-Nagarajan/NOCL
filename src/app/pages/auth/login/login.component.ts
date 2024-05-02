import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../../Services/login.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginDetail } from "../../../Models/authModel";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { Router } from "@angular/router";
import { ForgotPasswordComponent } from "../../../Dialogs/forgot-password/forgot-password.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loader: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _login: LoginService,
    private _common: CommonService,
    private _router: Router,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //login form initialization
    this.loginForm = this._fb.group({
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
    });
  }

  logIn() {
    if (this.loginForm.valid) {
      let loginDetail = new LoginDetail();
      loginDetail = this.loginForm.value;
      this.loader = true;
      this._login.authUser(loginDetail).subscribe({
        next: (res) => {
          if (res) {
            this.loader = false;
            this.loginForm.reset();
            sessionStorage.setItem("userDetails", JSON.stringify(res));
            if (res.Role != "Vendor") {
              this._router.navigate(["onboarding/dashboard"]);
              this._common.openSnackbar(
                "Login Success",
                snackbarStatus.Success
              );
            } else {
              this._router.navigate(["auth/login"]);
              this._common.openSnackbar(
                "You don't have permission to access this portal",
                snackbarStatus.Danger
              );
            }
          }
        },
        error: (err) => {
          this.loader = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  forgotPassword() {
    const dialogconfig: MatDialogConfig = {
      data: {},
      autoFocus: false,
    };
    const dialogRef = this._dialog.open(ForgotPasswordComponent, dialogconfig);
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this._common.openSnackbar(
            "Your Password hasbeen updated successfully",
            snackbarStatus.Success
          );
        }
      },
      error: (err) => {},
    });
  }
}
