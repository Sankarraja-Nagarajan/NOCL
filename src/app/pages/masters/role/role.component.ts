import { Component, OnInit } from "@angular/core";
import { Role } from "../../../Models/Dtos";
import { FormControl } from "@angular/forms";
import { MasterService } from "../../../Services/master.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";

@Component({
  selector: "ngx-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.scss"],
})
export class RoleComponent implements OnInit {
  loader: boolean = false;
  roles: Role[] = [
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
    { Role_Id: 1, Role_Name: "Admin" },
    { Role_Id: 2, Role_Name: "PO" },
  ];
  filteredRoles: Role[];
  action: string = "Create";
  roleControl: FormControl = new FormControl();
  role: Role = new Role();

  constructor(private _master: MasterService, private _common: CommonService) {}
  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.loader = true;
    this._master.getRoles().subscribe({
      next: (res) => {
        this.roles = res as Role[];
        this.filteredRoles = this.roles;
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
      },
    });
  }

  filterRoles(val: string) {
    this.filteredRoles = this.roles.filter((x) =>
      x.Role_Name.toLowerCase().includes(val.toLowerCase())
    );
  }

  create() {
    this.action = "Create";
    this.roleControl.reset();
    this.role = new Role();
  }

  update(val: Role) {
    this.action = "Update";
    this.roleControl.patchValue(val.Role_Name);
  }

  createRole() {
    this.loader = true;
    this.role.Role_Name = this.roleControl.value;
    this.role.Role_Id = 0;
    this._master.createRole(this.role).subscribe({
      next: (res) => {
        this.loader = false;
        if (res) {
          this._common.openSnackbar(
            "Role Added successfully",
            snackbarStatus.Success
          );
          this.getAllRoles();
        }
      },
      error: (err) => {
        this.loader = false;
      },
    });
  }
}
