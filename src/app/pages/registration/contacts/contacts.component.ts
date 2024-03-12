import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';

@Component({
  selector: 'ngx-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  dataSource = new MatTableDataSource(this.contacts);
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
  formId: number = 1;

  constructor(private _fb: FormBuilder,
    private _commonService: CommonService) {

  }

  ngOnInit(): void {
    // contact form Initialization
    this.contactForm = this._fb.group({
      Contact_Type_Id: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      Designation: [''],
      Email_Id: ['', [Validators.required, Validators.email]],
      Phone_Number: ['', [Validators.maxLength(15)]],
      Mobile_Number: ['', [Validators.maxLength(15)]],
    });
  }

  // Allow (numbers, plus, and space) for Mobile & Phone
  keyPressValidation(event) {
    return this._commonService.KeyPressValidation(event)
  }

  // Add address to the table
  addContact() {
    if (this.contactForm.valid) {
      this.contacts.push(this.contactForm.value);
      this.dataSource._updateChangeSubscription();
      this.contactForm.reset();
    }
    else {
      this.contactForm.markAllAsTouched();
    }
  }

  // Remove Address from table
  removeContact(i: number) {
    this.contacts.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Make sure the contacts array has at least one value
  isValid() {
    if (this.contacts.length > 0) {
      return true;
    }
    console.log('Contact must be there')
    return false;
  }

  // Get contacts array, calls by layout component
  getContacts() {

    this.contacts.forEach((element) => {
      element.Contact_Id = 0;
      element.Form_Id = this.formId;
    });
    return this.contacts;
  }
}