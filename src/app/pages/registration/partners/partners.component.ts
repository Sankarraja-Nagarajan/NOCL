import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProprietorOrPartner } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { RegistrationService } from '../../../Services/registration.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';

@Component({
  selector: "ngx-partners",
  templateUrl: "./partners.component.html",
  styleUrls: ["./partners.component.scss"],
})
export class PartnersComponent implements OnInit {
  @Input() form_Id: number;
  
  proprietOrsOrPartners: ProprietorOrPartner[] = [];
  dataSource = new MatTableDataSource(this.proprietOrsOrPartners);
  displayedColumns: string[] = ["name", "percentageShare", "action"];
  partnersForm: FormGroup;
  role: string = "";

  constructor(private _fb: FormBuilder, 
    private _commonService:CommonService,
    private _registration:RegistrationService) {
  }
  ngOnInit(): void {
    this.partnersForm = this._fb.group({
      Name: ["", [Validators.required]],
      PercentageShare: ["", [Validators.required]],
    });

    // Get Proprietor or Partners data by form Id
    this._registration.getFormData(this.form_Id, 'ProprietorOrPartners').subscribe({
      next: (res) => {
        if (res) {
          this.proprietOrsOrPartners = res;
          this.dataSource = new MatTableDataSource(this.proprietOrsOrPartners);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      }
    });
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";

  }

  addPartners() {
    if (this.partnersForm.valid) {
      this.proprietOrsOrPartners.push(this.partnersForm.value);
      this.dataSource._updateChangeSubscription();
      this.partnersForm.reset();
    } else {
      this.partnersForm.markAllAsTouched();
    }
  }

  removePartners(i) {
    this.proprietOrsOrPartners.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // validation for name
  keyPressValidation(event: Event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the proprietOrsOrPartners array has at least one value
  isValid() {
    if (this.proprietOrsOrPartners.length > 0) {
      return true;
    } else {
      this.partnersForm.markAllAsTouched();
      return false;
    }
  }

  // Get partners array, calls by layout component
  getProprietorOrPartners() {
    this.proprietOrsOrPartners.forEach((element) => {
      element.Id = 0;
      element.Form_Id = this.form_Id;
    });
    return this.proprietOrsOrPartners;
  }
}
