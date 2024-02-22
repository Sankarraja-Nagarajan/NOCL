/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { MENU_ITEMS } from './pages/pages-menu';

@Component({
  selector: 'ngx-app',
  templateUrl: "./app.component.html",
  styleUrls:["./app.component.scss"]
})
export class AppComponent implements OnInit {


  menu = MENU_ITEMS;
  
  constructor(private analytics: AnalyticsService, private seoService: SeoService) {
  }

  ngOnInit(): void {
   
  }
}
