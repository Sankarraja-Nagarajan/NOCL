import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticVendorOrgProfileComponent } from './domestic-vendor-org-profile.component';

describe('DomesticVendorOrgProfileComponent', () => {
  let component: DomesticVendorOrgProfileComponent;
  let fixture: ComponentFixture<DomesticVendorOrgProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomesticVendorOrgProfileComponent]
    });
    fixture = TestBed.createComponent(DomesticVendorOrgProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
