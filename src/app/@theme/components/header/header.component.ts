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

export class User {
  name: string;
  title: string;
  picture: string;
}

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  userPictureOnly: boolean = false;
  user: User = new User();

  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private commonservice: CommonService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.user.name = "Gana";
    this.user.title = "Domestic PO";
    this.user.picture = "../../../../assets/images/dummy-user.png";

    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu-tag"),
        map(({ item: { title } }) => title)
      )
      .subscribe({
        next:(title) => {
          if(title == "Log out"){ 
            sessionStorage.clear();
            this._router.navigate(["auth/login"]);
          }
        },
        error:(err)=>{

        }
      });
  }

  ngOnDestroy() {}

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    this.commonservice.getStateOfSidebar();
    return false;
  }
}
