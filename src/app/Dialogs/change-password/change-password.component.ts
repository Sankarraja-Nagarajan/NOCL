import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AppConfigService } from "../../Services/app-config.service";
import { CommonService } from "../../Services/common.service";
import { AuthResponse, UpdatePassword } from "../../Models/authModel";
import { snackbarStatus } from "../../Enums/snackbar-status";
import { LoginService } from "../../Services/login.service";

@Component({
  selector: "ngx-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  authResponse: AuthResponse = new AuthResponse();
  loader: boolean = false;

  comparePassword: boolean = false;
  verifyPassword: boolean = false;

  constructor(
    public _dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _common: CommonService,
    private _config: AppConfigService,
    private _fb: FormBuilder,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this._fb.group({
      OldPassword: ["", [Validators.required, Validators.minLength(8)]],
      NewPassword: ["", [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ["", [Validators.required, Validators.minLength(8)]],
    });

    this.authResponse = JSON.parse(
      sessionStorage.getItem("userDetails")
    ) as AuthResponse;
    if (!this.authResponse.Employee_Id) {
      this._common.openSnackbar("Please login again!", snackbarStatus.Danger);
      this._dialogRef.close();
    }
  }

  changePassword() {
    this.comparePasswords();
    this.verifyPasswords();
    if (
      this.changePasswordForm.valid &&
      !this.comparePassword &&
      !this.verifyPassword
    ) {
      this.loader = true;
      let update = new UpdatePassword();
      update.CurrentPassword = this.changePasswordForm.value["OldPassword"];
      update.NewPassword = this.changePasswordForm.value["NewPassword"];
      update.EmployeeId = this.authResponse.Employee_Id;

      this._login.changePassword(update).subscribe({
        next: (res) => {
          if (res) {
            this.loader = false;
            this._common.openSnackbar(
              "Password Updated Successfully",
              snackbarStatus.Success
            );
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this.loader = false;
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  verifyPasswords(): void {
    this.verifyPassword =
      this.changePasswordForm.get("NewPassword").value !=
      this.changePasswordForm.get("ConfirmPassword").value;
  }

  comparePasswords(): void {
    this.comparePassword =
      this.changePasswordForm.get("OldPassword").value ===
      this.changePasswordForm.get("NewPassword").value;
  }
}
