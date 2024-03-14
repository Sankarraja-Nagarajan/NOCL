import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../../../Services/login.service';

@Component({
  selector: 'ngx-vendor-branches',
  templateUrl: './vendor-branches.component.html',
  styleUrls: ['./vendor-branches.component.scss']
})
export class VendorBranchesComponent implements OnInit {

  data = [];
  dataSource = new MatTableDataSource(this.data);
  displayedColumns: string[] = [
    'name',
    'designation',
    'mobileNo',
    'emailId',
    'location',
    'action'
  ];
  VendorBranchForm: FormGroup;

  constructor(private _fb: FormBuilder,private _services:LoginService) {}

  ngOnInit(): void {
    this.VendorBranchForm = this._fb.group({
      Name: [''],
      Designation: [''],
      EmailId: ['', [Validators.email]],
      MobileNo: [''],
      Location: ['']
    });
  }

  checkNumber(e: KeyboardEvent) {
    this._services.numberOnly(e);
  }

  addVendorBranch() {
    if (this.VendorBranchForm.valid) {
      this.data.push(this.VendorBranchForm.value);
      this.dataSource = new MatTableDataSource(this.data);
      this.VendorBranchForm.reset();
    }
    else {
      this.VendorBranchForm.markAllAsTouched();
    }
  }

  removeVendorBranch(i: number) {
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}