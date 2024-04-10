import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../Services/user.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { Role, User } from "../../../Models/Dtos";
import { MasterService } from "../../../Services/master.service";
import { forkJoin } from "rxjs";
import { subscribe } from "diagnostics_channel";
import { error } from "console";

@Component({
  selector: "ngx-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  roles: Role[] = [];
  selectedItem: User;
  filteredUsers: User[] = [];
  loader: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _user: UserService,
    private _common: CommonService,
    private _master: MasterService
  ) {}
  ngOnInit(): void {
    this.userForm = this._fb.group({
      Employee_Id: ["", Validators.required],
      First_Name: ["", [Validators.required]],
      Middle_Name: [""],
      Last_Name: [""],
      Email: ["", [Validators.required, Validators.email]],
      Mobile_No: ["", [Validators.required]],
      Role_Id: ["", [Validators.required]],
      Reporting_Manager_EmpId: [""],
      IsActive: [true],
    });

    this.loader = true;
    this._master.getRoles().subscribe({
      next: (res) => {
        this.roles = res as Role[];
        this.getUsers();
      },
      error:(err)=>{
        this.loader = false;
      }
    });
  }

  getAllMasters() {
    forkJoin([this._master.getRoles(), this._user.getUsers()]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.roles = res as Role[];
        }
        if (res[1]) {
          this.users = res as User[];
          this.filteredUsers = this.users;
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  // validation for inputs
  keyPressValidation(event: Event, type: string) {
    return this._common.KeyPressValidation(event, type);
  }

  // filter user
  filterUser(filterValue: string) {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.Display_Name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.Employee_Id.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  // show user detail
  showUserDetail(user: User) {
    this.userForm.patchValue(user);
    this.selectedItem = user;
  }

  // reset form
  resetForm() {
    this.userForm.reset({
      IsActive: true,
    });
    this.selectedItem = null;
  }

  // get users
  getUsers() {
    this._user.getUsers().subscribe({
      next: (res) => {
        if (res) {
          this.users = res as User[];
          this.filteredUsers = this.users;
          this.loader = false;
        }
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  // create user
  createUser() {
    if (this.userForm.valid) {
      this._user.addUser(this.userForm.value as User).subscribe({
        next: (res) => {
          if (res && res.Status == 200) {
            this.resetForm();
            this.getUsers();
            this._common.openSnackbar(res.Message, snackbarStatus.Success);
          }
        },
        error: (err) => {
          this._common.openSnackbar(err, snackbarStatus.Danger);
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  // update user
  updateUser() {
    if (this.userForm.valid) {
      this._user.updateUser(this.userForm.value as User).subscribe({
        next: (res) => {
          if (res && res.Status == 200) {
            this.resetForm();
            this.getUsers();
            this._common.openSnackbar(res.Message, snackbarStatus.Success);
          }
        },
        error: (err) => {
          this._common.openSnackbar(err, snackbarStatus.Danger);
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  // delete user
  deleteUser() {
    if (this.userForm.valid) {
      let user = this.userForm.value as User;
      user.IsActive = false;
      this._user.softDeleteUser(user).subscribe({
        next: (res) => {
          if (res && res.Status == 200) {
            this.resetForm();
            this.getUsers();
            this._common.openSnackbar(res.Message, snackbarStatus.Success);
          }
        },
        error: (err) => {
          this._common.openSnackbar(err, snackbarStatus.Danger);
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
