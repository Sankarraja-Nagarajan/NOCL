import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../../../Services/login.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: "./one-column.layout.html",
})
export class OneColumnLayoutComponent implements OnInit
{

  isLogin: boolean = true;
  isDashboardShown:boolean=true;
  constructor(private _router: Router, private _nav: LoginService) {}
  ngOnInit(): void 
  {
    this._router.events.subscribe({
      next: (res) => {
        if (res instanceof NavigationEnd) {
          if (
            res.url.includes("login") ||
            res.url.includes("otp") ||
            res.url.includes("forgot") ||
            res.url == "/" ||
            res.url.includes("error")
          ) {
            this.isLogin = false;
          } else {
            this.isLogin = true;
          }
          if(res.url.includes('onboarding/dashboard') || res.url.includes('masters/user')){
            this.isDashboardShown = false;
          }
          else{
            this.isDashboardShown = true;
          }
        }
      },
    });
  }

}
