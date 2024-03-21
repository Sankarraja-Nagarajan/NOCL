import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { LoginService } from "../../../Services/login.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VerifyOtp } from "../../../Models/authModel";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "ngx-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class OtpComponent implements OnInit {
  timeStart = true;
  requestOtp = false;
  submitBtnDisabled = true;

  onboardingform: FormGroup;
  otp: any;

  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
  };
  form_Id: any;
  vendorTypeId: any;

  constructor(
    private _login: LoginService,
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.onboardingform = _fb.group({
      firmname: [""],
      mobile: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && params["data"] != null) {
          const jsonData = JSON.parse(params["data"]);
          this.form_Id = jsonData.Form_Id;
          this.vendorTypeId = jsonData.V_Id;

        }
      },
      error: (err) => {},
    });
  }

  requestForOtp() {
    this.requestOtp = true;
  }

  Submit() {
    if (this.otp.length == 6) {
      let verifyOtp = new VerifyOtp();
      verifyOtp.FormId = this.form_Id;
      verifyOtp.Mobile = this.onboardingform.get("mobile").value;
      verifyOtp.Otp = this.otp;

      this._login.VerifyOtp(verifyOtp).subscribe({
        next: (res) => {
          if (res) {
            let jsonData = {
              Form_Id: this.form_Id,
              V_Id: this.vendorTypeId,
              Status:'Initiated'
            };
            sessionStorage.setItem("userDetails", JSON.stringify(res));
            this._router.navigate(["/registration/form"], {
              queryParams: { data: JSON.stringify(jsonData) },
            });
          }
        },
        error: (err) => {},
      });
    } else {
      alert("Enter OTP");
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
  }
}
