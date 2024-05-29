import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { Contact } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { LoginService } from "../../../Services/login.service";
import { ContactType } from "../../../Models/Master";
import { MasterService } from "../../../Services/master.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { forkJoin } from "rxjs";
import { RegistrationService } from "../../../Services/registration.service";
import { getSession } from "../../../Utils";

@Component({
  selector: "ngx-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
})
export class ContactsComponent implements OnInit {
  @Input() form_Id: number;

  contacts: Contact[] = [];
  dataSource = new MatTableDataSource(this.contacts);
  displayedColumns: string[] = [
    "contactTypeId",
    "name",
    "designation",
    "phoneNo",
    "emailId",
    "mobileNo",
    "action",
  ];
  contactForm: FormGroup;
  contactTypes: ContactType[] = [];
  role: string = "";
  editIndex: number = -1;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _master: MasterService,
    private _registration: RegistrationService
  ) {}

  ngOnInit(): void {
    // contact form Initialization
    this.contactForm = this._fb.group({
      Contact_Type_Id: ["", [Validators.required]],
      Name: ["", [Validators.required]],
      Designation: [""],
      Email_Id: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z][a-z0-9._-]+@[a-z]+\\.[a-z]{2,3}$"),
        ],
      ],
      Phone_Number: ["", [Validators.maxLength(11), Validators.minLength(11)]],
      Mobile_Number: [
        "",
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
    });

    // get contact types and contacts data by form id
    this.getMasterData();
    const userData = JSON.parse(getSession("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  // Allow (numbers, plus, and space) for Mobile & Phone
  keyPressValidation(event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Add contact to the table
  addContact() {
    if (this.contactForm.valid) {
      this.dataSource.data.push(this.contactForm.value);
      this.dataSource._updateChangeSubscription();
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  // Update contact to the table
  updateContact() {
    if (this.editIndex >= 0) {
      let id = this.dataSource.data[this.editIndex].Contact_Id;
      this.dataSource.data[this.editIndex] = this.contactForm.value;
      this.dataSource.data[this.editIndex].Contact_Id = id;
      this.dataSource._updateChangeSubscription();
      this.contactForm.reset();
      this.editIndex = -1;
    }
  }

  // Remove contact from table
  removeContact(i: number) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Edit Contact from table
  editContact(i: number) {
    this.contactForm.patchValue(this.dataSource.data[i]);
    this.editIndex = i;
  }

  // Make sure the contacts array has at least one value
  isValid() {
    if (this.dataSource.data.length > 0) {
      return true;
    } else {
      console.log("contacts");
      this.contactForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get contacts array, calls by layout component
  getContacts() {
    this.contacts = this.dataSource.data;
    this.contacts.forEach((element) => {
      element.Contact_Id = element.Contact_Id ? element.Contact_Id : 0;
      element.Form_Id = this.form_Id;
    });
    return this.contacts;
  }

  getContactTypeById(contactTypeId: number): string {
    const type = this.contactTypes.find(
      (type) => type.Contact_Type_Id === contactTypeId
    );
    return type ? type.Contact_Type : "";
  }

  getMasterData() {
    forkJoin([
      this._master.getContactTypes(),
      this._registration.getFormData(this.form_Id, "Contacts"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.contactTypes = res[0] as ContactType[];
        }
        if (res[1]) {
          this.contacts = res[1] as Contact[];
          this.dataSource = new MatTableDataSource(this.contacts);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  markContactFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.contactForm.markAllAsTouched();
    }
  }
}
