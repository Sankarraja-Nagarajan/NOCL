import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'ngx-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent {


  displayedColumns: string[] = [
    'vendorCode',
    'vendorName',
    'typeOfVendor',
    'onboardingDate',
    'view',
  ];

  data = [
    {
      vendorCode: 'exalca101',
      vendorName: 'Exalca',
      typeOfVendor: 'providers ',
      onboardingDate: '01/01/2024',
    },
    {
      vendorCode: 'exalca101',
      vendorName: 'Exalca',
      typeOfVendor: 'providers ',
      onboardingDate: '01/01/2024',
    },
    {
      vendorCode: 'exalca101',
      vendorName: 'Exalca',
      typeOfVendor: 'providers ',
      onboardingDate: '01/01/2024',
    },
    {
      vendorCode: 'exalca101',
      vendorName: 'Exalca',
      typeOfVendor: 'providers ',
      onboardingDate: '01/01/2024',
    },
    {
      vendorCode: 'exalca101',
      vendorName: 'Exalca',
      typeOfVendor: 'providers ',
      onboardingDate: '01/01/2024',
    },
    {
      vendorCode: 'exalca101',
      vendorName: 'Exalca',
      typeOfVendor: 'providers ',
      onboardingDate: '01/01/2024',
      visibility:false,
    }
  ];

  dataSource = new MatTableDataSource(this.data);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() {

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
