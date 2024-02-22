import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'name',
    'shortName',
    'type',
    'country',
    'phoneNumber',
    'email',
    'date',
    'status',
    'action'];
  data = [
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    },
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    },
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    },
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    },
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    },
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    },
    {
      Name:'Exalca Technologies',
      ShortName:'Exalca',
      Type:'Domestic Type',
      Country:'India',
      PhoneNumber:'12345 67890',
      Email:'example@exalca.com',
      Date: new Date,
      Status:'Registered',
    }
  ];
  dataSource = new MatTableDataSource(this.data);
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() {

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
