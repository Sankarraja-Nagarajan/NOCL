import { Component } from '@angular/core';
import { LoginService } from '../../../Services/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {

  timeStart = true;
  requestOtp = false;
  submitBtnDisabled = true;

  firstNum: number;
  secondNum: number;
  thirdNum: number;
  fourthNum: number;
  fifthNum: number;
  sixthNum: number;
  finalOtp = 123456;
  enteredOtp: number;

  onboardingform: FormGroup;

  constructor(private _services: LoginService, private _fb: FormBuilder) {
    this.onboardingform = _fb.group({
      firmname: [''],
      email: [''],
    })
  }

  checkNumber(e: KeyboardEvent) {
    this._services.numberOnly(e);
  }

  requestForOtp() {
    this.requestOtp = true;
    this.submitBtnDisabled = false;
    this.timeStart = false;
    this.enteredOtp = this.firstNum + this.secondNum + this.thirdNum + this.fourthNum + this.fifthNum + this.sixthNum;
    setTimeout(() => {
      this.timeStart = true;
    }, 5000);
  }

  Submit() {
    console.log(this.onboardingform.value)
    console.log(this.enteredOtp);
  }
}
