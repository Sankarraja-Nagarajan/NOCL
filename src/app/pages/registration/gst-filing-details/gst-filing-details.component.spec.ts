import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GstFilingDetailsComponent } from './gst-filing-details.component';

describe('GstFilingDetailsComponent', () => {
  let component: GstFilingDetailsComponent;
  let fixture: ComponentFixture<GstFilingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstFilingDetailsComponent]
    });
    fixture = TestBed.createComponent(GstFilingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
