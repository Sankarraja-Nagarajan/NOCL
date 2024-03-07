import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBranchesComponent } from './vendor-branches.component';

describe('VendorBranchesComponent', () => {
  let component: VendorBranchesComponent;
  let fixture: ComponentFixture<VendorBranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorBranchesComponent]
    });
    fixture = TestBed.createComponent(VendorBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
