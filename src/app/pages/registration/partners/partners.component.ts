import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProprietorOrPartner } from '../../../Models/Dtos';

@Component({
  selector: 'ngx-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})


export class PartnersComponent implements OnInit {
  proprietOrsOrPartners: ProprietorOrPartner[] = [];
  dataSource = new MatTableDataSource(this.proprietOrsOrPartners);
  displayedColumns: string[] = [
    'name',
    'percentageShare',
    'action'
  ];
  partnersForm: FormGroup;
  formId: number = 1;

  constructor(private _fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.partnersForm = this._fb.group({
      Name: ['', [Validators.required]],
      PercentageShare: ['', [Validators.required]],
    })
  }

  addPartners() {
    if (this.partnersForm.valid) {
      this.proprietOrsOrPartners.push(this.partnersForm.value);
      this.dataSource._updateChangeSubscription();
      this.partnersForm.reset();
    }
    else {
      this.partnersForm.markAllAsTouched();
    }
  }

  removePartners(i) {
    this.proprietOrsOrPartners.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Make sure the proprietOrsOrPartners array has at least one value
  isValid() {
    if (this.proprietOrsOrPartners.length > 0) {
      return true;
    }
    return false;
  }

  // Get partners array, calls by layout component
  getProprietorOrPartners() {
    this.proprietOrsOrPartners.forEach((element) => {
      element.Id = 0;
      element.Form_Id = this.formId;
    });
    return this.proprietOrsOrPartners;
  }
}
