import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticVendorPersonalInfoComponent } from './domestic-vendor-personal-info.component';

describe('DomesticVendorPersonalInfoComponent', () => {
  let component: DomesticVendorPersonalInfoComponent;
  let fixture: ComponentFixture<DomesticVendorPersonalInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomesticVendorPersonalInfoComponent]
    });
    fixture = TestBed.createComponent(DomesticVendorPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
