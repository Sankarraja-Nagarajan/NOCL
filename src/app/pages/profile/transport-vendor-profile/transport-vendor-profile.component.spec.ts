import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportVendorProfileComponent } from './transport-vendor-profile.component';

describe('TransportVendorProfileComponent', () => {
  let component: TransportVendorProfileComponent;
  let fixture: ComponentFixture<TransportVendorProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportVendorProfileComponent]
    });
    fixture = TestBed.createComponent(TransportVendorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
