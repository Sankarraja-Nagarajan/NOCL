import { Component } from '@angular/core';
import { LoginService } from '../../../Services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  userForm: FormGroup

  constructor(private _services: LoginService, private _fb: FormBuilder) {
    this.userForm = _fb.group({
      empId: ['',Validators.required],
      fname: [''],
      mname: [''],
      lname: [''],
      email: [''],
      mobile: [''],
      role: [''],
      positionId: [''],
      managerId: [''],
      status: [''],
    })
  }

  checkNumber(e: KeyboardEvent) {
    this._services.numberOnly(e);
  }

  create() {
    if (this.userForm.valid) {
      console.log(this.userForm.value)
      this.userForm.reset();
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }

  datas = ['exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca', 'exalca']

}
