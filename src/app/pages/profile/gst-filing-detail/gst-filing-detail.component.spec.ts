import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstFilingDetailComponent } from './gst-filing-detail.component';

describe('GstFilingDetailComponent', () => {
  let component: GstFilingDetailComponent;
  let fixture: ComponentFixture<GstFilingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstFilingDetailComponent]
    });
    fixture = TestBed.createComponent(GstFilingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
