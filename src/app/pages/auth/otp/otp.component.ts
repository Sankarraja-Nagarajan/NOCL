import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { LoginService } from "../../../Services/login.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VerifyOtp } from "../../../Models/authModel";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationService } from "../../../Services/registration.service";
import { error } from "console";
import { Dashboard } from "../../../Models/Dtos";

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
  singleFormData: Dashboard = new Dashboard();

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
  loader: boolean = false;

  constructor(
    private _login: LoginService,
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _registration: RegistrationService
  ) {
    this.onboardingform = _fb.group({
      firmname: [""],
      mobile: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    sessionStorage.clear();
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && params["data"] != null) {
          const jsonData = JSON.parse(params["data"]);
          this.form_Id = jsonData.Form_Id;
          this.vendorTypeId = jsonData.V_Id;
          this.getSingleFormData();
        }
      },
      error: (err) => { },
    });
  }

  getSingleFormData() {
    this.loader = true;
    this._registration.getSingleFormData(this.form_Id).subscribe({
      next: (res) => {
        this.loader = false;
        console.log(res);
        if (res) {
          this.singleFormData = res as Dashboard;
          this.onboardingform.get("firmname").patchValue(res.Name);
          this.onboardingform.get("mobile").patchValue(res.Mobile);
          this.onboardingform.disable();
        }
      },
      error: (err) => {
        this.loader = false;
      },
    });
  }

  requestForOtp() {
    this.requestOtp = true;
  }

  Submit() {
    if (this.otp && this.otp.length == 6) {
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
              Status: this.singleFormData.Status,
            };
            sessionStorage.setItem("userDetails", JSON.stringify(res));
            this._router.navigate(["/registration/form"], {
              queryParams: { data: JSON.stringify(jsonData) }
            });
          }
        },
        error: (err) => { },
      });
    } else {
      alert("Enter OTP");
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
  }
}
