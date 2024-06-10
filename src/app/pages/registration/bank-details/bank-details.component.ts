import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Bank_Detail } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { getSession } from "../../../Utils";

@Component({
  selector: "ngx-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.scss"],
})
export class BankDetailsComponent {
  @Input() form_Id: number;
  @Input() v_Id: number;
  @Input() isReadOnly: boolean;

  bankDetailsForm: FormGroup;
  authResponse: AuthResponse;
  bankId: number = 0;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService
  ) {}

  ngOnInit(): void {
    this.bankDetailsForm = this._fb.group({
      AccountHolder: ["", [Validators.required, Validators.maxLength(100)]],
      Bank: ["", [Validators.required, Validators.maxLength(100)]],
      Branch: ["", [Validators.required, Validators.maxLength(30)]],
      Address: [""],
      Account_Number: ["", [Validators.required, Validators.maxLength(30)]],
      IFSC: [
        "",
        [
          Validators.maxLength(11),
          Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$"),
        ],
      ],
      SWIFT: ["", [Validators.maxLength(11)]],
      IBAN: ["", [Validators.maxLength(34)]],
    });

    if (this.v_Id == 4) {
      this.bankDetailsForm.get("SWIFT").addValidators(Validators.required);
      this.bankDetailsForm.get("IBAN").addValidators(Validators.required);
    } else {
      this.bankDetailsForm.get("IFSC").addValidators(Validators.required);
    }

    this.authResponse = JSON.parse(getSession("userDetails"));
    if (this.isReadOnly) {
      this.bankDetailsForm.disable();
    }
    // Get Form data by form Id
    this._registration.getFormData(this.form_Id, "BankDetail").subscribe({
      next: (res) => {
        if (res) {
          this.bankId = (res as Bank_Detail).Id;
          this.bankDetailsForm.patchValue(res);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  //key press validation
  keyPressValidation(event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the Bank Details Form is valid
  isValid() {
    if (this.bankDetailsForm.valid) {
      return true;
    } else {
      this.bankDetailsForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get partners array, calls by layout component
  getBankDetail() {
    let bankDetail = new Bank_Detail();
    bankDetail = this.bankDetailsForm.value;
    bankDetail.Id = this.bankId ? this.bankId : 0;
    bankDetail.Form_Id = this.form_Id;
    return bankDetail;
  }
}
