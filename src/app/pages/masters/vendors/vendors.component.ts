import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NbRouteTab } from '@nebular/theme';


@Component({
  selector: 'ngx-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  tabChange: EventEmitter<NbRouteTab> = new EventEmitter();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  vendorType:string;
  constructor() {

  }

  ngOnInit(): void {
    
  }

  onTabChange(event: any) {
    this.vendorType = event.tabTitle;
  }

}
