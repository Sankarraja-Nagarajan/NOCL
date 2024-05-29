import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CommonService } from "../../../Services/common.service";
import { NbUser } from "@nebular/auth";
import { Router } from "@angular/router";
import { LoginService } from "../../../Services/login.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ChangePasswordComponent } from "../../../Dialogs/change-password/change-password.component";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { RegistrationService } from "../../../Services/registration.service";
import { ExpiryDetails } from "../../../Models/Registration";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  userPictureOnly: boolean = true;
  picture: string;
  name: string = "";
  title: string = "";
  userMenu = [{ title: "Change Password" }, { title: "Log out" }];
  userData: any;
  ExpiryDetails: boolean = false;
  allExpiryDetails: ExpiryDetails[] = []
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private _common: CommonService,
    private _router: Router,
    private _dialog: MatDialog, private _registration: RegistrationService,
  ) { }

  ngOnInit() {
    this.picture = "../../../../assets/images/dummy-user.png";
    const USER = sessionStorage.getItem("userDetails");
    if (USER) {
      this.userData = JSON.parse(USER);
      this.name = this.userData.DisplayName;
      this.title = this.userData.Role;
    }

    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu-tag"),
        map(({ item: { title } }) => title)
      )
      .subscribe({
        next: (title) => {
          if (title == "Log out") {
            sessionStorage.clear();
            this._router.navigate(["auth/login"]);
          }
          if (title == "Change Password") {
            this.openChangePasswordDialog();
          }
        },
        error: (err) => { },
      });
      this. Notification() ;
  }
  Notification() {
    this.ExpiryDetails = true;
   this._router.navigate(["onboarding/expiry-details"])
    this._registration.getAllExpiryNotifications().subscribe({
      next: (res) => {
        this.allExpiryDetails = res as ExpiryDetails[];
        console.log("getExpiryNotifications : ", this.allExpiryDetails);
      }
    });
  }

  ngOnDestroy() { }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    this._common.getStateOfSidebar();
    return false;
  }

  openChangePasswordDialog() {
    const dialogconfig: MatDialogConfig = {
      data: {},
      autoFocus: false,
    };
    const dialogRef = this._dialog.open(ChangePasswordComponent, dialogconfig);
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this._common.openSnackbar(
            "Your Password hasbeen updated successfully",
            snackbarStatus.Success
          );
        }
      },
      error: (err) => { },
    });
  }
}
