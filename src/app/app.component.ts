/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { SeoService } from "./@core/utils/seo.service";
import { NbMenuItem } from "@nebular/theme";
import { Sample } from "./Pages/pages-menu";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  menu: NbMenuItem[] = [];
  _sample = new Sample();

  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._router.events.subscribe({
      next:(res)=>{
        this.menu = this._sample.getMenuItems();
      }
    });
    
  }
}
