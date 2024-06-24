import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { LoginService } from "../../../Services/login.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RequestOtp, VerifyOtp } from "../../../Models/authModel";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationService } from "../../../Services/registration.service";
import { Dashboard } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { isNullOrEmpty, setSession } from "../../../Utils";
import { EncryptionService } from "../../../Services/encryption.service";

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
    private _registration: RegistrationService,
    private _commonService: CommonService,
    private _encryptor: EncryptionService,
    
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.onboardingform = this._fb.group({
      firmname: [""],
      mobile: ["", Validators.required],
    });
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && !isNullOrEmpty(params["data"])) {
          const jsonData = JSON.parse(params["data"]);
          console.log("param", jsonData);
          this.form_Id = jsonData.Form_Id;
          this.vendorTypeId = jsonData.V_Id;
          this.getSingleFormData();
        }
      },
      error: (err) => {},
    });
  }

  getSingleFormData() {
    
    this._registration.getSingleFormData(this.form_Id).subscribe({
      next: (res) => {
        
        if (res) {
          this.singleFormData = res as Dashboard;
          this.onboardingform.get("firmname").patchValue(res.Name);
          this.onboardingform.get("mobile").patchValue(res.Mobile);
          this.onboardingform.disable();
        }
      },
      error: (err) => {
        
      },
    });
  }

  requestForOtp() {
    this.requestOtp = true;
    
    let payload = new RequestOtp();
    payload.FormId = this.form_Id;
    payload.Mobile = this.onboardingform.get("mobile").value;
    if (!payload.Mobile.includes("+91")) {
      payload.Mobile = "+91" + payload.Mobile;
    }
    this._login.requestOtp(payload).subscribe({
      next: (res) => {
        
        this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
      },
      error: (err) => {
        
      },
    });
  }

  Submit() {
    if (this.otp && this.otp.length == 6) {
      let verifyOtp = new VerifyOtp();
      verifyOtp.FormId = this.form_Id;
      verifyOtp.Mobile = this.onboardingform.get("mobile").value;
      verifyOtp.Otp = this.otp;

      this._login.verifyOtp(verifyOtp).subscribe({
        next: (res) => {
          if (res) {
            let jsonData = {
              Form_Id: this.form_Id,
              V_Id: this.vendorTypeId,
              Status: this.singleFormData.Status,
            };
            setSession("userDetails", JSON.stringify(res));
            this._router.navigate(["/registration/form"], {
              queryParams: {
                data: this._encryptor.encrypt(JSON.stringify(jsonData)),
              },
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
