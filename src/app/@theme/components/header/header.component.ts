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
  userMenu = [{ title: "Profile" }, { title: "Log out" }];
  userData: any;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private commonservice: CommonService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.picture = "../../../../assets/images/dummy-user.png";
    const USER = sessionStorage.getItem('userDetails');
    if (USER) {
      this.userData = JSON.parse(USER)
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
        },
        error: (err) => { },
      });
  }

  ngOnDestroy() { }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    this.commonservice.getStateOfSidebar();
    return false;
  }
}
