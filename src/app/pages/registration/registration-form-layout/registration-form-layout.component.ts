import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressComponent } from '../address/address.component';
import { Address } from '../../../Models/Dtos';
import { DomesticForm } from '../../../Models/DomesticForm';
import { ContactsComponent } from '../contacts/contacts.component';
import { PartnersComponent } from '../partners/partners.component';

@Component({
  selector: 'ngx-registration-form-layout',
  templateUrl: './registration-form-layout.component.html',
  styleUrls: ['./registration-form-layout.component.scss']
})
export class RegistrationFormLayoutComponent implements OnInit {
  @ViewChild(AddressComponent) addressComponent: AddressComponent;
  @ViewChild(ContactsComponent) contactsComponent: ContactsComponent;
  @ViewChild(PartnersComponent) partnersComponent: PartnersComponent;

  constructor() {

  }
  ngOnInit(): void {

  }

  domesticFormPayload() {
    if (this.addressComponent.isValid() &&
        this.contactsComponent.isValid() &&
        this.partnersComponent.isValid()) {
      let domesticForm = new DomesticForm();
      domesticForm.Addresses = this.addressComponent.getAddresses();
      domesticForm.Contacts = this.contactsComponent.getContacts();
      domesticForm.ProprietorOrPartners = this.partnersComponent.getProprietorOrPartners();
      console.log(domesticForm)
    }
  }

  submit() {
    this.domesticFormPayload();
  }

}
