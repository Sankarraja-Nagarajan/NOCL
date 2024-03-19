import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../Services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginDetail } from '../../../Models/authModel';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private _fb: FormBuilder,
    private _login: LoginService,
    private _common: CommonService,
    private _router: Router) {

  }

  ngOnInit(): void {
    //login form initialization
    this.loginForm = this._fb.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  logIn() {
    if (this.loginForm.valid) {
      let loginDetail = new LoginDetail();
      loginDetail = this.loginForm.value;
      this.loginForm.reset();
      this._login.authUser(loginDetail).subscribe({
        next: (res) => {
          if (res) {
            sessionStorage.setItem('userDetails', JSON.stringify(res));
            this._router.navigate(['/registration']);
          }
        },
        error: (err) => {
          this._common.openSnackbar(err, snackbarStatus.Danger);
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
