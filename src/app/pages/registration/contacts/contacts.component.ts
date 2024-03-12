import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../../../Services/login.service';

@Component({
  selector: 'ngx-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  data = [
    {
      Name: 'User',
      Designation: 'Vendor',
      PhoneNo: '+91 804111 5686',
      EmailId: 'example@exalca.com',
      MobileNo: '+91 804111 5686',
      ContactTypeId: '1'
    }
  ];
  dataSource = new MatTableDataSource(this.data);
  displayedColumns: string[] = [
    'contactTypeId',
    'name',
    'designation',
    'phoneNo',
    'emailId',
    'mobileNo',
    'action'
  ];
  contactForm: FormGroup;

  constructor(private _fb: FormBuilder,private _services:LoginService) {}

  ngOnInit(): void {
    this.contactForm = this._fb.group({
      Name: [''],
      Designation: [''],
      PhoneNo: [''],
      EmailId: ['', [Validators.email]],
      MobileNo: [''],
      ContactTypeId: ['', [Validators.required]],
    });
  }
  
  checkNumber(e: KeyboardEvent) {
    this._services.numberOnly(e);
  }

  addContact() {
    if (this.contactForm.valid) {
      this.data.push(this.contactForm.value);
      this.dataSource = new MatTableDataSource(this.data);
      this.contactForm.reset();
    }
    else {
      this.contactForm.markAllAsTouched();
    }
  }

  removeContact(i: number) {
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}