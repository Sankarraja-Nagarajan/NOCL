import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AppConfigService } from "../../Services/app-config.service";
import { CommonService } from "../../Services/common.service";
import { LoginService } from "../../Services/login.service";
import { snackbarStatus } from "../../Enums/snackbar-status";
import { AuthResponse, ForgotPassword } from "../../Models/authModel";
import { error } from "console";

@Component({
  selector: "ngx-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  loader: boolean = false;
  forgotPasswordForm: FormGroup;
  authResponse: AuthResponse = new AuthResponse();
  requestOtp: boolean = false;
  verifyPassword: boolean;

  constructor(
    public _dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _common: CommonService,
    private _config: AppConfigService,
    private _fb: FormBuilder,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this._fb.group({
      Employee_Id: ["", Validators.required],
      Otp: ["", [Validators.required, Validators.minLength(6)]],
      NewPassword: ["", [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  requestForOtp() {
    if (this.forgotPasswordForm.get("Employee_Id").valid) {
      this.loader = true;
      this._login
        .forgotPasswordRequestOtp(
          this.forgotPasswordForm.get("Employee_Id").value
        )
        .subscribe({
          next: (res) => {
            this.loader = false;
            this.requestOtp = true;
            this._common.openSnackbar(res.Message, snackbarStatus.Success);
          },
          error: (err) => {
            this.loader = false;
          },
        });
    } else {
      this._common.openSnackbar(
        "Employee_Id is required",
        snackbarStatus.Danger
      );
    }
  }

  submit() {
    this.verifyPasswords();
    if (this.forgotPasswordForm.valid && this.verifyPassword) {
      let forgotPwd = new ForgotPassword();
      forgotPwd = this.forgotPasswordForm.value;
      forgotPwd.Password = this.forgotPasswordForm.value["NewPassword"];
      this.loader = true;
      this._login.forgotPassword(forgotPwd).subscribe({
        next: (res) => {
          this.loader = false;
          this._common.openSnackbar(
            "Password updated successfully",
            snackbarStatus.Success
          );
          this._dialogRef.close(true);
        },
        error: (err) => {
          this.loader = false;
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  verifyPasswords(): void {
    this.verifyPassword =
      this.forgotPasswordForm.get("NewPassword").value !=
      this.forgotPasswordForm.get("ConfirmPassword").value;
  }
}
