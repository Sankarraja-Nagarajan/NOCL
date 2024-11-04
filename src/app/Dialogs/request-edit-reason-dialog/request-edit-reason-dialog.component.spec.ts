import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEditReasonDialogComponent } from './request-edit-reason-dialog.component';

describe('RequestEditReasonDialogComponent', () => {
  let component: RequestEditReasonDialogComponent;
  let fixture: ComponentFixture<RequestEditReasonDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestEditReasonDialogComponent]
    });
    fixture = TestBed.createComponent(RequestEditReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
