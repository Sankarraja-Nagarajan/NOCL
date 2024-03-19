import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMajorCustomerDialogComponent } from './add-major-customer-dialog.component';

describe('AddMajorCustomerDialogComponent', () => {
  let component: AddMajorCustomerDialogComponent;
  let fixture: ComponentFixture<AddMajorCustomerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMajorCustomerDialogComponent]
    });
    fixture = TestBed.createComponent(AddMajorCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
